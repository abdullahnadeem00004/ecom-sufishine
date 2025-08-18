import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Search, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock blog data
const blogPosts = [
  {
    id: 1,
    title: 'Benefits of Organic Hair Care: Why Natural is Better',
    excerpt: 'Discover the transformative benefits of switching to organic hair care products and how they can revolutionize your hair health naturally.',
    content: 'Organic hair care products have gained tremendous popularity in recent years, and for good reason...',
    author: 'Dr. Safiya Hassan',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Hair Care Tips',
    tags: ['Organic', 'Natural Hair Care', 'Health'],
    image: '/placeholder.svg',
    featured: true
  },
  {
    id: 2,
    title: 'Sufi Inspiration in Beauty: Ancient Wisdom for Modern Hair Care',
    excerpt: 'Explore how the mystical traditions of Sufism inspire our approach to natural beauty and spiritual wellness.',
    content: 'The ancient wisdom of Sufi traditions teaches us about the interconnectedness of body, mind, and spirit...',
    author: 'Aaliya Rahman',
    date: '2024-01-10',
    readTime: '7 min read',
    category: 'Spiritual Beauty',
    tags: ['Sufism', 'Spirituality', 'Beauty Philosophy'],
    image: '/placeholder.svg',
    featured: false
  },
  {
    id: 3,
    title: 'The Science Behind Natural Hair Oils: What Makes Them Work',
    excerpt: 'Dive deep into the molecular science of natural hair oils and understand why they\'re so effective for hair health.',
    content: 'Understanding the science behind natural hair oils helps us appreciate why these traditional remedies...',
    author: 'Dr. Safiya Hassan',
    date: '2024-01-05',
    readTime: '6 min read',
    category: 'Science',
    tags: ['Hair Science', 'Natural Oils', 'Research'],
    image: '/placeholder.svg',
    featured: false
  },
  {
    id: 4,
    title: 'Sustainable Beauty: Our Commitment to the Planet',
    excerpt: 'Learn about our eco-friendly practices and how choosing organic beauty products makes a difference.',
    content: 'Sustainability isn\'t just a buzzword for us – it\'s a core principle that guides every decision we make...',
    author: 'Omar Al-Mansouri',
    date: '2023-12-28',
    readTime: '4 min read',
    category: 'Sustainability',
    tags: ['Eco-Friendly', 'Sustainability', 'Environment'],
    image: '/placeholder.svg',
    featured: false
  }
];

const categories = ['All', 'Hair Care Tips', 'Spiritual Beauty', 'Science', 'Sustainability'];
const popularTags = ['Organic', 'Natural Hair Care', 'Sufism', 'Hair Science', 'Sustainability', 'Beauty Tips'];

export default function Blog() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-muted/30 to-muted/50 spiritual-pattern">
        <div className="container px-4 py-16">
          <div className="text-center animate-fade-in">
            <Badge variant="outline" className="mb-6">
              📚 Insights & Inspiration
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="font-script text-primary">Sufi Shine</span> Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the wisdom of organic hair care, spiritual beauty practices, 
              and the science behind natural wellness.
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Post */}
            {featuredPost && (
              <div className="animate-fade-in">
                <Badge className="mb-4 bg-accent text-accent-foreground">
                  ⭐ Featured Article
                </Badge>
                <Card className="overflow-hidden hover-glow border-0 shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-8 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-3xl">🌿</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Featured Image</p>
                      </div>
                    </div>
                    <CardContent className="p-8 space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Badge variant="secondary">{featuredPost.category}</Badge>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>
                      
                      <h2 className="text-2xl font-bold">{featuredPost.title}</h2>
                      <p className="text-muted-foreground">{featuredPost.excerpt}</p>
                      
                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{featuredPost.author}</span>
                        </div>
                        <Button asChild className="btn-spiritual">
                          <Link to={`/blog/${featuredPost.id}`}>
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            )}

            {/* Regular Posts */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularPosts.map((post) => (
                  <Card key={post.id} className="hover-glow border-0 shadow-lg overflow-hidden">
                    {/* Post Image Placeholder */}
                    <div className="relative bg-gradient-to-br from-muted/30 to-muted/50 h-48 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                          {post.category === 'Hair Care Tips' && <span className="text-2xl">💁‍♀️</span>}
                          {post.category === 'Spiritual Beauty' && <span className="text-2xl">✨</span>}
                          {post.category === 'Science' && <span className="text-2xl">🔬</span>}
                          {post.category === 'Sustainability' && <span className="text-2xl">🌍</span>}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{post.author}</span>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/blog/${post.id}`}>
                          Read More
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Search */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Search Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search articles..." className="pl-10" />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className="w-full text-left p-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      {category}
                      {category !== 'All' && (
                        <span className="float-right text-muted-foreground">
                          {blogPosts.filter(post => post.category === category).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="text-lg font-semibold">Stay Updated</h3>
                <p className="text-sm text-muted-foreground">
                  Subscribe to our newsletter for the latest articles and hair care tips.
                </p>
                <div className="space-y-2">
                  <Input placeholder="Your email address" />
                  <Button className="w-full btn-spiritual">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Recent Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {blogPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="space-y-2">
                    <Link to={`/blog/${post.id}`} className="block">
                      <h4 className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                    </Link>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    {post !== blogPosts[2] && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}