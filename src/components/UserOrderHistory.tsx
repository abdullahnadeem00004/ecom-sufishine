import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function UserOrderHistory() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      const user = supabase.auth.user();
      if (!user) return;
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders(data || []);
    };
    fetchOrders();
  }, []);
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Order History</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>{order.status}</td>
              <td>${order.total}</td>
              <td>
                <details>
                  <summary>View</summary>
                  <div>
                    {order.products &&
                      order.products.map((p) => (
                        <div key={p.id}>
                          {p.name} x{p.quantity}
                        </div>
                      ))}
                    <div>Delivery: {order.delivery_address}</div>
                    <div>Phone: {order.phone}</div>
                    <div>Email: {order.email}</div>
                    <div>Payment: {order.payment_method}</div>
                  </div>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
