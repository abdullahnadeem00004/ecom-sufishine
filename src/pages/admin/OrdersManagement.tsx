import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GuestOrder {
  id: string;
  order_number: string;
  user_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  customer_name?: string; // For all orders (both guest and registered)
  customer_email?: string;
  customer_phone?: string;
  items: string; // JSON string
  total_amount: number;
  status: string;
  payment_method: string;
  shipping_address: string; // JSON string
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

const OrdersManagement = () => {
  const [orders, setOrders] = useState<GuestOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Fetch from the new guest_orders table
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: ordersData, error: ordersError } = await (supabase as any)
        .from("guest_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error fetching from guest_orders:", ordersError);
        throw ordersError;
      }

      console.log(
        "Fetched orders from guest_orders table:",
        ordersData?.length || 0
      );

      // Fetch profile data for registered users
      const ordersWithDetails = await Promise.all(
        (ordersData || []).map(async (order: GuestOrder) => {
          let profile = null;

          // Only fetch profile if user_id exists (registered user)
          if (order.user_id) {
            try {
              const { data: profileData } = await supabase
                .from("profiles")
                .select("first_name, last_name")
                .eq("id", order.user_id)
                .single();
              profile = profileData;
              console.log("Fetched profile for user:", order.user_id, profile);
            } catch (profileError) {
              console.error(
                "Error fetching profile for user:",
                order.user_id,
                profileError
              );
            }
          }

          return {
            ...order,
            profiles: profile,
          };
        })
      );

      console.log("Final orders with details:", ordersWithDetails.length);
      setOrders(ordersWithDetails as GuestOrder[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("guest_orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

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

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("guest_orders")
        .delete()
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName =
      order.user_id && order.profiles
        ? `${order.profiles.first_name} ${order.profiles.last_name}`
        : order.customer_name || order.guest_name || "Unknown Customer";

    const customerEmail = order.customer_email || order.guest_email || "";

    const matchesSearch =
      searchTerm === "" ||
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Orders Management
        </h1>
        <p className="text-muted-foreground mt-2">Manage all customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                // Parse items from JSON
                let parsedItems = [];
                try {
                  parsedItems = JSON.parse(order.items);
                } catch (e) {
                  console.error("Error parsing order items:", e);
                }

                const customerName =
                  order.user_id && order.profiles
                    ? `${order.profiles.first_name} ${order.profiles.last_name}`
                    : order.customer_name ||
                      order.guest_name ||
                      "Unknown Customer";

                const customerEmail =
                  order.customer_email ||
                  order.guest_email ||
                  "No email provided";

                const itemsSummary =
                  parsedItems.length > 0
                    ? `${parsedItems.length} item${
                        parsedItems.length !== 1 ? "s" : ""
                      } (${parsedItems
                        .map((item) => `${item.name} x${item.quantity}`)
                        .join(", ")})`
                    : "No items";

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.order_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {customerEmail}
                        </div>
                        {!order.user_id && (
                          <div className="text-xs text-orange-600">
                            Guest Order
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={itemsSummary}>
                        {itemsSummary}
                      </div>
                    </TableCell>
                    <TableCell>
                      PKR {Number(order.total_amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {order.payment_method.replace("_", " ").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "pending")
                            }
                          >
                            Mark as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "shipped")
                            }
                          >
                            Mark as Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "delivered")
                            }
                          >
                            Mark as Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "cancelled")
                            }
                          >
                            Mark as Cancelled
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteOrder(order.id)}
                            className="text-red-600"
                          >
                            Delete Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersManagement;
