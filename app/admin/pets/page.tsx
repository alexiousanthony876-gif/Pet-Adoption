"use client"

import { useEffect, useState } from "react"
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Upload,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Pet } from "@/components/pet-card"
import { getPets, addPet, updatePet, deletePet } from "@/lib/admin-store"
import { breeds, locations } from "@/lib/pets-data"

type PetType = "dog" | "cat" | "rabbit" | "bird" | "other"

const initialPetForm: Omit<Pet, "id"> = {
  name: "",
  type: "dog",
  breed: "",
  age: "",
  gender: "male",
  location: "",
  image: "",
  description: "",
  temperament: [],
  size: "medium",
}

export default function PetManagementPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [formData, setFormData] = useState(initialPetForm)
  const [temperamentInput, setTemperamentInput] = useState("")
  const [mounted, setMounted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    setMounted(true)
    loadPets()
  }, [])

  const loadPets = () => {
    const petsData = getPets()
    setPets(petsData)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = 
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || pet.type === filterType
    return matchesSearch && matchesType
  })

  const handleOpenModal = (pet?: Pet) => {
    if (pet) {
      setEditingPet(pet)
      setFormData({
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        location: pet.location,
        image: pet.image,
        description: pet.description,
        temperament: pet.temperament,
        size: pet.size,
      })
    } else {
      setEditingPet(null)
      setFormData(initialPetForm)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPet(null)
    setFormData(initialPetForm)
    setTemperamentInput("")
  }

  const handleAddTemperament = () => {
    if (temperamentInput.trim() && !formData.temperament.includes(temperamentInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        temperament: [...prev.temperament, temperamentInput.trim()],
      }))
      setTemperamentInput("")
    }
  }

  const handleRemoveTemperament = (trait: string) => {
    setFormData((prev) => ({
      ...prev,
      temperament: prev.temperament.filter((t) => t !== trait),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingPet) {
      const updatedPet: Pet = {
        ...formData,
        id: editingPet.id,
      }
      updatePet(updatedPet)
      setSuccessMessage(`${formData.name} has been updated successfully!`)
    } else {
      const newPet: Pet = {
        ...formData,
        id: `pet-${Date.now()}`,
      }
      addPet(newPet)
      setSuccessMessage(`${formData.name} has been added successfully!`)
    }
    
    loadPets()
    handleCloseModal()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleDelete = (petId: string) => {
    if (confirm("Are you sure you want to remove this pet?")) {
      const pet = pets.find(p => p.id === petId)
      deletePet(petId)
      loadPets()
      setSuccessMessage(`${pet?.name || "Pet"} has been removed.`)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const availableBreeds = breeds[formData.type as PetType] || []

  return (
    <div className="p-6 lg:p-8">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pet Management</h1>
          <p className="text-gray-400">Add, edit, and manage pets available for adoption.</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Pet
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search pets by name or breed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#1a1a1f] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 bg-[#1a1a1f] border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="dog">Dogs</option>
          <option value="cat">Cats</option>
          <option value="rabbit">Rabbits</option>
          <option value="bird">Birds</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Pets Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPets.map((pet) => (
          <div
            key={pet.id}
            className="bg-[#1a1a1f] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group"
          >
            <div className="relative aspect-square">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={() => handleOpenModal(pet)}
                  size="sm"
                  className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(pet.id)}
                  size="sm"
                  variant="destructive"
                  className="bg-red-500/80 hover:bg-red-500 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white">{pet.name}</h3>
                <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full capitalize">
                  {pet.type}
                </span>
              </div>
              <p className="text-sm text-gray-400">{pet.breed}</p>
              <p className="text-xs text-gray-500 mt-1">{pet.age} | {pet.location}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredPets.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">No pets found matching your criteria.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1f] border border-white/10 rounded-2xl">
            <div className="sticky top-0 bg-[#1a1a1f] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingPet ? "Edit Pet" : "Add New Pet"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/pet-image.jpg"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Name & Type */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pet Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter pet name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as PetType, breed: "" })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors cursor-pointer"
                    required
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="bird">Bird</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Breed & Age */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Breed
                  </label>
                  <select
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors cursor-pointer"
                    required
                  >
                    <option value="">Select breed</option>
                    {availableBreeds.map((breed) => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Age
                  </label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g., 2 years"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Gender & Size */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors cursor-pointer"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Size
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value as "small" | "medium" | "large" })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors cursor-pointer"
                    required
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors cursor-pointer"
                  required
                >
                  <option value="">Select location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Temperament */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Temperament
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={temperamentInput}
                    onChange={(e) => setTemperamentInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTemperament())}
                    placeholder="Add trait (e.g., Friendly)"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-primary focus:outline-none transition-colors"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTemperament}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-xl"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.temperament.map((trait) => (
                    <span
                      key={trait}
                      className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
                    >
                      {trait}
                      <button
                        type="button"
                        onClick={() => handleRemoveTemperament(trait)}
                        className="hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the pet's personality, history, and needs..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-primary focus:outline-none transition-colors min-h-[120px] resize-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  variant="ghost"
                  className="flex-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                >
                  {editingPet ? "Update Pet" : "Add Pet"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
