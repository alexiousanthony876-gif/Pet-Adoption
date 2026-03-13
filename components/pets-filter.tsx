"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { breeds, locations } from "@/lib/pets-data"

interface FiltersState {
  search: string
  type: string
  breed: string
  location: string
  gender: string
  size: string
  age: string
}

interface PetsFilterProps {
  filters: FiltersState
  onFiltersChange: (filters: FiltersState) => void
}

const petTypes = ["all", "dog", "cat", "rabbit", "bird", "other"]
const sizes = ["all", "small", "medium", "large"]
const genders = ["all", "male", "female"]
const ages = ["all", "baby", "young", "adult", "senior"]

export function PetsFilter({ filters, onFiltersChange }: PetsFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const updateFilter = (key: keyof FiltersState, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      type: "all",
      breed: "all",
      location: "all",
      gender: "all",
      size: "all",
      age: "all",
    })
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== "search" && value !== "all" && value !== ""
  )

  const availableBreeds = filters.type === "all" 
    ? Object.values(breeds).flat() 
    : breeds[filters.type as keyof typeof breeds] || []

  const DropdownSelect = ({ 
    label, 
    value, 
    options, 
    onChange, 
    id 
  }: { 
    label: string
    value: string
    options: string[]
    onChange: (value: string) => void
    id: string
  }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-foreground/70 mb-2">{label}</label>
      <button
        onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors text-left"
      >
        <span className="capitalize">{value}</span>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          openDropdown === id && "rotate-180"
        )} />
      </button>
      {openDropdown === id && (
        <div className="absolute z-20 top-full left-0 right-0 mt-2 glass rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option)
                setOpenDropdown(null)
              }}
              className={cn(
                "w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors capitalize",
                value === option && "bg-primary/10 text-primary font-medium"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="glass rounded-3xl p-6 mb-8">
      {/* Search bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pets by name or breed..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
          />
        </div>
        
        {/* Quick type filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          {petTypes.map((type) => (
            <button
              key={type}
              onClick={() => updateFilter("type", type)}
              className={cn(
                "px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all",
                filters.type === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-foreground"
              )}
            >
              {type === "all" ? "All Pets" : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
            </button>
          ))}
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "rounded-xl border-2 gap-2",
            hasActiveFilters && "border-primary text-primary"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {Object.entries(filters).filter(([key, value]) => key !== "search" && value !== "all" && value !== "").length}
            </span>
          )}
        </Button>
      </div>
      
      {/* Expanded filters */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DropdownSelect
              id="breed"
              label="Breed"
              value={filters.breed}
              options={["all", ...availableBreeds]}
              onChange={(v) => updateFilter("breed", v)}
            />
            <DropdownSelect
              id="location"
              label="Location"
              value={filters.location}
              options={["all", ...locations]}
              onChange={(v) => updateFilter("location", v)}
            />
            <DropdownSelect
              id="gender"
              label="Gender"
              value={filters.gender}
              options={genders}
              onChange={(v) => updateFilter("gender", v)}
            />
            <DropdownSelect
              id="size"
              label="Size"
              value={filters.size}
              options={sizes}
              onChange={(v) => updateFilter("size", v)}
            />
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-2" />
              Clear all filters
            </Button>
            <Button
              onClick={() => setIsExpanded(false)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
