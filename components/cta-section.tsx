"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, PawPrint } from "lucide-react"
import Link from "next/link"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

export function CTASection() {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={ref}
          className={cn(
            "glass rounded-[3rem] p-12 md:p-16 text-center transition-all duration-700",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex justify-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce-slow">
              <PawPrint className="h-8 w-8 text-primary" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce-slow" style={{ animationDelay: "0.5s" }}>
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Ready to Find Your
            <br />
            <span className="text-primary">Perfect Companion?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Thousands of loving pets are waiting for a family like yours. Start your
            adoption journey today and give a pet the forever home they deserve.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pets">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 py-6 text-lg font-semibold group"
              >
                Browse Pets
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-10 py-6 text-lg font-semibold border-2 hover:bg-secondary"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
