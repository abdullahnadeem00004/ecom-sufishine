// Vite backend endpoint for email sending
// This file should be placed in a backend directory or use Vite's proxy

import { Resend } from "resend";

export async function sendEmail(emailData) {
  const resend = new Resend(process.env.VITE_RESEND_API_KEY); // Use server-side env var

  try {
    const result = await resend.emails.send(emailData);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
