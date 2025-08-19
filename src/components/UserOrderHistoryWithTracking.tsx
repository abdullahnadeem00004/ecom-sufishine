import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Package, Truck, Eye, ExternalLink } from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string | null;
  tracking_id: string | null;
  tracking_status: string;
  delivery_notes: string | null;
  created_at: string;
}

export default function UserOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("guest_orders")
          .select("*")
          .eq("customer_email", user.email)
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

            return {
              ...order,
              items: parsedItems,
            };
          });
          setOrders(processedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              Please log in to view your order history.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Loading your orders...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Orders</h2>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(order.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusBadgeColor(order.status)}>
                      {order.status?.toUpperCase() || "PENDING"}
                    </Badge>
                    <Badge
                      className={getPaymentStatusBadgeColor(
                        order.payment_status
                      )}
                      variant="outline"
                    >
                      Payment:{" "}
                      {order.payment_status?.toUpperCase() || "PENDING"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="font-semibold text-sm text-gray-600">
                      Items ({order.items?.length || 0})
                    </p>
                    <div className="text-sm space-y-1 mt-1">
                      {Array.isArray(order.items) ? (
                        order.items.slice(0, 2).map((item, index) => (
                          <div key={index}>
                            {item.name} × {item.quantity}
                          </div>
                        ))
                      ) : (
                        <div>No items</div>
                      )}
                      {order.items && order.items.length > 2 && (
                        <div className="text-gray-500">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-sm text-gray-600">
                      Payment
                    </p>
                    <p className="text-sm">
                      {order.payment_method?.replace("_", " ").toUpperCase() ||
                        "N/A"}
                    </p>
                    {order.transaction_id && (
                      <p className="text-xs font-mono text-gray-500">
                        TX: {order.transaction_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-sm text-gray-600">Total</p>
                    <p className="text-lg font-bold">
                      PKR {order.total_amount?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>

                {/* Tracking Information */}
                {order.tracking_id && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
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
                            {order.tracking_status?.toUpperCase() || "SHIPPED"}
                          </span>
                        </p>
                      </div>
                      <Button
                        onClick={() => handleTrackOrder(order.tracking_id!)}
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
                {order.status === "confirmed" && !order.tracking_id && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>📦 Order Confirmed!</strong> Your order is being
                      prepared for shipment. Tracking information will be
                      available once your order is dispatched.
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder?.id === order.id ? null : order
                      )
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {selectedOrder?.id === order.id
                      ? "Hide Details"
                      : "View Details"}
                  </Button>
                </div>

                {selectedOrder?.id === order.id && (
                  <div className="mt-4 pt-4 border-t bg-gray-50 p-4 rounded">
                    <h4 className="font-semibold mb-3">Order Details</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Items:</h5>
                        <div className="space-y-2">
                          {Array.isArray(order.items) &&
                            order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center py-2 border-b"
                              >
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-semibold">
                                  PKR {(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">
                          Contact Information:
                        </h5>
                        <p className="text-sm">
                          <strong>Name:</strong> {order.customer_name}
                        </p>
                        <p className="text-sm">
                          <strong>Email:</strong> {order.customer_email}
                        </p>
                        <p className="text-sm">
                          <strong>Phone:</strong> {order.customer_phone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
