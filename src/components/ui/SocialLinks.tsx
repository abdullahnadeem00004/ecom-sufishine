import { Button } from "@/components/ui/button";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

interface SocialLinksProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabels?: boolean;
}

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/sufi.shine/",
    icon: Instagram,
    bgColor:
      "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
    textColor: "text-white",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61573406648536",
    icon: Facebook,
    bgColor: "bg-blue-600 hover:bg-blue-700",
    textColor: "text-white",
  },
  {
    name: "WhatsApp",
    href: `https://wa.me/923041146524?text=${encodeURIComponent(
      "Hello! I am interested in SUFI SHINE products."
    )}`,
    icon: MessageCircle,
    bgColor: "bg-green-500 hover:bg-green-600",
    textColor: "text-white",
  },
];

export function SocialLinks({
  size = "md",
  className = "",
  showLabels = false,
}: SocialLinksProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const buttonSizes = {
    sm: "icon",
    md: "icon",
    lg: "icon",
  } as const;

  return (
    <div className={`flex space-x-3 ${className}`}>
      {socialLinks.map((social) => (
        <Button
          key={social.name}
          size={buttonSizes[size]}
          className={`hover-glow transition-all duration-300 border-0 ${
            social.bgColor
          } ${social.textColor} ${showLabels ? "px-4" : ""}`}
          asChild
        >
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <social.icon className={sizeClasses[size]} />
            {showLabels && <span>{social.name}</span>}
            <span className="sr-only">{social.name}</span>
          </a>
        </Button>
      ))}
    </div>
  );
}
