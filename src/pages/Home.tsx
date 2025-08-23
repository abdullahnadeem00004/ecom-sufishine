import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Check,
  Sparkles,
  Leaf,
  Heart,
  Shield,
  ShoppingCart,
  Zap,
  Droplets,
  Flower2,
  Scissors,
  Palette,
  Loader2,
  ArrowRight,
  Users,
  Award,
  Globe,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { useProducts, Product } from "@/hooks/useProducts";
import { SocialLinks } from "@/components/ui/SocialLinks";
import heroImage from "@/assets/hero-woman.jpg";
import productImage from "@/assets/hair-oil-bottle.png";

// Import all pics for the gallery and sections
import pic1 from "@/assets/pics/1.png";
import pic2 from "@/assets/pics/2.png";
import pic3 from "@/assets/pics/3.png";
import pic4 from "@/assets/pics/4.png";
import pic5 from "@/assets/pics/5.png";
import pic6 from "@/assets/pics/6.png";
import pic7 from "@/assets/pics/7.png";
import pic8 from "@/assets/pics/8.png";

const benefits = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "Pure, natural ingredients sourced ethically",
    image: pic1,
  },
  {
    icon: Sparkles,
    title: "Radiant Beauty",
    description: "Enhance your natural glow and shine",
    image: pic2,
  },
  {
    icon: Heart,
    title: "Cruelty-Free",
    description: "Never tested on animals, always ethical",
    image: pic3,
  },
  {
    icon: Shield,
    title: "Chemical-Free",
    description: "No harmful additives or preservatives",
    image: pic4,
  },
];

const productCategories = [
  {
    icon: Droplets,
    title: "Hair Care",
    description: "Organic oils, shampoos & conditioners",
    products: "Hair Oils, Shampoos, Masks",
    image: pic5,
  },
  {
    icon: Flower2,
    title: "Skin Care",
    description: "Natural creams, serums & moisturizers",
    products: "Face Creams, Body Lotions, Serums",
    image: pic6,
  },
  {
    icon: Scissors,
    title: "Hair Styling",
    description: "Natural styling products & treatments",
    products: "Styling Gels, Hair Sprays, Treatments",
    image: pic7,
  },
  {
    icon: Palette,
    title: "Natural Makeup",
    description: "Organic cosmetics & beauty essentials",
    products: "Lipsticks, Foundations, Eye Shadows",
    image: pic8,
  },
];

const galleryImages = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8];

