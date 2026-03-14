"use client"

import { use, useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Pet3DViewer } from "@/components/pet-3d-viewer"
import { 
  ArrowLeft, 
  Heart, 
  MapPin, 
  Calendar, 
  Weight, 
  PawPrint,
  Share2,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AdoptionModal } from "@/components/adoption-modal"

type Pet = {
  id: string
  name: string
  breed: string
  age_months: number
  gender: "Male" | "Female"
  category_id: string
  description: string
  image_url: string
  model_3d_url?: string
  health_status: string
  vaccination_status: string
  adoption_status: string
  weight_kg?: number
  color?: string
  special_needs?: string
  created_at: string
}

type Category = {
  id: string
  name: string
}

export default function PetProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient()
  const { id } = use(params)
  const [pet, setPet] = useState<Pet | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false)
  const [similarPets, setSimilarPets] = useState<Pet[]>([])

  useEffect(() => {
    loadPet()
  }, [id])

  const loadPet = async () => {
    setIsLoading(true)
    try {
      // Load pet
      const { data: petData } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .single()

      if (!petData) {
        notFound()
        return
      }

      setPet(petData)

      // Load category
      const { data: categoryData } = await supabase
        .from("pet_categories")
        .select("*")
        .eq("id", petData.category_id)
        .single()

      if (categoryData) {
        setCategory(categoryData)
      }

      // Load similar pets
      const { data: similarData } = await supabase
        .from("pets")
        .select("*")
        .eq("category_id", petData.category_id)
        .neq("id", id)
        .eq("adoption_status", "Available")
        .limit(3)

      if (similarData) {
        setSimilarPets(similarData)
      }
    } catch (error) {
      console.error("Error loading pet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    )
  }

  if (!pet) {
    notFound()
  }

  const ageInYears = Math.floor(pet.age_months / 12)
  const ageInMonths = pet.age_months % 12

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link href="/pets">
            <Button variant="ghost" className="mb-6 -ml-2 group">
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Pets
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side - Image/3D Model */}
            <div className="space-y-6">
              {pet.model_3d_url ? (
                <Pet3DViewer 
                  modelUrl={pet.model_3d_url} 
                  petName={pet.name}
                  height="h-96"
                />
              ) : (
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-secondary">
                  {pet.image_url ? (
                    <Image
                      src={pet.image_url}
                      alt={pet.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PawPrint className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              )}

              {/* Health Badge */}
              <div className="glass rounded-2xl p-4 space-y-3">
                <h3 className="font-semibold text-foreground">Health Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-foreground">
                      Health: <span className="font-medium">{pet.health_status}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-foreground">
                      Vaccinations: <span className="font-medium">{pet.vaccination_status}</span>
                    </span>
                  </div>
                  {pet.special_needs && (
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">
                        Special Needs: <span className="font-medium">{pet.special_needs}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side - Details */}
            <div className="space-y-8">
              {/* Title and Actions */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-5xl font-bold text-foreground mb-2">{pet.name}</h1>
                    {category && (
                      <p className="text-lg text-primary font-medium">{category.name} • {pet.breed}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-3 rounded-full hover:bg-secondary transition-colors"
                  >
                    <Heart
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isLiked ? "fill-primary text-primary" : "text-muted-foreground"
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-2xl p-4">
                  <div className="text-muted-foreground text-sm font-medium mb-1">Age</div>
                  <div className="text-2xl font-bold text-foreground">
                    {ageInYears > 0 ? `${ageInYears}y ${ageInMonths}m` : `${pet.age_months}m`}
                  </div>
                </div>
                <div className="glass rounded-2xl p-4">
                  <div className="text-muted-foreground text-sm font-medium mb-1">Gender</div>
                  <div className="text-2xl font-bold text-foreground">{pet.gender}</div>
                </div>
                {pet.weight_kg && (
                  <div className="glass rounded-2xl p-4">
                    <div className="text-muted-foreground text-sm font-medium mb-1">Weight</div>
                    <div className="text-2xl font-bold text-foreground">{pet.weight_kg} kg</div>
                  </div>
                )}
                {pet.color && (
                  <div className="glass rounded-2xl p-4">
                    <div className="text-muted-foreground text-sm font-medium mb-1">Color</div>
                    <div className="text-2xl font-bold text-foreground">{pet.color}</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">About {pet.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{pet.description}</p>
              </div>

              {/* Adoption Status */}
              <div className={cn(
                "glass rounded-2xl p-4 border-2",
                pet.adoption_status === "Available" && "border-green-500/20 bg-green-500/5",
                pet.adoption_status === "Pending Adoption" && "border-yellow-500/20 bg-yellow-500/5",
                pet.adoption_status === "Adopted" && "border-blue-500/20 bg-blue-500/5",
              )}>
                <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                <p className="text-lg font-bold text-foreground">{pet.adoption_status}</p>
              </div>

              {/* CTA Buttons */}
              {pet.adoption_status === "Available" && (
                <div className="flex gap-4">
                  <Button
                    onClick={() => setIsAdoptionModalOpen(true)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-xl"
                  >
                    Start Adoption
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 py-6 text-lg font-semibold rounded-xl"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Similar Pets */}
          {similarPets.length > 0 && (
            <div className="mt-24">
              <h2 className="text-3xl font-bold text-foreground mb-8">Similar Pets</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {similarPets.map((p) => (
                  <Link key={p.id} href={`/pets/${p.id}`}>
                    <div className="glass rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="relative w-full aspect-square overflow-hidden bg-secondary">
                        {p.image_url ? (
                          <Image
                            src={p.image_url}
                            alt={p.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PawPrint className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-foreground mb-1">{p.name}</h3>
                        <p className="text-sm text-muted-foreground">{p.breed}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Adoption Modal */}
      <AdoptionModal
        isOpen={isAdoptionModalOpen}
        onClose={() => setIsAdoptionModalOpen(false)}
        petId={pet.id}
        petName={pet.name}
      />

      <Footer />
    </main>
  )
}
