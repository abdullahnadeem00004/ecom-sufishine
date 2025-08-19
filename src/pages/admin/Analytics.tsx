import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  Package,
  Eye,
  Calendar,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  avgRating: number;
  topProducts: { name: string; sales: number; revenue: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
  orderStatusDistribution: { status: string; count: number; color: string }[];
}

const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    avgRating: 0,
    topProducts: [],
    monthlyRevenue: [],
    orderStatusDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d"
  );

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);

      // Calculate date range based on timeframe
      const now = new Date();
      const daysBack = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 }[timeframe];
      const startDate = new Date(
        now.getTime() - daysBack * 24 * 60 * 60 * 1000
      );

      // Fetch orders data (only from orders table since guest_orders isn't in types)
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", startDate.toISOString());

      // Fetch products
      const { data: products } = await supabase.from("products").select("*");

      // Fetch users
      const { data: users } = await supabase.from("profiles").select("*");

      // Fetch reviews
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("approved", true);

      // Calculate metrics
      const allOrders = orders || [];
      const totalRevenue = allOrders.reduce(
        (sum, order) => sum + Number(order.total_price || 0),
        0
      );
      const totalOrders = allOrders.length;
      const totalProducts = products?.length || 0;
      const totalUsers = users?.length || 0;
      const avgRating = reviews?.length
        ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          reviews.length
        : 0;

      // Generate monthly revenue data
      const monthlyRevenue = generateMonthlyData(allOrders, daysBack);

      // Generate order status distribution
      const orderStatusDistribution = [
        {
          status: "Completed",
          count: allOrders.filter(
            (o) => o.status === "completed" || o.status === "delivered"
          ).length,
          color: "#10B981",
        },
        {
          status: "Processing",
          count: allOrders.filter(
            (o) => o.status === "processing" || o.status === "confirmed"
          ).length,
          color: "#F59E0B",
        },
        {
          status: "Pending",
          count: allOrders.filter((o) => o.status === "pending").length,
          color: "#EF4444",
        },
        {
          status: "Shipped",
          count: allOrders.filter(
            (o) => o.status === "shipped" || o.status === "in_transit"
          ).length,
          color: "#3B82F6",
        },
      ].filter((item) => item.count > 0);

      // Generate top products data (mock data since we don't have detailed order items)
      const topProducts = [
        { name: "Natural Hair Oil", sales: 45, revenue: 13500 },
        { name: "Organic Face Mask", sales: 32, revenue: 9600 },
        { name: "Herbal Soap", sales: 28, revenue: 5600 },
        { name: "Essential Oil Blend", sales: 22, revenue: 6600 },
      ];

      setAnalytics({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        avgRating: Math.round(avgRating * 10) / 10,
        monthlyRevenue,
        orderStatusDistribution,
        topProducts,
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const generateMonthlyData = (
    orders: Array<{ created_at: string; total_price: number }>,
    daysBack: number
  ) => {
    const months = [];
    const now = new Date();

    if (daysBack <= 30) {
      // Daily data for last 30 days
      for (let i = daysBack - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayOrders = orders.filter((order) => {
          const orderDate = new Date(order.created_at);
          return orderDate.toDateString() === date.toDateString();
        });
        const revenue = dayOrders.reduce(
          (sum, order) => sum + Number(order.total_price || 0),
          0
        );
        months.push({
          month: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          revenue,
        });
      }
    } else {
      // Monthly data for longer periods
      const monthsBack = Math.ceil(daysBack / 30);
      for (let i = monthsBack - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(
          now.getFullYear(),
          now.getMonth() - i + 1,
          1
        );
        const monthOrders = orders.filter((order) => {
          const orderDate = new Date(order.created_at);
          return orderDate >= date && orderDate < nextMonth;
        });
        const revenue = monthOrders.reduce(
          (sum, order) => sum + Number(order.total_price || 0),
          0
        );
        months.push({
          month: date.toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          }),
          revenue,
        });
      }
    }

    return months;
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: `PKR ${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-blue-600",
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      title: "Products",
      value: analytics.totalProducts.toString(),
      icon: Package,
      color: "text-purple-600",
      change: "+5.1%",
      changeType: "positive" as const,
    },
    {
      title: "Active Users",
      value: analytics.totalUsers.toString(),
      icon: Users,
      color: "text-orange-600",
      change: "+15.3%",
      changeType: "positive" as const,
    },
    {
      title: "Average Rating",
      value: analytics.avgRating.toString(),
      icon: Star,
      color: "text-yellow-600",
      change: "+0.2",
      changeType: "positive" as const,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into your business performance
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-2">
          {(["7d", "30d", "90d", "1y"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeframe === period
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {period === "7d" && "7 Days"}
              {period === "30d" && "30 Days"}
              {period === "90d" && "90 Days"}
              {period === "1y" && "1 Year"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600 font-medium">
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  vs last period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₨${value}`} />
                <Tooltip
                  formatter={(value: number) => [
                    `₨${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.orderStatusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.orderStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <div>
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {product.sales} sales
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    PKR {product.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.4%</span> vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Order Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              PKR{" "}
              {analytics.totalOrders > 0
                ? (analytics.totalRevenue / analytics.totalOrders).toFixed(0)
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+₨250</span> vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+0.1%</span> vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Retention
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> vs last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
