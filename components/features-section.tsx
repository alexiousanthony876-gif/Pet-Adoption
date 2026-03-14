"use client"

import { Heart, Search, Shield, Home, Clock, Award } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find your perfect match with our advanced filtering by breed, age, size, and temperament.",
  },
  {
    icon: Shield,
    title: "Verified Shelters",
    description: "All our partner shelters are verified and follow strict animal welfare standards.",
  },
  {
    icon: Heart,
    title: "Health Guaranteed",
    description: "Every pet comes with complete health records and vaccination history.",
  },
  {
    icon: Home,
    title: "Home Matching",
    description: "We help match pets with the right home environment for their needs.",
  },
  {
    icon: Clock,
    title: "Quick Process",
    description: "Streamlined adoption process with support every step of the way.",
  },
  {
    icon: Award,
    title: "Post-Adoption Support",
    description: "Lifetime support and resources to help you and your pet thrive together.",
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <div 
      className="group glass rounded-3xl p-8 transition-all duration-500 hover:shadow-xl hover:scale-[1.02]"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
        <feature.icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
    </div>
  )
}

export function FeaturesSection() {
  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.1 })

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={cn(
            "text-center max-w-2xl mx-auto mb-16 transition-all duration-700",
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            Everything You Need for a Perfect Adoption
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            We make pet adoption simple, safe, and joyful. Our platform connects
            loving families with pets in need of forever homes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
