import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Star, User, MessageCircle, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { ProductIdMapper } from "@/lib/productIdMapper";

interface Review {
  id: number;
  user_id: string;
  product_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsProps {
  productId: string | number; // Support both UUID and integer IDs
}

export function Reviews({ productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Convert productId to integer for database queries
  const dbProductId = ProductIdMapper.toIntegerForDB(productId);

  const fetchReviews = useCallback(async () => {
    if (!dbProductId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", dbProductId)
        .eq("approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [dbProductId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Review submission started");
    console.log("User:", user ? "✅ Authenticated" : "❌ Not authenticated");
    console.log("Product ID (original):", productId);
    console.log("Product ID (for DB):", dbProductId);

    if (!user) {
      console.log("❌ User not authenticated");
      toast({
        title: "Please sign in",
        description: "You need to be signed in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      console.log("❌ Comment is empty");
      toast({
        title: "Comment required",
        description: "Please write a comment for your review.",
        variant: "destructive",
      });
      return;
    }

    if (!dbProductId) {
      console.log("❌ No valid product ID for database");
      toast({
        title: "Product not found",
        description: "Unable to submit review for this product.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const reviewData = {
        user_id: user.id,
        product_id: dbProductId,
        rating,
        comment: comment.trim(),
      };

      console.log("📝 Submitting review with data:", reviewData);

      const { data, error } = await supabase
        .from("reviews")
        .insert(reviewData)
        .select();

      if (error) {
        console.error("💥 Supabase error:", error);
        throw error;
      }

      console.log("✅ Review submitted successfully:", data);

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      setComment("");
      setRating(5);
      setShowForm(false);
      // Notify other parts of the app (e.g., ProductDetail) to refresh review stats
      // Best-effort event; ignore errors in non-browser environments
      try {
        window.dispatchEvent(
          new CustomEvent("reviews:updated", { detail: { productId } })
        );
      } catch (err) {
        // noop
      }
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const renderStars = (
    rating: number,
    interactive = false,
    onSelect?: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onSelect ? () => onSelect(star) : undefined}
            className={
              interactive ? "hover:scale-110 transition-transform" : ""
            }
            disabled={!interactive}
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating
                  ? "fill-accent text-accent"
                  : "text-muted-foreground"
              } ${interactive ? "cursor-pointer" : ""}`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          Customer Reviews
        </CardTitle>

        {reviews.length > 0 && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} out of 5 ({reviews.length} review
                {reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Write Review Button */}
        {user && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            className="w-full"
          >
            <Star className="mr-2 h-4 w-4" />
            Write a Review
          </Button>
        )}
        {!user && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h4 className="font-medium">Want to review this product?</h4>
                  <p className="text-sm text-muted-foreground">
                    Sign in to share your experience.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    const redirect = encodeURIComponent(
                      window.location.pathname + window.location.search
                    );
                    navigate(`/auth?redirect=${redirect}`);
                  }}
                  className="btn-spiritual"
                >
                  Sign in to write a review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review Form */}
        {showForm && (
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Rating
                  </label>
                  {renderStars(rating, true, setRating)}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Comment
                  </label>
                  <Textarea
                    placeholder="Share your experience with this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="btn-spiritual"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setComment("");
                      setRating(5);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground">
              Be the first to share your experience with this product!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={review.id}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        Anonymous User
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Verified Purchase
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>

                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        Helpful
                      </Button>
                    </div>
                  </div>
                </div>

                {index < reviews.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
