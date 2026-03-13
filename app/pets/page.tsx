"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PetsFilter } from "@/components/pets-filter"
import { PetCard } from "@/components/pet-card"
import { pets } from "@/lib/pets-data"
import { PawPrint } from "lucide-react"

export default function PetsPage() {
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    breed: "all",
    location: "all",
    gender: "all",
    size: "all",
    age: "all",
  })

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          pet.name.toLowerCase().includes(searchLower) ||
          pet.breed.toLowerCase().includes(searchLower) ||
          pet.description.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Type filter
      if (filters.type !== "all" && pet.type !== filters.type) return false

      // Breed filter
      if (filters.breed !== "all" && pet.breed !== filters.breed) return false

      // Location filter
      if (filters.location !== "all" && pet.location !== filters.location) return false

      // Gender filter
      if (filters.gender !== "all" && pet.gender !== filters.gender) return false

      // Size filter
      if (filters.size !== "all" && pet.size !== filters.size) return false

      return true
    })
  }, [filters])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <PawPrint className="h-6 w-6 text-primary" />
            </div>
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">
              Find Your Match
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
            Browse Available Pets
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            Discover your perfect companion from our selection of loving pets ready for adoption.
            Use our filters to find the ideal match for your family.
          </p>
        </div>
      </section>
      
      {/* Pets grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <PetsFilter filters={filters} onFiltersChange={setFilters} />
          
          {filteredPets.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                Showing <span className="font-semibold text-foreground">{filteredPets.length}</span> pets
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPets.map((pet, index) => (
                  <PetCard key={pet.id} pet={pet} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="glass rounded-3xl p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <PawPrint className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No pets found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We could not find any pets matching your filters. Try adjusting your search
                criteria or browse all available pets.
              </p>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
