import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Heart, Shield, Users, Award, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: Leaf,
    title: 'Organic Purity',
    description: 'We source only the finest organic ingredients, ensuring every drop is pure and natural.'
  },
  {
    icon: Heart,
    title: 'Spiritual Harmony',
    description: 'Inspired by Sufi traditions of inner peace and natural beauty that radiates from within.'
  },
  {
    icon: Shield,
    title: 'Ethical Sourcing',
    description: 'Our ingredients are ethically sourced, supporting local communities and sustainable practices.'
  },
  {
    icon: Users,
    title: 'Community Care',
    description: 'We believe in giving back to the communities that provide us with these precious natural gifts.'
  },
  {
    icon: Award,
    title: 'Quality Promise',
    description: 'Every product is crafted with meticulous care and tested to meet our highest standards.'
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'Making a positive impact on both personal beauty and environmental sustainability.'
  },
];

const teamMembers = [
  {
    name: 'Aaliya Rahman',
    role: 'Founder & CEO',
    bio: 'A spiritual seeker and natural beauty enthusiast who founded Sufi Shine to share the wisdom of organic hair care.',
    image: '/placeholder.svg'
  },
  {
    name: 'Dr. Safiya Hassan',
    role: 'Head of Product Development',
    bio: 'With 15 years in organic chemistry, Dr. Hassan ensures every formula meets our purity standards.',
    image: '/placeholder.svg'
  },
  {
    name: 'Omar Al-Mansouri',
    role: 'Sustainability Director',
    bio: 'Dedicated to maintaining our ethical sourcing and environmental responsibility commitments.',
    image: '/placeholder.svg'
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-muted/30 to-muted/50 spiritual-pattern">
        <div className="container px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge variant="outline" className="mb-6">
              🌿 Our Story
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="font-script text-primary">Sufi Shine</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Born from the essence of purity and spiritual harmony, Sufi Shine brings you 
              organic hair care inspired by ancient wisdom and modern science.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-3xl font-bold">Our Journey</h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Sufi Shine was born from a deeply personal journey of discovering the 
                    transformative power of natural ingredients and spiritual practices. 
                    Our founder, inspired by the mystical traditions of Sufism, sought to 
                    create hair care products that nourish not just the hair, but the soul.
                  </p>
                  <p>
                    We believe that true beauty comes from within – from harmony between 
                    body, mind, and spirit. This philosophy guides everything we do, from 
                    sourcing our organic ingredients to crafting each bottle with mindful intention.
                  </p>
                  <p>
                    Every drop of Sufi Shine Organic Hair Oil carries this intention: 
                    to help you shine with the pure radiance that comes from embracing 
                    nature's gifts and your own inner light.
                  </p>
                </div>
              </div>
              
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-muted/30 to-muted/50 rounded-3xl p-8 text-center">
                  <div className="text-6xl mb-4">🌿</div>
                  <h3 className="text-2xl font-bold text-primary mb-2">Our Mission</h3>
                  <p className="text-lg text-muted-foreground font-script">
                    "Shine with Purity"
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    To empower individuals to embrace their natural beauty through 
                    organic hair care products that honor both tradition and innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30 spiritual-pattern">
        <div className="container px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our journey and inspire everything we create
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card key={value.title} className="hover-glow border-0 shadow-lg">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind Sufi Shine's commitment to organic purity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={member.name} className="hover-glow border-0 shadow-lg">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Commitments */}
      <section className="py-16 bg-muted/30 spiritual-pattern">
        <div className="container px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Our Commitments</h2>
            <p className="text-xl text-muted-foreground">
              Certified and committed to the highest standards
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: '🌿', label: '100% Organic', desc: 'USDA Certified' },
              { icon: '🐰', label: 'Cruelty-Free', desc: 'Never Tested' },
              { icon: '♻️', label: 'Eco-Friendly', desc: 'Sustainable Packaging' },
              { icon: '✨', label: 'Pure & Natural', desc: 'No Chemicals' },
            ].map((cert, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl">{cert.icon}</div>
                <h3 className="font-semibold">{cert.label}</h3>
                <p className="text-sm text-muted-foreground">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
        <div className="container px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Ready to Begin Your Journey?</h2>
            <p className="text-xl opacity-90">
              Experience the transformative power of Sufi Shine and discover 
              your hair's natural radiance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-gold">
                <Link to="/shop">
                  Shop Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}