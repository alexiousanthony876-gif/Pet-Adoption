"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Star, Users } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const Hero3DScene = dynamic(
  () => import("./hero-3d-scene").then((mod) => mod.Hero3DScene),
  { ssr: false }
)

const stats = [
  { icon: Heart, value: "5,000+", label: "Pets Adopted" },
  { icon: Users, value: "10,000+", label: "Happy Families" },
  { icon: Star, value: "4.9", label: "Rating" },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-accent/10" />
      
      {/* 3D Scene */}
      <Hero3DScene />
      
      {/* Content */}
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground/80">
              Over 5,000 pets found their forever homes
            </span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            <span className="text-balance">
              Find Your Perfect
              <br />
              <span className="text-primary">Pet Companion</span>
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 text-pretty">
            Discover loving pets waiting for their forever homes. Browse through
            hundreds of dogs, cats, and other furry friends looking for a family
            like yours.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
            <Link href="/pets">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg font-semibold group"
              >
                Adopt Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 py-6 text-lg font-semibold border-2 hover:bg-secondary"
              >
                Learn More
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-700">
            {stats.map((stat, index) => (
              <div key={index} className="glass rounded-2xl p-4 text-center">
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce-slow">
        <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  )
}
