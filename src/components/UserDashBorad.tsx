import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

export default function UserDashboard() {
  const user = useUser();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders(data || []);
    };
    fetchOrders();

    const channel = supabase
      .channel("user-orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        fetchOrders
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  // ...rest of your component...
}
