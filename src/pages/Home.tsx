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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { SocialLinks } from "@/components/ui/SocialLinks";
import heroImage from "@/assets/hero-woman.jpg";
import productImage from "@/assets/hair-oil-bottle.png";

const benefits = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "Pure, natural ingredients sourced ethically",
  },
  {
    icon: Sparkles,
    title: "Radiant Beauty",
    description: "Enhance your natural glow and shine",
  },
  {
    icon: Heart,
    title: "Cruelty-Free",
    description: "Never tested on animals, always ethical",
  },
  {
    icon: Shield,
    title: "Chemical-Free",
    description: "No harmful additives or preservatives",
  },
];

const productCategories = [
  {
    icon: Droplets,
    title: "Hair Care",
    description: "Organic oils, shampoos & conditioners",
    products: "Hair Oils, Shampoos, Masks",
  },
  {
    icon: Flower2,
    title: "Skin Care",
    description: "Natural creams, serums & moisturizers",
    products: "Face Creams, Body Lotions, Serums",
  },
  {
    icon: Scissors,
    title: "Hair Styling",
    description: "Natural styling products & treatments",
    products: "Styling Gels, Hair Sprays, Treatments",
  },
  {
    icon: Palette,
    title: "Natural Makeup",
    description: "Organic cosmetics & beauty essentials",
    products: "Lipsticks, Foundations, Eye Shadows",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment:
      "SUFI SHINE products transformed my entire beauty routine! Everything is so pure and effective.",
    image: "/placeholder.svg",
  },
  {
    name: "Amira Hassan",
    rating: 5,
    comment:
      "I love the spiritual aspect and natural ingredients. My skin and hair have never looked better!",
    image: "/placeholder.svg",
  },
  {
    name: "Emily Chen",
    rating: 5,
    comment:
      "From hair oil to face cream, every product delivers amazing results. Truly shine with purity!",
    image: "/placeholder.svg",
  },
];

const featuredProduct = {
  id: 1,
  name: "Sufi Shine Organic Hair Oil",
  price: 1300.0,
  description:
    "Our organic hair oil blends natural oils for ultimate shine and purity, inspired by ancient Sufi traditions of spiritual harmony and natural beauty.",
  image: productImage,
  size: "100ml",
};

export default function Home() {
  const navigate = useNavigate();
  const { addItem, clearCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(
      {
        id: featuredProduct.id,
        name: featuredProduct.name,
        price: featuredProduct.price,
        image_url: featuredProduct.image,
      },
      1
    );
    toast({
      title: "Added to cart",
      description: `${featuredProduct.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    clearCart();
    addItem(
      {
        id: featuredProduct.id,
        name: featuredProduct.name,
        price: featuredProduct.price,
        image_url: featuredProduct.image,
      },
      1
    );
    navigate("/checkout");
  };

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: featuredProduct.id,
      name: featuredProduct.name,
      price: featuredProduct.price,
      image_url: featuredProduct.image,
    });

    const isCurrentlyFavorite = isFavorite(featuredProduct.id);
    toast({
      title: isCurrentlyFavorite
        ? "Removed from favorites"
        : "Added to favorites",
      description: isCurrentlyFavorite
        ? `${featuredProduct.name} has been removed from your favorites.`
        : `${featuredProduct.name} has been added to your favorites.`,
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
                <span className="font-script text-primary bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
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

      {/* Featured Product */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Featured Product
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Experience the essence of purity
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden hover-glow border-0 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Product Image */}
                <div className="relative bg-gradient-to-br from-muted/30 to-muted/50 p-6 sm:p-8 flex items-center justify-center">
                  <img
                    src={productImage}
                    alt="Sufi Shine Organic Hair Oil - 100ml"
                    className="w-full max-w-xs h-auto object-contain animate-float"
                  />
                </div>

                {/* Product Details */}
                <CardContent className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl mb-2">
                      {featuredProduct.name}
                    </CardTitle>
                    <CardDescription className="text-base sm:text-lg">
                      {featuredProduct.size} • Pure & Organic
                    </CardDescription>
                  </div>

                  <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-4 space-y-2 xs:space-y-0">
                    <span className="text-2xl sm:text-3xl font-bold text-primary">
                      PKR {featuredProduct.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-muted-foreground">
                    {featuredProduct.description}
                  </p>

                  {/* Benefits Grid */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                    {benefits.map((benefit) => (
                      <div
                        key={benefit.title}
                        className="flex items-center space-x-2"
                      >
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                        <span className="text-xs sm:text-sm">
                          {benefit.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      className="btn-spiritual flex-1 text-sm sm:text-base py-2 sm:py-3"
                      onClick={handleBuyNow}
                    >
                      <Zap className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Buy Now
                    </Button>
                    <Button
                      variant="outline"
                      className="hover-glow flex-1 text-sm sm:text-base py-2 sm:py-3"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="hover-glow sm:w-auto w-full text-sm sm:text-base py-2 sm:py-3"
                      onClick={handleToggleFavorite}
                    >
                      <Heart
                        className={`mr-2 h-3 w-3 sm:h-4 sm:w-4 ${
                          isFavorite(featuredProduct.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                      {isFavorite(featuredProduct.id) ? "Saved" : "Save"}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
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

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {productCategories.map((category, index) => (
              <Card
                key={category.title}
                className="text-center hover-glow border-0 shadow-lg cursor-pointer transition-transform hover:scale-105"
              >
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <category.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    {category.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {category.products}
                  </p>
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

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={benefit.title}
                className="text-center hover-glow border-0 shadow-lg"
              >
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
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
              <Card key={index} className="hover-glow border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
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
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-medium text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm sm:text-base font-medium">
                      {testimonial.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
        <div className="container px-3 sm:px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Stay Connected with SUFI SHINE
            </h2>
            <p className="text-base sm:text-xl opacity-90">
              Subscribe to our newsletter for exclusive offers, beauty tips,
              product launches, and spiritual wellness insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-foreground bg-background/10 backdrop-blur border border-white/20 placeholder:text-white/70 text-sm sm:text-base"
              />
              <Button className="btn-gold px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base whitespace-nowrap">
                Subscribe
              </Button>
            </div>

            {/* Social Media Links */}
            <div className="pt-6">
              <p className="text-sm sm:text-base opacity-80 mb-4">
                Follow us for daily beauty tips and inspiration
              </p>
              <SocialLinks size="lg" className="justify-center" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
