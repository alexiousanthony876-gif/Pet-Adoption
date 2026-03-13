"use client"

import { useState } from "react"
import { X, CheckCircle2, PawPrint, Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Pet } from "@/components/pet-card"
import { addAdoptionRequest } from "@/lib/admin-store"

interface AdoptionModalProps {
  pet: Pet
  isOpen: boolean
  onClose: () => void
}

type FormStep = "info" | "questions" | "review" | "success"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  housing: string
  hasYard: string
  otherPets: string
  otherPetsDetails: string
  experience: string
  hoursAlone: string
  reason: string
  agreeToTerms: boolean
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  housing: "",
  hasYard: "",
  otherPets: "",
  otherPetsDetails: "",
  experience: "",
  hoursAlone: "",
  reason: "",
  agreeToTerms: false,
}

export function AdoptionModal({ pet, isOpen, onClose }: AdoptionModalProps) {
  const [step, setStep] = useState<FormStep>("info")
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Save to admin store
    addAdoptionRequest({
      id: `req-${Date.now()}`,
      petId: pet.id,
      petName: pet.name,
      petImage: pet.image,
      petBreed: pet.breed,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      country: "USA",
      housing: formData.housing,
      hasYard: formData.hasYard,
      otherPets: formData.otherPets,
      otherPetsDetails: formData.otherPetsDetails,
      experience: formData.experience,
      hoursAlone: formData.hoursAlone,
      reason: formData.reason,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    
    setIsSubmitting(false)
    setStep("success")
  }

  const handleClose = () => {
    setStep("info")
    setFormData(initialFormData)
    onClose()
  }

  const InputField = ({ 
    label, 
    field, 
    type = "text", 
    placeholder,
    required = true,
    className,
  }: { 
    label: string
    field: keyof FormData
    type?: string
    placeholder?: string
    required?: boolean
    className?: string
  }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground/80 mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        value={formData[field] as string}
        onChange={(e) => updateField(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors"
        required={required}
      />
    </div>
  )

  const SelectField = ({
    label,
    field,
    options,
    required = true,
    className,
  }: {
    label: string
    field: keyof FormData
    options: { value: string; label: string }[]
    required?: boolean
    className?: string
  }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground/80 mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <select
        value={formData[field] as string}
        onChange={(e) => updateField(field, e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
        required={required}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )

  const renderStep = () => {
    switch (step) {
      case "info":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Your Information</h3>
              <p className="text-muted-foreground">Tell us about yourself so we can process your adoption request.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <InputField label="First Name" field="firstName" placeholder="John" />
              <InputField label="Last Name" field="lastName" placeholder="Doe" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <InputField label="Email" field="email" type="email" placeholder="john@example.com" />
              <InputField label="Phone" field="phone" type="tel" placeholder="(555) 123-4567" />
            </div>
            
            <InputField label="Street Address" field="address" placeholder="123 Main Street" />
            
            <div className="grid md:grid-cols-3 gap-4">
              <InputField label="City" field="city" placeholder="San Francisco" />
              <InputField label="State" field="state" placeholder="CA" />
              <InputField label="ZIP Code" field="zip" placeholder="94102" />
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                onClick={() => setStep("questions")}
              >
                Continue
              </Button>
            </div>
          </div>
        )

      case "questions":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">About Your Home</h3>
              <p className="text-muted-foreground">Help us ensure {pet.name} will be a good fit for your lifestyle.</p>
            </div>
            
            <SelectField 
              label="Housing Type" 
              field="housing" 
              options={[
                { value: "house", label: "House" },
                { value: "apartment", label: "Apartment" },
                { value: "condo", label: "Condo" },
                { value: "townhouse", label: "Townhouse" },
              ]}
            />
            
            <SelectField 
              label="Do you have a yard?" 
              field="hasYard" 
              options={[
                { value: "yes-fenced", label: "Yes, fenced" },
                { value: "yes-unfenced", label: "Yes, not fenced" },
                { value: "no", label: "No yard" },
              ]}
            />
            
            <SelectField 
              label="Do you have other pets?" 
              field="otherPets" 
              options={[
                { value: "no", label: "No other pets" },
                { value: "dogs", label: "Dogs" },
                { value: "cats", label: "Cats" },
                { value: "both", label: "Both dogs and cats" },
                { value: "other", label: "Other pets" },
              ]}
            />
            
            {formData.otherPets && formData.otherPets !== "no" && (
              <InputField 
                label="Please describe your other pets" 
                field="otherPetsDetails" 
                placeholder="Breed, age, temperament..."
                required={false}
              />
            )}
            
            <SelectField 
              label="Pet ownership experience" 
              field="experience" 
              options={[
                { value: "first-time", label: "First-time pet owner" },
                { value: "some", label: "Some experience" },
                { value: "experienced", label: "Experienced pet owner" },
              ]}
            />
            
            <SelectField 
              label="How many hours will the pet be alone daily?" 
              field="hoursAlone" 
              options={[
                { value: "0-2", label: "0-2 hours" },
                { value: "2-4", label: "2-4 hours" },
                { value: "4-6", label: "4-6 hours" },
                { value: "6-8", label: "6-8 hours" },
                { value: "8+", label: "8+ hours" },
              ]}
            />
            
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Why do you want to adopt {pet.name}? <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => updateField("reason", e.target.value)}
                placeholder="Tell us why you'd like to adopt this pet..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors min-h-[120px] resize-none"
                required
              />
            </div>
            
            <div className="flex justify-between gap-4 pt-4">
              <Button variant="ghost" onClick={() => setStep("info")}>
                Back
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                onClick={() => setStep("review")}
              >
                Review Application
              </Button>
            </div>
          </div>
        )

      case "review":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Review Your Application</h3>
              <p className="text-muted-foreground">Please review your information before submitting.</p>
            </div>
            
            {/* Pet summary */}
            <div className="glass rounded-2xl p-4 flex items-center gap-4">
              <img 
                src={pet.image} 
                alt={pet.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-semibold text-foreground">{pet.name}</h4>
                <p className="text-sm text-muted-foreground">{pet.breed} | {pet.age}</p>
              </div>
            </div>
            
            {/* Application summary */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium text-foreground">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium text-foreground">{formData.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium text-foreground">{formData.phone}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Housing:</span>
                  <p className="font-medium text-foreground capitalize">{formData.housing}</p>
                </div>
              </div>
            </div>
            
            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => updateField("agreeToTerms", e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">
                I agree to the adoption terms and conditions. I understand that submitting this 
                application does not guarantee adoption, and the shelter will contact me to schedule 
                a meeting with {pet.name}.
              </span>
            </label>
            
            <div className="flex justify-between gap-4 pt-4">
              <Button variant="ghost" onClick={() => setStep("questions")}>
                Back
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                onClick={handleSubmit}
                disabled={!formData.agreeToTerms || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </div>
        )

      case "success":
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Thank you for your interest in adopting {pet.name}! We have received your application 
              and will review it shortly. Expect to hear from us within 2-3 business days.
            </p>
            <div className="glass rounded-2xl p-6 mb-8 inline-block">
              <p className="text-sm text-muted-foreground mb-1">Application Reference</p>
              <p className="text-xl font-mono font-bold text-primary">
                PAW-{Date.now().toString(36).toUpperCase()}
              </p>
            </div>
            <div>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                onClick={handleClose}
              >
                Done
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-3xl p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <PawPrint className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Adopt {pet.name}</span>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Progress */}
        {step !== "success" && (
          <div className="flex gap-2 mb-8">
            {["info", "questions", "review"].map((s, i) => (
              <div
                key={s}
                className={cn(
                  "flex-1 h-2 rounded-full transition-colors",
                  ["info", "questions", "review"].indexOf(step) >= i
                    ? "bg-primary"
                    : "bg-secondary"
                )}
              />
            ))}
          </div>
        )}
        
        {renderStep()}
      </div>
    </div>
  )
}
