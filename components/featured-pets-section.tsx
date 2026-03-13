"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { PetCard } from "@/components/pet-card"
import { pets } from "@/lib/pets-data"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

export function FeaturedPetsSection() {
  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.1 })
  const featuredPets = pets.slice(0, 6)

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={cn(
            "flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 transition-all duration-700",
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div>
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">
              Featured Pets
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 text-balance">
              Meet Our Adorable Friends
            </h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-xl text-pretty">
              These furry friends are looking for loving homes. Each one has been
              health-checked and is ready to become part of your family.
            </p>
          </div>
          <Link href="/pets">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-6 border-2 font-medium group"
            >
              View All Pets
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPets.map((pet, index) => (
            <PetCard key={pet.id} pet={pet} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
