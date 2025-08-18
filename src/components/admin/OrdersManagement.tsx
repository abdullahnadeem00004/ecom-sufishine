import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
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
  created_at: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
                    <TableHead>Payment</TableHead>
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
                            updateStatus(order.id, value)
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
