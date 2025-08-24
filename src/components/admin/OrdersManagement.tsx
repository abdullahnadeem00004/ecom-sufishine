import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { sendShippingNotificationEmail } from "@/lib/emailService";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";

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
  total_amount: number;
  subtotal: number;
  shipping_charge: number;
  status: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string | null;
  tracking_id: string | null;
  tracking_status: string;
  shipped_at: string | null;
  delivery_notes: string | null;
  created_at: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingIdInput, setTrackingIdInput] = useState("");
  const [deliveryNotesInput, setDeliveryNotesInput] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("guest_orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
        } else {
          // Parse JSON fields
          const processedOrders = (data || []).map((order) => {
            const parsedItems =
              typeof order.items === "string"
                ? JSON.parse(order.items)
                : order.items || [];

            // Calculate subtotal if not present
            const subtotal =
              order.subtotal ||
              parsedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );

            return {
              ...order,
              items: parsedItems,
              subtotal: subtotal,
              shipping_address:
                typeof order.shipping_address === "string"
                  ? JSON.parse(order.shipping_address)
                  : order.shipping_address || {},
            };
          });
          setOrders(processedOrders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const channel = supabase
      .channel("guest-orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guest_orders" },
        fetchOrders
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from("guest_orders")
        .update({ status })
        .eq("id", id);

      if (!error) {
        setOrders(
          orders.map((order) =>
            order.id === id ? { ...order, status } : order
          )
        );
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
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

  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "completed":
      case "verified":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const updatePaymentStatus = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("guest_orders")
        .update({ payment_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      // Update the local orders state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, payment_status: newStatus } : order
        )
      );

      // Update selected order if it's the same order
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, payment_status: newStatus });
      }

      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const updateData: Partial<Order> = { status: newStatus };

      // If setting to shipped, also update tracking_status
      if (newStatus === "shipped") {
        updateData.tracking_status = "shipped";
        updateData.shipped_at = new Date().toISOString();
      } else if (newStatus === "delivered") {
        updateData.tracking_status = "delivered";
      }

      const { error } = await supabase
        .from("guest_orders")
        .update(updateData)
        .eq("id", orderId);

      if (error) throw error;

      // Update the local orders state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, ...updateData } : order
        )
      );

      // Update selected order if it's the same order
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, ...updateData });
      }

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const updateTrackingId = async (
    orderId: number,
    trackingId: string,
    deliveryNotes?: string
  ) => {
    try {
      const updateData: Partial<Order> = {
        tracking_id: trackingId,
        tracking_status: "shipped",
        shipped_at: new Date().toISOString(),
      };

      if (deliveryNotes) {
        updateData.delivery_notes = deliveryNotes;
      }

      const { error } = await supabase
        .from("guest_orders")
        .update(updateData)
        .eq("id", orderId);

      if (error) throw error;

      // Get the full order details for the email
      const orderForEmail = orders.find((order) => order.id === orderId);

      if (orderForEmail) {
        // Send shipping notification email
        try {
          // Transform Order to OrderData format for email service
          const emailOrderData = {
            orderId: orderForEmail.id.toString(),
            orderNumber: `ORD-${orderForEmail.id}`,
            customerName: orderForEmail.customer_name,
            customerEmail: orderForEmail.customer_email,
            customerPhone: orderForEmail.customer_phone,
            items: orderForEmail.items,
            subtotal: orderForEmail.subtotal || orderForEmail.total_amount,
            shippingCharge: orderForEmail.shipping_charge || 0,
            total: orderForEmail.total_amount,
            paymentMethod: orderForEmail.payment_method || "Cash on Delivery",
            shippingAddress:
              typeof orderForEmail.shipping_address === "string"
                ? JSON.parse(orderForEmail.shipping_address)
                : orderForEmail.shipping_address,
            trackingId: trackingId,
          };

          await sendShippingNotificationEmail(
            orderForEmail.customer_email,
            emailOrderData
          );
        } catch (emailError) {
          // Don't fail the tracking update if email fails
        }
      }

      // Update the local orders state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, ...updateData } : order
        )
      );

      // Update selected order if it's the same order
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, ...updateData });
      }

      toast({
        title: "Success",
        description:
          "Tracking ID updated successfully and customer notified via email",
      });
    } catch (error) {
      console.error("Error updating tracking ID:", error);
      toast({
        title: "Error",
        description: "Failed to update tracking ID",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading orders...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Orders Management</CardTitle>
          <div className="text-sm text-muted-foreground">
            Total Orders: {orders.length} | Total Revenue: PKR{" "}
            {orders
              .reduce((sum, order) => sum + order.total_amount, 0)
              .toFixed(2)}
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>Shipping</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.customer_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.customer_email}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.customer_phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Items (
                          {Array.isArray(order.items) ? order.items.length : 0})
                        </Button>
                      </TableCell>
                      <TableCell>
                        PKR{" "}
                        {(
                          (order.total_amount || 0) -
                          (order.shipping_charge || 0)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        PKR {order.shipping_charge?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell className="font-medium">
                        PKR {order.total_amount?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {order.payment_method
                            ?.replace("_", " ")
                            .toUpperCase() || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getPaymentStatusBadgeColor(
                            order.payment_status
                          )}
                          variant="secondary"
                        >
                          {order.payment_status?.toUpperCase() || "PENDING"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[100px] truncate font-mono text-xs">
                          {order.transaction_id || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[120px] truncate font-mono text-xs">
                          {order.tracking_id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-green-600">
                                {order.tracking_id}
                              </span>
                              <a
                                href={`https://www.tcsexpress.com/track/?consignmentNo=${order.tracking_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 text-xs"
                                title="Track on TCS"
                              >
                                📦
                              </a>
                            </div>
                          ) : (
                            <span className="text-gray-400">No tracking</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(order.status)}>
                          {order.status?.toUpperCase() || "PENDING"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDistanceToNow(new Date(order.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) =>
                            updateOrderStatus(order.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Order #{selectedOrder.id} Details</CardTitle>
            <Button
              variant="outline"
              onClick={() => setSelectedOrder(null)}
              className="w-fit"
            >
              Close
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Name:</strong> {selectedOrder.customer_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.customer_email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.customer_phone}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Delivery Address</h4>
                <div className="text-sm">
                  {typeof selectedOrder.shipping_address === "object" &&
                  selectedOrder.shipping_address ? (
                    <div className="space-y-1">
                      <p>{selectedOrder.shipping_address.address}</p>
                      <p>
                        {selectedOrder.shipping_address.city}{" "}
                        {selectedOrder.shipping_address.postalCode}
                      </p>
                      <p>{selectedOrder.shipping_address.country}</p>
                    </div>
                  ) : (
                    <p>{String(selectedOrder.shipping_address)}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Payment Information</h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Payment Method:</strong>{" "}
                      {selectedOrder.payment_method
                        ?.replace("_", " ")
                        .toUpperCase()}
                    </p>
                    <p>
                      <strong>Payment Status:</strong>
                      <Badge
                        className={`ml-2 ${getPaymentStatusBadgeColor(
                          selectedOrder.payment_status
                        )}`}
                        variant="secondary"
                      >
                        {selectedOrder.payment_status?.toUpperCase() ||
                          "PENDING"}
                      </Badge>
                    </p>
                    {selectedOrder.transaction_id && (
                      <p>
                        <strong>Transaction ID:</strong>{" "}
                        <code className="bg-muted px-1 rounded text-xs">
                          {selectedOrder.transaction_id}
                        </code>
                      </p>
                    )}
                  </div>
                  <div>
                    <p>
                      <strong>Update Payment Status:</strong>
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updatePaymentStatus(selectedOrder.id, "verified")
                        }
                        className="bg-green-50 hover:bg-green-100"
                      >
                        Mark Verified
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updatePaymentStatus(selectedOrder.id, "pending")
                        }
                        className="bg-orange-50 hover:bg-orange-100"
                      >
                        Mark Pending
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updatePaymentStatus(selectedOrder.id, "failed")
                        }
                        className="bg-red-50 hover:bg-red-100"
                      >
                        Mark Failed
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tracking Information Section */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Shipping & Tracking</h4>
                  <div className="space-y-4">
                    <div>
                      <p>
                        <strong>Current Tracking ID:</strong>{" "}
                        {selectedOrder.tracking_id ? (
                          <div className="inline-flex items-center gap-2 mt-1">
                            <code className="bg-muted px-2 py-1 rounded text-sm">
                              {selectedOrder.tracking_id}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(
                                  `https://www.tcsexpress.com/track/?consignmentNo=${selectedOrder.tracking_id}`,
                                  "_blank"
                                )
                              }
                              className="h-6 px-2 text-xs"
                            >
                              Track on TCS 📦
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            No tracking ID set
                          </span>
                        )}
                      </p>
                    </div>

                    <div>
                      <p>
                        <strong>Tracking Status:</strong>{" "}
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            selectedOrder.tracking_status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : selectedOrder.tracking_status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedOrder.tracking_status?.toUpperCase() ||
                            "PENDING"}
                        </span>
                      </p>
                    </div>

                    {selectedOrder.status === "confirmed" && (
                      <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">
                          Order is confirmed - Ready to add tracking information
                        </p>

                        <div className="space-y-3">
                          <div>
                            <Label
                              htmlFor="tracking-id"
                              className="text-sm font-medium"
                            >
                              TCS Tracking ID / Consignment Number
                            </Label>
                            <Input
                              id="tracking-id"
                              value={trackingIdInput}
                              onChange={(e) =>
                                setTrackingIdInput(e.target.value)
                              }
                              placeholder="Enter TCS tracking number (e.g., TCS123456789)"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="delivery-notes"
                              className="text-sm font-medium"
                            >
                              Delivery Notes (Optional)
                            </Label>
                            <Textarea
                              id="delivery-notes"
                              value={deliveryNotesInput}
                              onChange={(e) =>
                                setDeliveryNotesInput(e.target.value)
                              }
                              placeholder="Add any delivery instructions or notes..."
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                          <Button
                            onClick={() => {
                              if (trackingIdInput.trim()) {
                                updateTrackingId(
                                  selectedOrder.id,
                                  trackingIdInput.trim(),
                                  deliveryNotesInput.trim()
                                );
                                setTrackingIdInput("");
                                setDeliveryNotesInput("");
                              } else {
                                toast({
                                  title: "Error",
                                  description: "Please enter a tracking ID",
                                  variant: "destructive",
                                });
                              }
                            }}
                            className="w-full"
                          >
                            Add Tracking ID & Mark as Shipped
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedOrder.delivery_notes && (
                      <div>
                        <p>
                          <strong>Delivery Notes:</strong>
                        </p>
                        <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
                          {selectedOrder.delivery_notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Order Items</h4>
              <div className="space-y-2">
                {Array.isArray(selectedOrder.items) &&
                  selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} | Unit Price: PKR{" "}
                            {item.price}
                          </p>
                        </div>
                      </div>
                      <div className="font-medium">
                        PKR {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    PKR {selectedOrder.subtotal?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Charges:</span>
                  <span>
                    PKR {selectedOrder.shipping_charge?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>
                    PKR {selectedOrder.total_amount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Payment Method:</strong>{" "}
                  {selectedOrder.payment_method
                    ?.replace("_", " ")
                    .toUpperCase()}
                </div>
                <div>
                  <strong>Status:</strong> {selectedOrder.status?.toUpperCase()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
