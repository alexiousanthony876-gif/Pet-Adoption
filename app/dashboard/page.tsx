"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import { 
  LogOut, 
  Heart,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  PawPrint,
  Calendar,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"

type AdoptionRequest = {
  id: string
  pet_id: string
  status: "Pending" | "In Review" | "Approved" | "Rejected" | "Completed"
  reason_for_adoption: string
  home_type: string
  num_family_members: number
  created_at: string
  rejected_reason?: string
}

type Pet = {
  id: string
  name: string
  image_url: string
  breed: string
}

type Appointment = {
  id: string
  adoption_request_id: string
  scheduled_date: string
  status: "Scheduled" | "Completed" | "Cancelled"
  notes?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const { user, loading } = useAuth()
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([])
  const [pets, setPets] = useState<Record<string, Pet>>({})
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"requests" | "appointments" | "profile">("requests")
  const [userName, setUserName] = useState("")

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
      // Load adoption requests
      const { data: requestsData } = await supabase
        .from("adoption_requests")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (requestsData) {
        setAdoptionRequests(requestsData)

        // Load pet data
        const petIds = [...new Set(requestsData.map(r => r.pet_id))]
        if (petIds.length > 0) {
          const { data: petsData } = await supabase
            .from("pets")
            .select("id, name, image_url, breed")
            .in("id", petIds)

          if (petsData) {
            const petsMap = petsData.reduce((acc, pet) => ({ ...acc, [pet.id]: pet }), {})
            setPets(petsMap)
          }
        }

        // Load appointments
        const { data: appointmentsData } = await supabase
          .from("appointments")
          .select("*")
          .in("adoption_request_id", requestsData.map(r => r.id))
          .order("scheduled_date", { ascending: true })

        if (appointmentsData) {
          setAppointments(appointmentsData)
        }
      }

      // Load user profile
      setUserName(user?.email || "User")
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "Rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "In Review":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "In Review":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Completed":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      default:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    }
  }

  if (loading || isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    )
  }

  if (!user) {
    return null
  }

  const upcomingAppointments = appointments.filter(a => 
    new Date(a.scheduled_date) > new Date() && a.status === "Scheduled"
  )

  const stats = [
    {
      label: "Total Applications",
      value: adoptionRequests.length,
      icon: FileText,
      color: "text-blue-500"
    },
    {
      label: "Approved",
      value: adoptionRequests.filter(r => r.status === "Approved").length,
      icon: CheckCircle2,
      color: "text-green-500"
    },
    {
      label: "Upcoming Visits",
      value: upcomingAppointments.length,
      icon: Calendar,
      color: "text-purple-500"
    },
    {
      label: "Under Review",
      value: adoptionRequests.filter(r => r.status === "In Review").length,
      icon: Clock,
      color: "text-yellow-500"
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-28 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-12">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-2">Welcome Back!</h1>
              <p className="text-lg text-muted-foreground">{userName}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="glass rounded-2xl p-6 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <Icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            {[
              { id: "requests", label: "My Applications", icon: FileText },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "profile", label: "Profile", icon: PawPrint },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              {adoptionRequests.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start by browsing available pets and submitting an adoption application.
                  </p>
                  <Link href="/pets">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Browse Pets
                    </Button>
                  </Link>
                </div>
              ) : (
                adoptionRequests.map((request) => {
                  const pet = pets[request.pet_id]
                  return (
                    <div key={request.id} className="glass rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-6 flex items-start gap-6">
                        {pet?.image_url ? (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                            <Image
                              src={pet.image_url}
                              alt={pet.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                            <PawPrint className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="text-2xl font-bold text-foreground">{pet?.name || "Unknown"}</h3>
                              <p className="text-sm text-muted-foreground">{pet?.breed}</p>
                            </div>
                            <span className={cn(
                              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border flex-shrink-0",
                              getStatusBg(request.status)
                            )}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">
                            Applied on {new Date(request.created_at).toLocaleDateString()}
                          </p>

                          <p className="text-sm text-foreground line-clamp-2 mb-4">
                            {request.reason_for_adoption}
                          </p>

                          {request.rejected_reason && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                              <p className="text-xs font-medium text-red-400 mb-1">Rejection Reason</p>
                              <p className="text-sm text-red-300">{request.rejected_reason}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-4 pt-4 border-t border-border">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Home: </span>
                              <span className="font-medium text-foreground">{request.home_type}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Family Size: </span>
                              <span className="font-medium text-foreground">{request.num_family_members}</span>
                            </div>
                          </div>
                        </div>

                        {request.status === "Approved" && (
                          <Link href={`/dashboard/appointment/${request.id}`}>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0">
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-6">
              {upcomingAppointments.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No upcoming appointments</h3>
                  <p className="text-muted-foreground">
                    Schedule a visit once your adoption application is approved.
                  </p>
                </div>
              ) : (
                upcomingAppointments.map((appointment) => {
                  const request = adoptionRequests.find(r => r.id === appointment.adoption_request_id)
                  const pet = request ? pets[request.pet_id] : null
                  return (
                    <div key={appointment.id} className="glass rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{pet?.name || "Unknown"}</h3>
                          <p className="text-sm text-muted-foreground">{pet?.breed}</p>
                        </div>
                        <span className={cn(
                          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border",
                          "bg-green-500/10 text-green-400 border-green-500/20"
                        )}>
                          <CheckCircle2 className="h-4 w-4" />
                          Scheduled
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Appointment Date</p>
                            <p className="font-medium text-foreground">
                              {new Date(appointment.scheduled_date).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="bg-secondary/50 rounded-lg p-4">
                            <p className="text-xs text-muted-foreground mb-2">Notes</p>
                            <p className="text-sm text-foreground">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-2xl">
              <div className="glass rounded-2xl border border-border p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Account Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                    <p className="text-lg font-medium text-foreground">{user.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                    <p className="text-lg font-medium text-foreground">
                      {new Date(user.created_at || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Account Actions</h3>
                  <div className="space-y-2">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
