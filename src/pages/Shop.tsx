import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Search,
  Filter,
  Grid,
  List,
  Heart,
  ShoppingCart,
  Loader2,
  Zap,
} from "lucide-react";
import { useProducts, Product } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "All Products",
  "Hair Oils",
  "Hair Care Sets",
  "Accessories",
];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
];

export default function Shop() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 100]);

  const { products, loading, error } = useProducts();
  const { addItem, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = (product: Product) => {
    // Clear cart and add only this product
    clearCart();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });

    toast({
      title: "Proceeding to checkout",
      description: `${product.name} added for immediate purchase.`,
    });

    // Navigate to checkout
    navigate("/checkout");
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Products" ||
      product.name
        .toLowerCase()
        .includes(selectedCategory.toLowerCase().slice(0, -1));
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 spiritual-pattern">
        <div className="container px-4 py-12">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">
              Shop <span className="font-script text-primary">Sufi Shine</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our collection of organic hair care products, crafted
              with spiritual care and natural ingredients.
            </p>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        {error && (
          <div className="mb-6 p-4 border border-destructive/20 rounded-lg bg-destructive/10">
            <p className="text-destructive">Error loading products: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Categories
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left p-2 rounded-md transition-colors ${
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([Number(e.target.value), priceRange[1]])
                        }
                        className="flex-1"
                      />
                      <span>-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Number(e.target.value)])
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Products");
                    setPriceRange([0, 100]);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""} found
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex items-center space-x-1 border rounded-md p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">
                  Loading products...
                </span>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="hover-glow border-0 shadow-lg overflow-hidden"
                  >
                    {viewMode === "grid" ? (
                      <>
                        {/* Product Image */}
                        <Link to={`/shop/${product.id}`} className="block">
                          <div className="relative bg-muted/30 p-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 hover-glow"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-48 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder.svg";
                              }}
                            />
                          </div>
                        </Link>

                        <CardContent className="p-4 space-y-3">
                          <h3 className="font-semibold text-lg line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>

                          {/* Rating - Static for now */}
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < 4
                                      ? "fill-accent text-accent"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              (0)
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-primary">
                              PKR {product.price.toFixed(2)}
                            </span>
                          </div>

                          {/* Stock Status */}
                          {product.stock > 0 ? (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-600"
                            >
                              In Stock ({product.stock})
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-red-600 border-red-600"
                            >
                              Out of Stock
                            </Badge>
                          )}
                        </CardContent>

                        <CardFooter className="p-4 pt-0 space-y-2">
                          <Button
                            className="w-full btn-spiritual"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => handleBuyNow(product)}
                            disabled={product.stock === 0}
                          >
                            <Zap className="mr-2 h-4 w-4" />
                            Buy Now
                          </Button>
                        </CardFooter>
                      </>
                    ) : (
                      // List View
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                        <div className="relative">
                          <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-32 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder.svg";
                            }}
                          />
                        </div>

                        <div className="md:col-span-2 space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg">
                              {product.name}
                            </h3>
                            <Button variant="ghost" size="icon">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {product.description}
                          </p>

                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < 4
                                        ? "fill-accent text-accent"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                (0)
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-primary">
                                PKR {product.price.toFixed(2)}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 ml-auto">
                              <Button
                                className="btn-spiritual"
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock === 0}
                              >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add to Cart
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleBuyNow(product)}
                                disabled={product.stock === 0}
                              >
                                <Zap className="mr-2 h-4 w-4" />
                                Buy Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Products");
                  }}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
