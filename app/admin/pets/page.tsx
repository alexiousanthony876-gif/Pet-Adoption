"use client"

import { useEffect, useState } from "react"
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  CheckCircle,
  AlertCircle,
  Upload,
  Loader2,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
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
  model_3d_url?: string
  health_status: "Healthy" | "Under Treatment" | "Recovering"
  vaccination_status: "Completed" | "Pending" | "Partial"
  adoption_status: "Available" | "Pending Adoption" | "Adopted" | "Reserved"
  weight_kg?: number
  color?: string
  special_needs?: string
}

type Category = {
  id: string
  name: string
  description?: string
}

const initialPetForm: Omit<Pet, "id"> = {
  name: "",
  breed: "",
  age_months: 0,
  gender: "Male",
  category_id: "",
  description: "",
  image_url: "",
  health_status: "Healthy",
  vaccination_status: "Pending",
  adoption_status: "Available",
}

export default function PetManagementPage() {
  const supabase = createClient()
  const [pets, setPets] = useState<Pet[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [formData, setFormData] = useState(initialPetForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Load pets and categories on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
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

      // Load pets
      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (petsError) {
        setError("Failed to load pets")
      } else if (petsData) {
        setPets(petsData)
      }
    } catch (err) {
      setError("Error loading data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (pet?: Pet) => {
    setError("")
    setSuccess("")
    if (pet) {
      setEditingPet(pet)
      setFormData({
        name: pet.name,
        breed: pet.breed,
        age_months: pet.age_months,
        gender: pet.gender,
        category_id: pet.category_id,
        description: pet.description,
        image_url: pet.image_url,
        health_status: pet.health_status,
        vaccination_status: pet.vaccination_status,
        adoption_status: pet.adoption_status,
        weight_kg: pet.weight_kg,
        color: pet.color,
        special_needs: pet.special_needs,
        model_3d_url: pet.model_3d_url,
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
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)

    try {
      if (!formData.name || !formData.breed || !formData.category_id) {
        setError("Please fill in all required fields")
        setIsSaving(false)
        return
      }

      if (editingPet) {
        // Update existing pet
        const { error } = await supabase
          .from("pets")
          .update(formData)
          .eq("id", editingPet.id)
        
        if (error) {
          setError("Failed to update pet: " + error.message)
        } else {
          setSuccess("Pet updated successfully!")
          await loadData()
          setTimeout(() => handleCloseModal(), 1500)
        }
      } else {
        // Add new pet
        const { error } = await supabase
          .from("pets")
          .insert([formData])
        
        if (error) {
          setError("Failed to add pet: " + error.message)
        } else {
          setSuccess("Pet added successfully!")
          await loadData()
          setTimeout(() => handleCloseModal(), 1500)
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pet?")) return

    try {
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", id)
      
      if (error) {
        setError("Failed to delete pet")
      } else {
        setSuccess("Pet deleted successfully")
        setPets(pets.filter(p => p.id !== id))
      }
    } catch (err) {
      setError("Error deleting pet")
    }
  }

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = 
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || pet.adoption_status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || "Unknown"
  }

  return (
    <div className="min-h-screen bg-[#0f0f12]">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Pet Management</h1>
            <p className="text-gray-400">Manage all pets in the adoption system</p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Pet
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 border-b border-white/10">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or breed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:border-primary outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Pending Adoption">Pending Adoption</option>
            <option value="Adopted">Adopted</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mx-6 mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Pets Table */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No pets found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {pet.image_url && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={pet.image_url}
                        alt={pet.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">{pet.name}</h3>
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        pet.adoption_status === "Available" && "bg-green-500/20 text-green-400",
                        pet.adoption_status === "Pending Adoption" && "bg-yellow-500/20 text-yellow-400",
                        pet.adoption_status === "Adopted" && "bg-blue-500/20 text-blue-400",
                        pet.adoption_status === "Reserved" && "bg-purple-500/20 text-purple-400",
                      )}>
                        {pet.adoption_status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      {getCategoryName(pet.category_id)} • {pet.breed} • {pet.age_months} months • {pet.gender}
                    </p>
                    <p className="text-sm text-gray-300 line-clamp-1">{pet.description}</p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">
                        Health: {pet.health_status}
                      </span>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">
                        Vaccine: {pet.vaccination_status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenModal(pet)}
                      className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(pet.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#1a1a1f] pb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                {editingPet ? "Edit Pet" : "Add New Pet"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Pet Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
                  placeholder="Enter pet name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Breed *
                  </label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
                    placeholder="Enter breed"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Age (months)
                  </label>
                  <input
                    type="number"
                    value={formData.age_months}
                    onChange={(e) => setFormData({ ...formData, age_months: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Male" | "Female" })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight_kg || ""}
                    onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
                    placeholder="0.0"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none resize-none"
                  placeholder="Enter pet description"
                  rows={3}
                />
              </div>

              {/* Status Fields */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Health Status
                  </label>
                  <select
                    value={formData.health_status}
                    onChange={(e) => setFormData({ ...formData, health_status: e.target.value as any })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Under Treatment">Under Treatment</option>
                    <option value="Recovering">Recovering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Vaccination Status
                  </label>
                  <select
                    value={formData.vaccination_status}
                    onChange={(e) => setFormData({ ...formData, vaccination_status: e.target.value as any })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Adoption Status
                  </label>
                  <select
                    value={formData.adoption_status}
                    onChange={(e) => setFormData({ ...formData, adoption_status: e.target.value as any })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Pending Adoption">Pending Adoption</option>
                    <option value="Adopted">Adopted</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    3D Model URL
                  </label>
                  <input
                    type="url"
                    value={formData.model_3d_url || ""}
                    onChange={(e) => setFormData({ ...formData, model_3d_url: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
                    placeholder="https://...model.glb"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={formData.color || ""}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
                    placeholder="e.g., Brown and White"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Special Needs
                  </label>
                  <input
                    type="text"
                    value={formData.special_needs || ""}
                    onChange={(e) => setFormData({ ...formData, special_needs: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary outline-none"
                    placeholder="e.g., Requires regular medication"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingPet ? "Update Pet" : "Add Pet"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
