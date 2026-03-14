"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import { 
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react"

type AdoptionRequest = {
  id: string
  pet_id: string
  user_id: string
  status: string
}

type Pet = {
  id: string
  name: string
  breed: string
}

export default function AppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const supabase = createClient()
  const { user, loading } = useAuth()
  const { id } = use(params)

  const [request, setRequest] = useState<AdoptionRequest | null>(null)
  const [pet, setPet] = useState<Pet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: ""
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user) {
      loadData()
    }
  }, [user, loading])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load adoption request
      const { data: requestData } = await supabase
        .from("adoption_requests")
        .select("*")
        .eq("id", id)
        .eq("user_id", user?.id)
        .single()

      if (!requestData) {
        router.push("/dashboard")
        return
      }

      setRequest(requestData)

      // Load pet
      const { data: petData } = await supabase
        .from("pets")
        .select("id, name, breed")
        .eq("id", requestData.pet_id)
        .single()

      if (petData) {
        setPet(petData)
      }
    } catch (err) {
      setError("Failed to load appointment details")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.date || !formData.time) {
      setError("Please select both date and time")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const scheduledDateTime = new Date(`${formData.date}T${formData.time}`)
      
      if (scheduledDateTime < new Date()) {
        setError("Please select a future date and time")
        setIsSubmitting(false)
        return
      }

      const { error: insertError } = await supabase
        .from("appointments")
        .insert([
          {
            adoption_request_id: id,
            scheduled_date: scheduledDateTime.toISOString(),
            status: "Scheduled",
            notes: formData.notes || null
          }
        ])

      if (insertError) {
        setError("Failed to schedule appointment")
        console.error(insertError)
      } else {
        setSuccess("Appointment scheduled successfully!")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    )
  }

  if (!request || !pet) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <section className="pt-28 pb-24">
          <div className="container mx-auto px-4 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Request not found</h2>
            <p className="text-muted-foreground mb-6">The adoption request could not be found.</p>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-6 -ml-2 group">
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left side - Request Details */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Schedule a Visit</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Schedule your appointment to meet {pet.name}
              </p>

              <div className="glass rounded-2xl border border-border p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Pet</h3>
                  <p className="text-2xl font-bold text-foreground">{pet.name}</p>
                  <p className="text-muted-foreground">{pet.breed}</p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <p className="text-foreground">Choose your preferred date</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <p className="text-foreground">Select an available time slot</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Our team will send you a confirmation email with the details. Please arrive 10 minutes early.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                <div className="glass rounded-2xl border border-border p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Appointment Details</h2>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Select a date at least 3 days in advance for confirmation
                    </p>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Preferred Time *
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      required
                    >
                      <option value="">Select a time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="09:30">9:30 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="10:30">10:30 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="14:30">2:30 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="15:30">3:30 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="16:30">4:30 PM</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">
                      Available weekdays 9 AM - 5 PM
                    </p>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any special requests or information we should know?"
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-6 border-t border-border">
                    <Link href="/dashboard" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Scheduling...
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Appointment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