const stats = [
  {
    icon: Users,
    number: "10,000+",
    label: "Happy Customers",
    image: pic1,
  },
  {
    icon: Award,
    number: "100%",
    label: "Organic Products",
    image: pic2,
  },
  {
    icon: Globe,
    number: "50+",
    label: "Countries Served",
    image: pic3,
  },
  {
    icon: Heart,
    number: "5 Star",
    label: "Average Rating",
    image: pic4,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment:
      "SUFI SHINE products transformed my entire beauty routine! Everything is so pure and effective.",
    image: pic5,
    bgImage: pic1,
  },
  {
    name: "Amira Hassan",
    rating: 5,
    comment:
      "I love the spiritual aspect and natural ingredients. My skin and hair have never looked better!",
    image: pic6,
    bgImage: pic2,
  },
  {
    name: "Emily Chen",
    rating: 5,
    comment:
      "From hair oil to face cream, every product delivers amazing results. Truly shine with purity!",
    image: pic7,
    bgImage: pic3,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { addItem, clearCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const { products, loading } = useProducts();

  const handleAddToCart = (product: Product) => {
    addItem(
      {
        id: typeof product.id === "string" ? parseInt(product.id) : product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      },
      1
    );
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = (product: Product) => {
    clearCart();
    addItem(
      {
        id: typeof product.id === "string" ? parseInt(product.id) : product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      },
      1
    );
    navigate("/checkout");
  };

  const handleToggleFavorite = (product: Product, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    toggleFavorite({
      id: typeof product.id === "string" ? parseInt(product.id) : product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });

    const productIdNum =
      typeof product.id === "string" ? parseInt(product.id) : product.id;
    const isCurrentlyFavorite = isFavorite(productIdNum);
    toast({
      title: isCurrentlyFavorite
        ? "Removed from favorites"
        : "Added to favorites",
      description: isCurrentlyFavorite
        ? `${product.name} has been removed from your favorites.`
        : `${product.name} has been added to your favorites.`,
    });
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted/30 spiritual-pattern">
        <div className="container px-3 sm:px-4 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Hero Text */}
            <div className="space-y-4 sm:space-y-6 animate-fade-in text-center lg:text-left">
              <Badge
                variant="outline"
                className="w-fit mx-auto lg:mx-0 text-xs sm:text-sm"
              >
                🌿 100% Organic Beauty Products
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                <span className="font-script bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  SUFI SHINE
                </span>{" "}
                <br />
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-muted-foreground">
                  Shine with Purity
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Discover the complete range of organic beauty products – from
                hair care to skin care, makeup to wellness. Experience the
                transformative power of ancient Sufi wisdom in modern organic
                beauty solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="btn-spiritual text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
                >
                  <Link to="/shop">
                    Shop Now
                    <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover-glow w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-float mt-6 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl sm:rounded-3xl blur-3xl"></div>
              <img
                src={heroImage}
                alt="Beautiful woman showcasing SUFI SHINE organic beauty products - Shine with Purity"
                className="relative rounded-2xl sm:rounded-3xl shadow-2xl w-full h-auto object-cover hover-glow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container px-3 sm:px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center space-y-2 sm:space-y-3 group cursor-pointer"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 overflow-hidden rounded-full">
                  <img
                    src={stat.image}
                    alt={stat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300"></div>
                  <stat.icon className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 m-auto text-white drop-shadow-lg" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Featured Products
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Discover our complete collection of organic beauty products
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
              <span className="ml-2 text-sm sm:text-base text-muted-foreground">
                Loading products...
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover-glow border-0 shadow-xl w-full max-w-md lg:max-w-lg xl:max-w-xl"
                >
                  {/* Product Image */}
                  <Link to={`/shop/${product.id}`} className="block">
                    <div className="relative bg-gradient-to-br from-muted/30 to-muted/50 p-12 sm:p-16 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 hover-glow z-10"
                        onClick={(e) => handleToggleFavorite(product, e)}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorite(
                              typeof product.id === "string"
                                ? parseInt(product.id)
                                : product.id
                            )
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full max-w-md h-80 sm:h-96 lg:h-[28rem] object-contain animate-float"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.svg";
                        }}
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <CardContent className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl mb-3 line-clamp-2 text-center">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-base sm:text-lg line-clamp-2 text-center">
                        {product.description}
                      </CardDescription>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-center space-x-2">
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
                      <span className="text-sm text-muted-foreground">(0)</span>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col items-center space-y-3">
                      <span className="text-2xl sm:text-3xl font-bold text-primary">
                        PKR {product.price.toFixed(2)}
                      </span>
                      {product.stock > 0 ? (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600 text-sm"
                        >
                          In Stock ({product.stock})
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-red-600 border-red-600 text-sm"
                        >
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {benefits.slice(0, 4).map((benefit) => (
                        <div
                          key={benefit.title}
                          className="flex items-center space-x-2"
                        >
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{benefit.title}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <Button
                        className="btn-spiritual w-full text-base sm:text-lg py-3 sm:py-4"
                        onClick={() => handleBuyNow(product)}
                        disabled={product.stock === 0}
                      >
                        <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Buy Now
                      </Button>
                      <Button
                        variant="outline"
                        className="hover-glow w-full text-base sm:text-lg py-3 sm:py-4"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Show All Products Button */}
          <div className="text-center mt-8 sm:mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover-glow"
            >
              <Link to="/shop">
                View All Products
                <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Our Product Range
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete organic beauty solutions for your entire routine
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {productCategories.map((category, index) => (
              <Card
                key={category.title}
                className="group relative overflow-hidden hover-glow border-0 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105"
              >
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent"></div>
                </div>

                <CardContent className="relative p-4 sm:p-6 space-y-3 sm:space-y-4 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-primary/10 group-hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <category.icon className="relative h-6 w-6 sm:h-8 sm:w-8 text-primary z-10" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {category.products}
                  </p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" variant="outline" className="mt-2">
                      Explore <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 bg-muted/30 spiritual-pattern">
        <div className="container px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Why Choose SUFI SHINE?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of ancient wisdom and modern organic
              beauty
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={benefit.title}
                className="group relative overflow-hidden hover-glow border-0 shadow-lg transition-all duration-300 hover:scale-105"
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-background/60 group-hover:from-primary/20 group-hover:via-background/70 group-hover:to-background/50 transition-all duration-300"></div>
                </div>

                <CardContent className="relative p-4 sm:p-6 space-y-3 sm:space-y-4 text-center h-full flex flex-col justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-white/20 backdrop-blur group-hover:bg-primary/20 rounded-full flex items-center justify-center transition-all duration-300 border border-primary/20">
                    <benefit.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-white transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-white/80 transition-colors duration-300">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Discover Natural Beauty
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              A visual journey through our organic beauty collection
            </p>
          </div>

          {/* Interactive Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-8">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-center">
                    <Sparkles className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Natural Beauty</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Product Showcase */}
          <div className="relative bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-6 sm:p-12 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img
                src={pic1}
                alt="Background"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <Badge className="w-fit">Featured Collection</Badge>
                <h3 className="text-2xl sm:text-3xl font-bold">
                  Organic Hair Care Essentials
                </h3>
                <p className="text-muted-foreground text-base sm:text-lg">
                  Transform your hair care routine with our premium organic
                  formulations. Crafted with love and ancient wisdom for modern
                  beauty needs.
                </p>
                <Button asChild size="lg" className="btn-spiritual">
                  <Link to="/shop">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {galleryImages.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className={`relative rounded-xl overflow-hidden ${
                        index === 0 ? "col-span-2" : ""
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Featured ${index + 1}`}
                        className={`w-full object-cover transition-transform duration-300 hover:scale-105 ${
                          index === 0 ? "h-40" : "h-24"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Join thousands of satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden hover-glow border-0 shadow-lg transition-all duration-300 hover:scale-105"
              >
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <img
                    src={testimonial.bgImage}
                    alt={`${testimonial.name} background`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/50"></div>
                </div>

                <CardContent className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 sm:h-4 sm:w-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground italic">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-primary/20">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-sm sm:text-base font-medium block">
                        {testimonial.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Verified Customer
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={pic8}
            alt="Newsletter background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary-glow/95"></div>
        </div>

        <div className="relative container px-3 sm:px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
            <div className="inline-block p-3 bg-white/20 rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Stay Connected with SUFI SHINE
            </h2>
            <p className="text-base sm:text-xl text-white/90 leading-relaxed">
              Subscribe to our newsletter for exclusive offers, beauty tips,
              product launches, and spiritual wellness insights. Join our
              community of natural beauty enthusiasts!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-foreground bg-white/90 backdrop-blur border border-white/20 placeholder:text-muted-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button className="bg-white text-primary hover:bg-white/90 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base whitespace-nowrap font-medium">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Social Media Links */}
            <div className="pt-6">
              <p className="text-sm sm:text-base text-white/80 mb-4">
                Follow us for daily beauty tips and inspiration
              </p>
              <SocialLinks size="lg" className="justify-center" />
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-white">
                  10k+
                </div>
                <div className="text-xs text-white/70">Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-white">
                  100%
                </div>
                <div className="text-xs text-white/70">Organic</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-white">
                  5★
                </div>
                <div className="text-xs text-white/70">Rated</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-white">
                  24/7
                </div>
                <div className="text-xs text-white/70">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
