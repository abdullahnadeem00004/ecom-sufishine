import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function OrderStatusNotification({ orderId, status }) {
  const [sent, setSent] = useState(false);
  useEffect(() => {
    if (!orderId || !status) return;
    // Call Edge Function to send email notification
    fetch("/functions/v1/send-order-status-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    }).then(() => setSent(true));
  }, [orderId, status]);
  return sent ? (
    <span className="text-green-600">Notification sent</span>
  ) : null;
}
