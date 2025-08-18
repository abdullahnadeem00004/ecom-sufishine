import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    value: "info@sufishine.com",
    description: "Send us an email anytime",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+1-123-456-7890",
    description: "Mon-Fri, 9AM-6PM EST",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "123 Spiritual Lane\nPeaceful City, PC 12345",
    description: "Our headquarters",
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "Mon-Fri: 9AM-6PM\nSat: 10AM-4PM",
    description: "Eastern Standard Time",
  },
];

const faqs = [
  {
    question: "Is Sufi Shine hair oil 100% organic?",
    answer:
      "Yes! Our hair oil is made with 100% organic ingredients, USDA certified. We source only the finest natural oils including argan, jojoba, and rosemary extract, with no synthetic additives or chemicals.",
  },
  {
    question: "How often should I use the hair oil?",
    answer:
      "For best results, we recommend using Sufi Shine hair oil 2-3 times per week. Apply to damp or dry hair, focusing on mid-lengths and ends. You can also use it as an overnight treatment once a week.",
  },
  {
    question: "Is it suitable for all hair types?",
    answer:
      "Absolutely! Our organic formula is gentle and effective for all hair types - whether your hair is straight, curly, thick, fine, colored, or chemically treated. The natural ingredients adapt to your hair's specific needs.",
  },
  {
    question: "How long will one bottle last?",
    answer:
      "Our 100ml bottle typically lasts 2-3 months with regular use (2-3 times per week). A little goes a long way! Start with a few drops and add more as needed.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship worldwide! Domestic orders typically arrive in 3-5 business days, while international shipping takes 7-14 business days. Shipping charges are PKR 200 for first 4 products, then PKR 50 for each additional group of 4 products.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, you can return it for a full refund. Please contact our customer service team to initiate a return.",
  },
  {
    question: "Are your products cruelty-free?",
    answer:
      "Yes, we are 100% cruelty-free! We never test on animals and work only with suppliers who share our ethical values. We're also working towards full vegan certification for all our products.",
  },
  {
    question: "How should I store the hair oil?",
    answer:
      "Store your Sufi Shine hair oil in a cool, dry place away from direct sunlight. The bathroom cabinet or bedroom dresser is perfect. Proper storage helps maintain the oil's potency and extends its shelf life.",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission - in real app, this would integrate with Supabase
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: "Message sent successfully!",
        description:
          "Thank you for contacting Sufi Shine. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description:
          "Please try again or contact us directly at info@sufishine.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-muted/30 to-muted/50 spiritual-pattern">
        <div className="container px-4 py-16">
          <div className="text-center animate-fade-in">
            <Badge variant="outline" className="mb-6">
              💬 Get In Touch
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact{" "}
              <span className="font-script text-primary">Sufi Shine</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Have questions about our organic hair care products? We're here
                to help you on your journey to naturally beautiful hair.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover-glow border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{info.title}</h3>
                        <p className="text-sm font-medium whitespace-pre-line">
                          {info.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map Placeholder */}
            <Card className="overflow-hidden border-0 shadow-md">
              <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-8 w-8 text-primary mx-auto" />
                  <p className="text-sm font-medium">Our Location</p>
                  <p className="text-xs text-muted-foreground">
                    Visit our peaceful headquarters
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form & FAQ */}
          <div className="lg:col-span-2 space-y-12">
            {/* Contact Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                    >
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-spiritual"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    We typically respond within 24 hours during business days.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
