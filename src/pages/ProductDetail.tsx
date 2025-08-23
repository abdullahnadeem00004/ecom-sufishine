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
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { Reviews } from "@/components/Reviews";
import { supabase } from "@/integrations/supabase/client";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addItem, clearCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);

  // Handle both UUID strings and integer IDs for database compatibility
  const product = products.find(
    (p) => p.id.toString() === id || p.id === Number(id) || p.id === id
  );

  useEffect(() => {
    // Only redirect if products have finished loading and product is still not found
    if (!loading && products.length > 0 && !product) {
      navigate("/shop");
    }
  }, [loading, products.length, product, navigate]);

  useEffect(() => {
    if (!product) return;
    let isMounted = true;

    const loadReviewStats = async () => {
      // Fetch approved reviews for this product and compute stats quickly client-side
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("product_id", product.id)
        .eq("approved", true);
      if (!isMounted) return;
      if (error) {
        setAvgRating(null);
        setReviewCount(0);
        return;
      }
      const ratings = data?.map((r) => r.rating) || [];
      setReviewCount(ratings.length);
      setAvgRating(
        ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
      );
    };

    loadReviewStats();

    const onUpdated = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { productId?: number }
        | undefined;
      if (!detail || detail.productId === product.id) {
        loadReviewStats();
      }
    };
    window.addEventListener("reviews:updated", onUpdated as EventListener);
    return () => {
      isMounted = false;
      window.removeEventListener("reviews:updated", onUpdated as EventListener);
    };
  }, [product]);

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

  const handleToggleFavorite = () => {
    if (!product) return;

    toggleFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });

    const isCurrentlyFavorite = isFavorite(product.id);
    toast({
      title: isCurrentlyFavorite
        ? "Removed from wishlist"
        : "Added to wishlist",
      description: isCurrentlyFavorite
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
    });
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
                      i < Math.round(avgRating || 0)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {reviewCount > 0
                  ? `${avgRating?.toFixed(1)} (${reviewCount} review${
                      reviewCount !== 1 ? "s" : ""
                    })`
                  : "(No reviews yet)"}
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                PKR {product.price.toFixed(2)}
              </div>
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
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleToggleFavorite}
              >
                <Heart
                  className={`mr-2 h-5 w-5 ${
                    isFavorite(product.id) ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {isFavorite(product.id)
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}
              </Button>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">
                  Free For Advance Payments & PKR 200 shipping for COD
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
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
                    <li>Repairs Hair Splitting</li>
                    <li>Prevents Hair Fall</li>
                    <li>Prevents Premature Graying</li>
                    <li>Balances Scalp Health</li>
                    <li>Controls Dandruff</li>
                    <li>Adds Shine and Softness</li>
                    <li>Improves Blood Circulation</li>
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
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Natural Ingredients</h3>

                  {/* Ingredients List in styled format similar to the image */}
                  <div className="bg-gradient-to-br from-green-50 to-amber-50 p-6 rounded-lg border">
                    <h4 className="font-bold text-lg mb-4 text-center bg-slate-700 text-white py-2 px-4 rounded">
                      Ingredients:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Hemp Seeds",
                        "Alkanet Root",
                        "Nutgrass (Cyperus rotundus)",
                        "Sandalwood Powder",
                        "Beleric (Terminalia Bellifica)",
                        "Bay Leaf",
                        "Shikakai",
                        "Soapnut (Reetha)",
                        "Poppy Seeds",
                        "Lettuce Seeds",
                        "Spikenard (Balchar)",
                        "Rosemary",
                        "Mustard Oil",
                        "Walnut Oil",
                        "Sesame Oil",
                        "Light Mineral Oil",
                        "Vitamin E",
                        "Biotin",
                      ].map((ingredient, index) => (
                        <div
                          key={index}
                          className="bg-white/80 p-3 rounded border-b border-gray-200 text-center shadow-sm"
                        >
                          <span className="text-sm font-medium text-gray-800">
                            {ingredient}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-primary">
                        Key Benefits:
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>
                            Hemp Seeds: Rich in omega fatty acids for
                            nourishment
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>
                            Alkanet Root: Natural coloring and conditioning
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>
                            Shikakai: Natural cleanser and hair strengthener
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>
                            Soapnut: Gentle cleansing without stripping oils
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>
                            Rosemary: Stimulates circulation and growth
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 text-primary">
                        Nutritional Oils:
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>
                            Mustard Oil: Promotes hair growth and thickness
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>Walnut Oil: Rich in vitamins and minerals</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>
                            Sesame Oil: Deep moisturizing and protection
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>
                            Vitamin E: Antioxidant protection and repair
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>
                            Biotin: Essential for healthy hair structure
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground font-medium text-center">
                      🌿 All ingredients are 100% natural, organic, and
                      ethically sourced. Free from sulfates, parabens, and
                      artificial fragrances. Traditional Ayurvedic formulation
                      for optimal hair health.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="how-to-use">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-center bg-slate-800 text-white py-3 px-6 rounded-lg">
                    How to use:
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-slate-800">
                          Shake Well
                        </span>
                        <span className="text-slate-700">
                          {" "}
                          – Mix ingredients properly.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-slate-800">
                          Take a little
                        </span>
                        <span className="text-slate-700">
                          {" "}
                          – Pour into palms.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-slate-800">
                          Warm (Optional)
                        </span>
                        <span className="text-slate-700">
                          {" "}
                          – For deeper absorption.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-pink-50 to-yellow-50 rounded-lg border border-pink-200">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-slate-800">
                          Gentle Massage Organic Oil on Scalp & Hair
                        </span>
                        <span className="text-slate-700">
                          {" "}
                          – Use circular motions.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-slate-800">
                          Leave for 2+ Hours
                        </span>
                        <span className="text-slate-700">
                          {" "}
                          – Overnight for best results.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-slate-800">
                          Use 3-4 Times Weekly
                        </span>
                        <span className="text-slate-700">
                          {" "}
                          – Ensures healthy hair.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-red-50 to-teal-50 rounded-lg border border-red-200">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-slate-800">
                          Rinse with Herbal Water
                        </span>
                        <span className="text-slate-700">
                          {" "}
                          – Avoid harsh cleansers.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-slate-800">
                          Air Dry & Style Naturally
                        </span>
                        <span className="text-slate-700">
                          {" "}
                          – Skip heat styling.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-slate-800 mb-2">
                      💡 Pro Tips:
                    </h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li>
                        • For best results, use consistently 3-4 times per week
                      </li>
                      <li>
                        • Warm oil slightly for better penetration and
                        relaxation
                      </li>
                      <li>
                        • Massage gently in circular motions to improve blood
                        circulation
                      </li>
                      <li>
                        • Leave overnight when possible for maximum nourishment
                      </li>
                      <li>
                        • Use herbal water or mild natural shampoo for washing
                      </li>
                    </ul>
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
