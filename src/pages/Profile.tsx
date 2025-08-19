import { useState, useEffect, useCallback } from "react";
import {
  User,
  Edit,
  Save,
  X,
  Package,
  Heart,
  Settings,
  Truck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface DeliveryAddress {
  address: string;
  city: string;
  postalCode?: string;
  country: string;
}

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: DeliveryAddress | string;
  items: OrderItem[];
  subtotal: number;
  shipping_charge: number;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string | null;
  tracking_id: string | null;
  tracking_status: string | null;
  delivery_notes: string | null;
  shipped_at: string | null;
  created_at: string;
  // Additional fields for compatibility
  email?: string;
  phone?: string;
  delivery_address?: DeliveryAddress | string;
  total?: number;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setProfile(data);
      if (data) {
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error loading profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch orders for the logged-in user from the guest_orders table
      const { data, error } = await supabase
        .from("guest_orders")
        .select("*")
        .eq("customer_email", user.email)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Process the orders similar to the admin panel
      const processedOrders = (data || []).map((order) => {
        const parsedItems =
          typeof order.items === "string"
            ? JSON.parse(order.items)
            : order.items || [];

        // Calculate subtotal if not present
        const subtotal =
          order.subtotal ||
          parsedItems.reduce(
            (sum: number, item: OrderItem) => sum + item.price * item.quantity,
            0
          );

        return {
          id: order.id,
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          customer_phone: order.customer_phone,
          shipping_address:
            typeof order.shipping_address === "string"
              ? JSON.parse(order.shipping_address)
              : order.shipping_address || {},
          items: parsedItems,
          subtotal: subtotal,
          shipping_charge: order.shipping_charge || 0,
          total_amount: order.total_amount,
          status: order.status || "pending",
          payment_method: order.payment_method || "cash_on_delivery",
          payment_status: order.payment_status || "pending",
          transaction_id: order.transaction_id || null,
          tracking_id: order.tracking_id || null,
          tracking_status: order.tracking_status || null,
          delivery_notes: order.delivery_notes || null,
          shipped_at: order.shipped_at || null,
          created_at: order.created_at,
          // Additional fields for backward compatibility
          email: order.customer_email,
          phone: order.customer_phone,
          delivery_address:
            typeof order.shipping_address === "string"
              ? JSON.parse(order.shipping_address)
              : order.shipping_address || {},
          total: order.total_amount,
        };
      });

      setOrders(processedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user, fetchProfile, fetchOrders]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setProfile({ id: user.id, ...formData });
      setEditing(false);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTrackOrder = (trackingId: string) => {
    window.open(
      `https://www.tcsexpress.com/track/?consignmentNo=${trackingId}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 spiritual-pattern">
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">
              My <span className="font-script text-primary">Profile</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your account and view your order history
            </p>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!editing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(false);
                        if (profile) {
                          setFormData({
                            first_name: profile.first_name || "",
                            last_name: profile.last_name || "",
                            phone: profile.phone || "",
                          });
                        }
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="btn-spiritual"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!editing}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      disabled={!editing}
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      disabled={!editing}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No orders yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start shopping to see your orders here
                    </p>
                    <Button className="btn-spiritual">Browse Products</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div key={order.id}>
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold">
                                Order #{order.id}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(order.created_at),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Payment:{" "}
                                {order.payment_method
                                  ?.replace("_", " ")
                                  .toUpperCase()}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </Badge>
                              <Badge
                                className={getPaymentStatusColor(
                                  order.payment_status
                                )}
                                variant="outline"
                              >
                                {order.payment_status?.toUpperCase() ||
                                  "PENDING"}
                              </Badge>
                            </div>
                          </div>

                          {/* Tracking Information */}
                          {order.tracking_id && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-blue-800 flex items-center gap-2">
                                    <Truck className="h-4 w-4" />
                                    Tracking Information
                                  </p>
                                  <p className="text-sm text-blue-700 mt-1">
                                    Tracking ID:{" "}
                                    <span className="font-mono font-semibold">
                                      {order.tracking_id}
                                    </span>
                                  </p>
                                  <p className="text-sm text-blue-600">
                                    Status:{" "}
                                    <span className="font-semibold">
                                      {order.tracking_status?.toUpperCase() ||
                                        "SHIPPED"}
                                    </span>
                                  </p>
                                </div>
                                <Button
                                  onClick={() =>
                                    handleTrackOrder(order.tracking_id!)
                                  }
                                  className="bg-blue-600 hover:bg-blue-700"
                                  size="sm"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Track Order
                                </Button>
                              </div>
                              {order.delivery_notes && (
                                <div className="mt-3 pt-3 border-t border-blue-200">
                                  <p className="text-sm text-blue-700">
                                    <strong>Delivery Notes:</strong>{" "}
                                    {order.delivery_notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Show tracking message for confirmed orders without tracking */}
                          {order.status === "confirmed" &&
                            !order.tracking_id && (
                              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                                <p className="text-sm text-yellow-800">
                                  <strong>📦 Order Confirmed!</strong> Your
                                  order is being prepared for shipment. Tracking
                                  information will be available once your order
                                  is dispatched.
                                </p>
                              </div>
                            )}

                          {/* Order Items */}
                          <div className="space-y-2 mb-4">
                            <h5 className="text-sm font-medium">Items:</h5>
                            {Array.isArray(order.items) &&
                              order.items.map((item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="flex items-center space-x-3 p-2 bg-muted/30 rounded"
                                >
                                  <img
                                    src={item.image_url || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-12 h-12 object-contain rounded"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "/placeholder.svg";
                                    }}
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Qty: {item.quantity} × PKR {item.price} =
                                      PKR{" "}
                                      {(item.quantity * item.price).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>

                          {/* Order Summary */}
                          <div className="border-t pt-3 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Subtotal:</span>
                              <span>
                                PKR {order.subtotal?.toFixed(2) || "0.00"}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Shipping:</span>
                              <span>
                                PKR{" "}
                                {order.shipping_charge?.toFixed(2) || "0.00"}
                              </span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-1">
                              <span>Total:</span>
                              <span>
                                PKR{" "}
                                {(order.total_amount || order.total)?.toFixed(
                                  2
                                ) || "0.00"}
                              </span>
                            </div>
                          </div>
                        </div>
                        {index < orders.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Preferences</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                        <span className="text-sm">Email notifications</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                        <span className="text-sm">Marketing updates</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">SMS notifications</span>
                      </label>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Account Actions
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Change Password
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-destructive"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
