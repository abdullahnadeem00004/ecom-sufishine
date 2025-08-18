import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import SufiShineLogo from "@/components/ui/SufiShineLogo";

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Shop", href: "/shop" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

const customerService = [
  { name: "FAQ", href: "/faq" },
  { name: "Shipping Info", href: "/shipping" },
  { name: "Returns", href: "/returns" },
  { name: "Size Guide", href: "/size-guide" },
  { name: "Track Order", href: "/track" },
  { name: "Support", href: "/support" },
];

export function Footer() {
  return (
    <footer className="bg-muted/50 spiritual-pattern">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <SufiShineLogo className="h-10 w-auto text-primary" />
              <span className="font-script text-2xl font-bold text-primary">
                SUFI SHINE
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Shine with Purity - Your complete organic beauty destination. From
              hair care to skin care, discover nature's essence in every
              product.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="hover-glow">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="outline" size="icon" className="hover-glow">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="outline" size="icon" className="hover-glow">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              {customerService.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@sufishine.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1-123-456-7890</span>
              </div>
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>
                  123 Spiritual Lane
                  <br />
                  Peaceful City, PC 12345
                </span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-2">
              <h4 className="font-medium">Subscribe to our newsletter</h4>
              <p className="text-xs text-muted-foreground">
                Get the latest updates on organic beauty products and spiritual
                wellness.
              </p>
              <form className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button type="submit" size="icon" className="btn-spiritual">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </form>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 SUFI SHINE. All rights reserved. Crafted with spiritual care.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>🌿 100% Organic</span>
            <span>🐰 Cruelty-Free</span>
            <span>♻️ Eco-Friendly</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
