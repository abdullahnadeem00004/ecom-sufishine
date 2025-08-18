import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders(data || []);
    };
    fetchOrders();

    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        fetchOrders
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Orders</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.email}</td>
              <td>${order.total}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => updateStatus(order.id, order.status)}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
