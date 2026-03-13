import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Heart, Users, Home, Award, Target, Eye } from "lucide-react"

const stats = [
  { value: "5,000+", label: "Pets Adopted" },
  { value: "200+", label: "Partner Shelters" },
  { value: "50K+", label: "Happy Families" },
  { value: "98%", label: "Satisfaction Rate" },
]

const team = [
  {
    name: "Sarah Mitchell",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
  },
  {
    name: "David Chen",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    name: "Emily Rodriguez",
    role: "Animal Welfare Director",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  {
    name: "Michael Thompson",
    role: "Community Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
]

const values = [
  {
    icon: Heart,
    title: "Compassion First",
    description: "Every decision we make is guided by our love for animals and commitment to their well-being.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "We believe in the power of community to create lasting change for animals in need.",
  },
  {
    icon: Home,
    title: "Perfect Matches",
    description: "We take time to understand both pets and families to create lifelong bonds.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in animal care, adoption processes, and customer service.",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 text-balance">
              Connecting Hearts, Creating Families
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Since 2020, Pawternity Hub has been on a mission to transform pet adoption.
              We believe every animal deserves a loving home, and every family deserves
              the joy that comes with a furry companion.
            </p>
          </div>
        </div>
      </section>
      
      {/* Stats */}
      <section className="py-16 -mt-8">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision */}
      <section id="mission" className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="glass rounded-3xl p-8 md:p-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To revolutionize pet adoption by creating a seamless, transparent, and
                joyful experience that connects loving families with pets in need. We
                strive to reduce shelter populations and ensure every pet finds their
                forever home.
              </p>
            </div>
            <div className="glass rounded-3xl p-8 md:p-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A world where no adoptable pet is left without a loving home. We envision
                a future where technology and compassion work together to create meaningful
                connections between pets and families, fostering a more humane society.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">
              Our Values
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 text-balance">
              What Drives Us Every Day
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="glass rounded-3xl p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team */}
      <section id="team" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">
              Our Team
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
              Meet the Pet Lovers Behind Pawternity Hub
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Our passionate team is dedicated to making pet adoption accessible,
              transparent, and joyful for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="group text-center">
                <div className="relative mb-6 overflow-hidden rounded-3xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
