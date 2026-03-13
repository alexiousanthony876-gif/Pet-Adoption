"use client"

import { Heart, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

export interface Pet {
  id: string
  name: string
  type: "dog" | "cat" | "rabbit" | "bird" | "other"
  breed: string
  age: string
  gender: "male" | "female"
  location: string
  image: string
  description: string
  temperament: string[]
  size: "small" | "medium" | "large"
}

interface PetCardProps {
  pet: Pet
  index?: number
  className?: string
}

export function PetCard({ pet, index = 0, className }: PetCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Link href={`/pets/${pet.id}`}>
      <div
        className={cn(
          "group glass rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] cursor-pointer",
          className
        )}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-secondary">
          <img
            src={pet.image}
            alt={pet.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-700 group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
          )}
          
          {/* Like button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsLiked(!isLiked)
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center transition-transform hover:scale-110"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-foreground/70"
              )}
            />
          </button>
          
          {/* Type badge */}
          <div className="absolute bottom-4 left-4 glass rounded-full px-3 py-1 text-sm font-medium capitalize">
            {pet.type}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {pet.name}
              </h3>
              <p className="text-muted-foreground text-sm">{pet.breed}</p>
            </div>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              pet.gender === "male" 
                ? "bg-blue-100 text-blue-700" 
                : "bg-pink-100 text-pink-700"
            )}>
              {pet.gender === "male" ? "Male" : "Female"}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {pet.age}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {pet.location}
            </div>
          </div>
          
          {/* Temperament tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {pet.temperament.slice(0, 3).map((trait) => (
              <span
                key={trait}
                className="px-2 py-1 rounded-full bg-secondary text-xs font-medium text-foreground/70"
              >
                {trait}
              </span>
            ))}
          </div>
          
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium group-hover:shadow-lg transition-all">
            Meet {pet.name}
          </Button>
        </div>
      </div>
    </Link>
  )
}
