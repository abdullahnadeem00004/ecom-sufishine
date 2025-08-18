import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Reviews } from "@/components/Reviews";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addItem, clearCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === Number(id));

  useEffect(() => {
    if (!loading && !product) {
      navigate("/shop");
    }
  }, [loading, product, navigate]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      },
      quantity
    );

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;

    // Clear cart and add only this product with selected quantity
    clearCart();
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      },
      quantity
    );

    toast({
      title: "Proceeding to checkout",
      description: `${quantity} x ${product.name} added for immediate purchase.`,
    });

    // Navigate to checkout
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-muted rounded w-24"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-12 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/shop")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted/30 rounded-lg p-8 flex items-center justify-center">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < 4
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(0 reviews)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                PKR {product.price.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">
                Free shipping on orders over PKR 5000
              </p>
            </div>

            {/* Stock Status */}
            {product.stock > 0 ? (
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                ✓ In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-600">
                Out of Stock
              </Badge>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full"
                variant="outline"
                size="lg"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                <Zap className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
              <Button
                className="w-full btn-spiritual"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">
                  Free shipping on orders over PKR 5000
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">
                  100% natural and organic ingredients
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-sm">30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  <Separator />
                  <h4 className="font-medium">Benefits:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Nourishes and strengthens hair follicles</li>
                    <li>Promotes healthy hair growth</li>
                    <li>Adds natural shine and luster</li>
                    <li>Suitable for all hair types</li>
                    <li>Made with 100% organic ingredients</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ingredients">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Natural Ingredients</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Primary Ingredients:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Organic Argan Oil</li>
                        <li>• Coconut Oil</li>
                        <li>• Jojoba Oil</li>
                        <li>• Vitamin E</li>
                        <li>• Rosemary Extract</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Essential Oils:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Lavender Oil</li>
                        <li>• Peppermint Oil</li>
                        <li>• Tea Tree Oil</li>
                        <li>• Eucalyptus Oil</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      All ingredients are 100% natural, organic, and ethically
                      sourced. Free from sulfates, parabens, and artificial
                      fragrances.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Reviews productId={product.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
