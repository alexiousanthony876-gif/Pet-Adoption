"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle2, PawPrint, Heart, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface AdoptionModalProps {
  isOpen: boolean
  onClose: () => void
  petId: string
  petName: string
}

type FormStep = "info" | "questions" | "review" | "success"

interface FormData {
  reason_for_adoption: string
  home_type: string
  other_pets: string
  num_family_members: number
  experience_with_pets: string
}

const initialFormData: FormData = {
  reason_for_adoption: "",
  home_type: "",
  other_pets: "",
  num_family_members: 1,
  experience_with_pets: "",
}

export function AdoptionModal({ isOpen, onClose, petId, petName }: AdoptionModalProps) {
  const supabase = createClient()
  const { user, loading: authLoading } = useAuth()
  const [step, setStep] = useState<FormStep>("info")
  const [formData, setFormData] = useState(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isOpen) {
      setStep("info")
      setFormData(initialFormData)
      setError("")
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError("Please log in to submit an adoption request")
      return
    }

    if (step === "questions") {
      setStep("review")
      return
    }

    if (step === "review") {
      setIsLoading(true)
      setError("")
      
      try {
        const { error: submitError } = await supabase
          .from("adoption_requests")
          .insert([
            {
              user_id: user.id,
              pet_id: petId,
              status: "Pending",
              reason_for_adoption: formData.reason_for_adoption,
              home_type: formData.home_type,
              other_pets: formData.other_pets,
              num_family_members: formData.num_family_members,
              experience_with_pets: formData.experience_with_pets,
            }
          ])

        if (submitError) {
          setError("Failed to submit adoption request. Please try again.")
          console.error(submitError)
        } else {
          setStep("success")
        }
      } catch (err: any) {
        setError(err.message || "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!isOpen) return null

  if (authLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative w-full max-w-md bg-background rounded-2xl p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full max-w-md bg-background rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Sign In Required</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-muted-foreground">
            You need to be logged in to submit an adoption request for {petName}.
          </p>

          <div className="flex gap-3">
            <Link href="/login" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button variant="outline" className="w-full">
                Sign Up
              </Button>
            </Link>
          </div>

          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Adopt {petName}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step indicator */}
          <div className="flex gap-2">
            {["info", "questions", "review", "success"].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  step === s ? "bg-primary" : (["info", "questions", "review"].includes(step) && ["info", "questions", "review"].indexOf(step) >= ["info", "questions", "review"].indexOf(s as any)) ? "bg-primary/50" : "bg-border"
                )}
              />
            ))}
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {step === "info" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Your Information</h3>
              <p className="text-sm text-muted-foreground">
                We have your basic information on file. You can update it here if needed.
              </p>
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                <p className="text-sm"><span className="font-medium text-foreground">{user.email}</span></p>
              </div>
            </div>
          )}

          {step === "questions" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Tell Us About Your Home</h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Why do you want to adopt?
                </label>
                <textarea
                  value={formData.reason_for_adoption}
                  onChange={(e) => setFormData({ ...formData, reason_for_adoption: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  placeholder="Tell us about your motivation..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type of home
                </label>
                <select
                  value={formData.home_type}
                  onChange={(e) => setFormData({ ...formData, home_type: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                >
                  <option value="">Select...</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Condo">Condo</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Number of family members
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.num_family_members}
                  onChange={(e) => setFormData({ ...formData, num_family_members: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Do you have other pets?
                </label>
                <input
                  type="text"
                  value={formData.other_pets}
                  onChange={(e) => setFormData({ ...formData, other_pets: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="e.g., 2 cats, 1 dog"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Experience with pets
                </label>
                <textarea
                  value={formData.experience_with_pets}
                  onChange={(e) => setFormData({ ...formData, experience_with_pets: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  placeholder="Tell us about your pet experience..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Review Your Application</h3>
              
              <div className="space-y-3">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Why</p>
                  <p className="text-sm text-foreground">{formData.reason_for_adoption}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Home Type</p>
                    <p className="text-sm text-foreground font-medium">{formData.home_type}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Family Size</p>
                    <p className="text-sm text-foreground font-medium">{formData.num_family_members}</p>
                  </div>
                </div>

                {formData.other_pets && (
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Other Pets</p>
                    <p className="text-sm text-foreground">{formData.other_pets}</p>
                  </div>
                )}

                {formData.experience_with_pets && (
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Experience</p>
                    <p className="text-sm text-foreground">{formData.experience_with_pets}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="space-y-4 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-1">Application Submitted!</h3>
                <p className="text-sm text-muted-foreground">
                  Thank you for your interest in adopting {petName}. Our team will review your application and contact you within 2-3 business days.
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {step !== "success" && (
              <>
                {step !== "info" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (step === "questions") setStep("info")
                      else if (step === "review") setStep("questions")
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground",
                    !((step !== "info") && step !== "success") ? "" : ""
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : step === "info" ? (
                    "Continue"
                  ) : step === "questions" ? (
                    "Review"
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </>
            )}
            {step === "success" && (
              <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Close
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
