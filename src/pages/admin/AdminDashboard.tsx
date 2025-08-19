import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DollarSign, ShoppingBag, Users, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  avgRating: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total revenue and orders from the new guest_orders table
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: guestOrders, error: guestOrdersError } = await (
          supabase as any
        )
          .from("guest_orders")
          .select("total_amount");

        if (guestOrdersError) {
          console.error("Error fetching guest orders:", guestOrdersError);
        }

        // Also check old orders table as fallback
        const { data: oldOrders } = await supabase
          .from("orders")
          .select("total_price");

        // Fetch total users
        const { data: users } = await supabase.from("profiles").select("id");

        // Fetch average rating
        const { data: reviews } = await supabase
          .from("reviews")
          .select("rating")
          .eq("approved", true);

        // Calculate totals from both tables
        const guestOrdersRevenue =
          guestOrders?.reduce(
            (sum, order) => sum + Number(order.total_amount || 0),
            0
          ) || 0;
        const oldOrdersRevenue =
          oldOrders?.reduce(
            (sum, order) => sum + Number(order.total_price || 0),
            0
          ) || 0;

        const totalRevenue = guestOrdersRevenue + oldOrdersRevenue;
        const totalOrders =
          (guestOrders?.length || 0) + (oldOrders?.length || 0);
        const totalUsers = users?.length || 0;
        const avgRating = reviews?.length
          ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
            reviews.length
          : 0;

        setStats({
          totalRevenue,
          totalOrders,
          totalUsers,
          avgRating: Math.round(avgRating * 10) / 10,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Revenue",
      value: `PKR ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Average Rating",
      value: stats.avgRating.toString(),
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your Sufi Shine e-commerce store
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              Charts coming soon...
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              Product analytics coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
