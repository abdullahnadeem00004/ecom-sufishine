import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { AdminProvider, useAdmin } from "./contexts/AdminContext";
import { Layout } from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrdersManagement from "./pages/admin/OrdersManagement";
import ProductsManagement from "./pages/admin/ProductsManagement";
import AdminManagement from "./pages/admin/AdminManagement";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient();

// Admin Route Protection Component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAdmin();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedAdminRoute>
                    <OrdersManagement />
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin/products" element={
                  <ProtectedAdminRoute>
                    <ProductsManagement />
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin/admins" element={
                  <ProtectedAdminRoute>
                    <AdminManagement />
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedAdminRoute>
                    <div>Users Management - Coming Soon</div>
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin/reviews" element={
                  <ProtectedAdminRoute>
                    <div>Reviews Management - Coming Soon</div>
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin/analytics" element={
                  <ProtectedAdminRoute>
                    <div>Analytics - Coming Soon</div>
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedAdminRoute>
                    <div>Settings - Coming Soon</div>
                  </ProtectedAdminRoute>
                } />
                
                <Route path="/*" element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/shop/:id" element={<ProductDetail />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                } />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
