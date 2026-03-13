"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  User, Mail, Phone, MapPin, FileText, Bell, Heart, Settings, LogOut,
  Clock, CheckCircle2, XCircle, AlertCircle, PawPrint, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { 
  getUserAuth, 
  logoutUser, 
  getUserAdoptionRequests, 
  getUserNotifications,
  type User as UserType,
  type AdoptionRequest,
  type Notification
} from "@/lib/admin-store"

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [requests, setRequests] = useState<AdoptionRequest[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authUser = getUserAuth()
    if (!authUser) {
      router.push("/login")
      return
    }
    setUser(authUser)
    setRequests(getUserAdoptionRequests(authUser.email))
    setNotifications(getUserNotifications(authUser.email))
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    logoutUser()
    router.push("/")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "info-requested":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      case "info-requested":
        return "Info Requested"
      default:
        return "Pending"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      case "info-requested":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  const pendingCount = requests.filter(r => r.status === "pending").length
  const approvedCount = requests.filter(r => r.status === "approved").length
  const unreadNotifications = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-28">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: "overview", label: "Overview", icon: PawPrint },
                    { id: "applications", label: "My Applications", icon: FileText, badge: pendingCount },
                    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadNotifications },
                    { id: "favorites", label: "Favorites", icon: Heart },
                    { id: "settings", label: "Settings", icon: Settings },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        activeTab === item.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </span>
                      {item.badge ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          activeTab === item.id 
                            ? "bg-primary-foreground/20 text-primary-foreground" 
                            : "bg-primary/10 text-primary"
                        }`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.firstName}!</h1>
                  
                  {/* Stats */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{requests.length}</p>
                          <p className="text-sm text-muted-foreground">Total Applications</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                          <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                          <p className="text-sm text-muted-foreground">Pending</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
                          <p className="text-sm text-muted-foreground">Approved</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Applications */}
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-foreground">Recent Applications</h2>
                      <button 
                        onClick={() => setActiveTab("applications")}
                        className="text-primary hover:underline text-sm"
                      >
                        View All
                      </button>
                    </div>
                    {requests.length === 0 ? (
                      <div className="text-center py-12">
                        <PawPrint className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">You have not submitted any adoption applications yet.</p>
                        <Link href="/pets">
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Browse Pets
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {requests.slice(0, 3).map((request) => (
                          <div key={request.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                              <Image
                                src={request.petImage}
                                alt={request.petName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground">{request.petName}</h3>
                              <p className="text-sm text-muted-foreground">{request.petBreed}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(request.status)}`}>
                              {getStatusLabel(request.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Link href="/pets" className="flex items-center gap-4 p-4 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all group">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <PawPrint className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">Browse Pets</h3>
                          <p className="text-sm text-muted-foreground">Find your perfect companion</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                      <Link href="/contact" className="flex items-center gap-4 p-4 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all group">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">Contact Support</h3>
                          <p className="text-sm text-muted-foreground">Get help with your application</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Applications Tab */}
              {activeTab === "applications" && (
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
                  
                  {requests.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                      <PawPrint className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h2 className="text-xl font-bold text-foreground mb-2">No Applications Yet</h2>
                      <p className="text-muted-foreground mb-6">Start your adoption journey today!</p>
                      <Link href="/pets">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          Browse Available Pets
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((request) => (
                        <div key={request.id} className="glass rounded-2xl p-6">
                          <div className="flex flex-col sm:flex-row gap-6">
                            <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                              <Image
                                src={request.petImage}
                                alt={request.petName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                  <h3 className="text-xl font-bold text-foreground">{request.petName}</h3>
                                  <p className="text-muted-foreground">{request.petBreed}</p>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusBg(request.status)}`}>
                                  {getStatusIcon(request.status)}
                                  <span className="text-sm font-medium">{getStatusLabel(request.status)}</span>
                                </div>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Applied:</span>{" "}
                                  <span className="text-foreground">{new Date(request.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Last Updated:</span>{" "}
                                  <span className="text-foreground">{new Date(request.updatedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              {request.status === "approved" && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                                  <p className="text-green-700 text-sm">
                                    Congratulations! Your adoption request has been approved. Our team will contact you shortly for the next steps.
                                  </p>
                                </div>
                              )}
                              {request.status === "rejected" && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                  <p className="text-red-700 text-sm">
                                    We appreciate your interest in adopting. Unfortunately, your request could not be approved at this time.
                                  </p>
                                </div>
                              )}
                              {request.status === "info-requested" && (
                                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                  <p className="text-yellow-700 text-sm">
                                    Additional information is required. Please check your email or contact us for details.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
                  
                  {notifications.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                      <Bell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h2 className="text-xl font-bold text-foreground mb-2">No Notifications</h2>
                      <p className="text-muted-foreground">You will receive notifications about your adoption applications here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`glass rounded-2xl p-6 ${!notification.read ? "border-l-4 border-primary" : ""}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              notification.type === "adoption_approved" ? "bg-green-100" :
                              notification.type === "adoption_rejected" ? "bg-red-100" :
                              "bg-blue-100"
                            }`}>
                              {notification.type === "adoption_approved" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : notification.type === "adoption_rejected" ? (
                                <XCircle className="h-5 w-5 text-red-600" />
                              ) : (
                                <Bell className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{notification.title}</h3>
                              <p className="text-muted-foreground text-sm mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === "favorites" && (
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold text-foreground">Favorites</h1>
                  <div className="glass rounded-2xl p-12 text-center">
                    <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">No Favorites Yet</h2>
                    <p className="text-muted-foreground mb-6">Save your favorite pets here for easy access.</p>
                    <Link href="/pets">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Browse Pets
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                  
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-foreground mb-6">Profile Information</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">First Name</label>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <span className="text-foreground">{user.firstName}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Last Name</label>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <span className="text-foreground">{user.lastName}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <span className="text-foreground">{user.email}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Phone</label>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <span className="text-foreground">{user.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">Address</label>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <span className="text-foreground">
                            {user.address}, {user.city}, {user.state}, {user.country}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
