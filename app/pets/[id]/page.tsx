"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { pets } from "@/lib/pets-data"
import { 
  ArrowLeft, 
  Heart, 
  MapPin, 
  Calendar, 
  Ruler, 
  PawPrint,
  Share2,
  CheckCircle2,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AdoptionModal } from "@/components/adoption-modal"

export default function PetProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const pet = pets.find((p) => p.id === id)
  const [isLiked, setIsLiked] = useState(false)
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  if (!pet) {
    notFound()
  }

  const similarPets = pets
    .filter((p) => p.type === pet.type && p.id !== pet.id)
    .slice(0, 3)

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
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image section */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden glass">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-500",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  </div>
                )}
                
                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="w-12 h-12 rounded-full glass flex items-center justify-center transition-transform hover:scale-110"
                  >
                    <Heart
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isLiked ? "fill-red-500 text-red-500" : "text-foreground/70"
                      )}
                    />
                  </button>
                  <button
                    className="w-12 h-12 rounded-full glass flex items-center justify-center transition-transform hover:scale-110"
                  >
                    <Share2 className="h-6 w-6 text-foreground/70" />
                  </button>
                </div>
              </div>
              
              {/* Quick info cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass rounded-2xl p-4 text-center">
                  <Calendar className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-semibold text-foreground">{pet.age}</p>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <Ruler className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-semibold text-foreground capitalize">{pet.size}</p>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <PawPrint className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Breed</p>
                  <p className="font-semibold text-foreground text-sm">{pet.breed}</p>
                </div>
              </div>
            </div>
            
            {/* Content section */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-primary font-semibold tracking-wide uppercase text-sm capitalize">
                    {pet.type} for Adoption
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2">
                    {pet.name}
                  </h1>
                </div>
                <span className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium",
                  pet.gender === "male" 
                    ? "bg-blue-100 text-blue-700" 
                    : "bg-pink-100 text-pink-700"
                )}>
                  {pet.gender === "male" ? "Male" : "Female"}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <MapPin className="h-5 w-5" />
                <span>{pet.location}</span>
              </div>
              
              {/* Temperament */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-3">Temperament</h3>
                <div className="flex flex-wrap gap-2">
                  {pet.temperament.map((trait) => (
                    <span
                      key={trait}
                      className="px-4 py-2 rounded-full bg-secondary text-foreground font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* About */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-3">About {pet.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{pet.description}</p>
              </div>
              
              {/* Health info */}
              <div className="glass rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Health & Care
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Vaccinated",
                    "Microchipped",
                    "Spayed/Neutered",
                    "Health Checked",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 text-lg font-semibold"
                  onClick={() => setIsAdoptionModalOpen(true)}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Adopt {pet.name}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full py-6 text-lg font-semibold border-2"
                >
                  Schedule a Visit
                </Button>
              </div>
            </div>
          </div>
          
          {/* Similar pets */}
          {similarPets.length > 0 && (
            <div className="mt-24">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Similar Pets You Might Like
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarPets.map((p) => (
                  <Link key={p.id} href={`/pets/${p.id}`}>
                    <div className="glass rounded-3xl overflow-hidden group cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-muted-foreground">{p.breed}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      <AdoptionModal 
        pet={pet} 
        isOpen={isAdoptionModalOpen} 
        onClose={() => setIsAdoptionModalOpen(false)} 
      />
      
      <Footer />
    </main>
  )
}
