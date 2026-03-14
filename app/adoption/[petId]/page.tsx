'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

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
  hasYard: boolean
  otherPets: string
  otherPetsDetails: string
  hoursAlone: number
  experience: string
  reason: string
  references: string
}

export default function AdoptionFormPage({ params }: { params: { petId: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    housing: 'apartment',
    hasYard: false,
    otherPets: 'no',
    otherPetsDetails: '',
    hoursAlone: 0,
    experience: 'beginner',
    reason: '',
    references: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/adoption-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pet_id: params.petId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit adoption request')
      }

      setSubmitted(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Application Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your adoption application. We'll review it and contact you within 24 hours.
            </p>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90">View My Applications</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-12 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto px-4">
          <Link href={`/pets/${params.petId}`} className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to pet
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Adoption Application</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Please fill out this form to apply for adoption. We'll review your application and contact you shortly.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="glass rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary outline-none"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary outline-none"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary outline-none"
                    />
                    <input
                      type="text"
                      name="zip"
                      placeholder="ZIP"
                      value={formData.zip}
                      onChange={handleChange}
                      required
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Living Situation */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Living Situation</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Housing Type *</label>
                    <select
                      name="housing"
                      value={formData.housing}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:border-primary outline-none"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="condo">Condo</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="hasYard"
                      checked={formData.hasYard}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground">Do you have a yard?</span>
                  </label>
                </div>
              </div>

              {/* Pets */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Other Pets</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Do you have other pets? *</label>
                    <select
                      name="otherPets"
                      value={formData.otherPets}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:border-primary outline-none"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  {formData.otherPets === 'yes' && (
                    <textarea
                      name="otherPetsDetails"
                      placeholder="Please describe your other pets..."
                      value={formData.otherPetsDetails}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary outline-none resize-none"
                      rows={3}
                    />
                  )}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Pet Experience</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Experience Level *</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:border-primary outline-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="experienced">Experienced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Hours Pet Will Be Alone Daily *</label>
                    <input
                      type="number"
                      name="hoursAlone"
                      value={formData.hoursAlone}
                      onChange={handleChange}
                      min="0"
                      max="24"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Why Adopt */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Why do you want to adopt this pet? *</label>
                <textarea
                  name="reason"
                  placeholder="Tell us about yourself and why you want to adopt..."
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary outline-none resize-none"
                  rows={4}
                />
              </div>

              {/* References */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">References (optional)</label>
                <textarea
                  name="references"
                  placeholder="Veterinarian or personal references..."
                  value={formData.references}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary outline-none resize-none"
                  rows={3}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
