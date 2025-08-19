import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/useFavorites";
import { FavoriteItem } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function Favorites() {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: FavoriteItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
    });

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromFavorites = (id: number, name: string) => {
    removeFromFavorites(id);
    toast({
      title: "Removed from favorites",
      description: `${name} has been removed from your favorites.`,
    });
  };

  const handleClearAllFavorites = () => {
    if (favorites.length === 0) return;
    clearFavorites();
    toast({
      title: "Favorites cleared",
      description: "All items have been removed from your favorites.",
    });
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Start adding products you love to keep track of them.
            </p>
            <Button asChild size="lg" className="btn-spiritual">
              <Link to="/shop">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-muted-foreground mt-2">
              {favorites.length} item{favorites.length !== 1 ? "s" : ""} saved
              for later
            </p>
          </div>
          {favorites.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAllFavorites}
              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <Card
              key={item.id}
              className="hover-glow border-0 shadow-lg overflow-hidden"
            >
              <CardHeader className="p-0">
                <Link to={`/shop/${item.id}`} className="block">
                  <div className="relative bg-muted/30 p-6 aspect-square">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 hover-glow z-10 text-red-500"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFromFavorites(item.id, item.name);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </Link>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                <Link to={`/shop/${item.id}`}>
                  <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary">
                    PKR {item.price.toFixed(2)}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 space-y-2">
                <Button
                  className="w-full btn-spiritual"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleRemoveFromFavorites(item.id, item.name)}
                >
                  <Heart className="mr-2 h-4 w-4 fill-red-500 text-red-500" />
                  Remove from Wishlist
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
