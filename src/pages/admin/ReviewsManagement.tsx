import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Star,
  Eye,
  Check,
  X,
  MessageSquare,
  Calendar,
  Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: number;
  product_id: number;
  user_id: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
}

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "approved" | "pending"
  >("all");
  const { toast } = useToast();

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    let filtered = reviews;

    // Filter by status
    if (filterStatus === "approved") {
      filtered = filtered.filter((review) => review.approved);
    } else if (filterStatus === "pending") {
      filtered = filtered.filter((review) => !review.approved);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (review) =>
          review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.user_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredReviews(filtered);
  }, [reviews, searchQuery, filterStatus]);

  const updateReviewStatus = async (reviewId: number, approved: boolean) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ approved, updated_at: new Date().toISOString() })
        .eq("id", reviewId);

      if (error) throw error;

      setReviews(
        reviews.map((review) =>
          review.id === reviewId ? { ...review, approved } : review
        )
      );

      toast({
        title: "Review Updated",
        description: `Review ${
          approved ? "approved" : "rejected"
        } successfully.`,
      });
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: "Error",
        description: "Failed to update review status.",
        variant: "destructive",
      });
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;

      setReviews(reviews.filter((review) => review.id !== reviewId));

      toast({
        title: "Review Deleted",
        description: "Review has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const pendingReviews = reviews.filter((r) => !r.approved);
  const approvedReviews = reviews.filter((r) => r.approved);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Reviews Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage customer reviews and ratings for your products
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.length}</div>
            <p className="text-xs text-muted-foreground">
              All customer reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {approvedReviews.length}
            </div>
            <p className="text-xs text-muted-foreground">Published reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingReviews.length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {approvedReviews.length > 0
                ? (
                    approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
                    approvedReviews.length
                  ).toFixed(1)
                : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Average customer rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Reviews</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "approved" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("approved")}
                >
                  Approved
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("pending")}
                >
                  Pending
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button
                onClick={fetchReviews}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Review</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {searchQuery
                        ? "No reviews found matching your search."
                        : "No reviews found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium">Product Review</div>
                          <div className="text-sm text-muted-foreground mt-1 truncate">
                            {review.comment}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-muted-foreground ml-2">
                            {review.rating}/5
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            User ID: {review.user_id.slice(0, 8)}...
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Product ID: {review.product_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={review.approved ? "default" : "secondary"}
                          className={
                            review.approved ? "bg-green-500" : "bg-yellow-500"
                          }
                        >
                          {review.approved ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    setSelectedReview(review);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DialogTrigger>
                            </Dialog>

                            {!review.approved ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateReviewStatus(review.id, true)
                                }
                                className="text-green-600"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateReviewStatus(review.id, false)
                                }
                                className="text-yellow-600"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              onClick={() => deleteReview(review.id)}
                              className="text-destructive"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Review Details Dialog */}
      <Dialog
        open={!!selectedReview}
        onOpenChange={() => setSelectedReview(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Full review information and content
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Author</label>
                  <p className="text-sm text-muted-foreground">
                    User ID: {selectedReview.user_id.slice(0, 12)}...
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Product ID</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedReview.product_id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedReview.rating)}
                    <span className="text-sm text-muted-foreground ml-2">
                      {selectedReview.rating}/5
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div>
                    <Badge
                      variant={
                        selectedReview.approved ? "default" : "secondary"
                      }
                      className={
                        selectedReview.approved
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }
                    >
                      {selectedReview.approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Review Content</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedReview.comment}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium">Created</label>
                  <p className="text-muted-foreground">
                    {formatDate(selectedReview.created_at)}
                  </p>
                </div>
                <div>
                  <label className="font-medium">Rating</label>
                  <p className="text-muted-foreground">
                    {selectedReview.rating} out of 5 stars
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedReview && (
              <div className="flex space-x-2">
                {!selectedReview.approved ? (
                  <Button
                    onClick={() => {
                      updateReviewStatus(selectedReview.id, true);
                      setSelectedReview(null);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve Review
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      updateReviewStatus(selectedReview.id, false);
                      setSelectedReview(null);
                    }}
                    variant="outline"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject Review
                  </Button>
                )}

                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteReview(selectedReview.id);
                    setSelectedReview(null);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsManagement;
