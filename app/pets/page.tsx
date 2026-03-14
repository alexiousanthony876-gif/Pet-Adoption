"use client"

import { useState, useEffect, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PetCard } from "@/components/pet-card"
import { createClient } from "@/lib/supabase/client"
import { PawPrint, Loader2 } from "lucide-react"
import Image from "next/image"

type Pet = {
  id: string
  name: string
  breed: string
  age_months: number
  gender: "Male" | "Female"
  category_id: string
  description: string
  image_url: string
  health_status: string
  vaccination_status: string
  adoption_status: string
  color?: string
}

type Category = {
  id: string
  name: string
}

export default function PetsPage() {
  const supabase = createClient()
  const [pets, setPets] = useState<Pet[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    gender: "all",
    healthStatus: "all",
  })

  useEffect(() => {
    loadPets()
  }, [])

  const loadPets = async () => {
    setIsLoading(true)
    try {
      // Load categories
      const { data: categoriesData } = await supabase
        .from("pet_categories")
        .select("*")
        .order("name")
      
      if (categoriesData) {
        setCategories(categoriesData)
      }

      // Load only available pets
      const { data: petsData } = await supabase
        .from("pets")
        .select("*")
        .eq("adoption_status", "Available")
        .order("created_at", { ascending: false })
      
      if (petsData) {
        setPets(petsData)
      }
    } catch (error) {
      console.error("Error loading pets:", error)
    } finally {
      setIsLoading(false)
    }
  }

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

      // Category filter
      if (filters.category !== "all" && pet.category_id !== filters.category) return false

      // Gender filter
      if (filters.gender !== "all" && pet.gender !== filters.gender) return false

      // Health status filter
      if (filters.healthStatus !== "all" && pet.health_status !== filters.healthStatus) return false

      return true
    })
  }, [pets, filters])

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || "Unknown"
  }

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
      
      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name or breed..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="all">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Health</label>
              <select
                value={filters.healthStatus}
                onChange={(e) => setFilters({ ...filters, healthStatus: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="all">All Health Status</option>
                <option value="Healthy">Healthy</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Recovering">Recovering</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pets grid */}
      <section className="pb-24 pt-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPets.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                Showing <span className="font-semibold text-foreground">{filteredPets.length}</span> pets
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPets.map((pet) => (
                  <PetCard 
                    key={pet.id} 
                    petData={{
                      id: pet.id,
                      name: pet.name,
                      breed: pet.breed,
                      image: pet.image_url,
                      description: pet.description,
                      type: getCategoryName(pet.category_id).toLowerCase(),
                      category: getCategoryName(pet.category_id),
                      age: Math.ceil(pet.age_months / 12).toString(),
                      gender: pet.gender === "Male" ? "male" : "female",
                      age_months: pet.age_months,
                      health_status: pet.health_status,
                      adoption_status: pet.adoption_status,
                    }}
                  />
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
                Try adjusting your filters to see more available pets.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
