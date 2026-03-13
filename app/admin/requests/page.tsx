"use client"

import { useEffect, useState } from "react"
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  X,
  Mail,
  Phone,
  MapPin,
  Home,
  PawPrint,
  Clock,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  getAdoptionRequests, 
  updateAdoptionRequestStatus, 
  AdoptionRequest 
} from "@/lib/admin-store"

export default function AdoptionRequestsPage() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    setMounted(true)
    loadRequests()
  }, [])

  const loadRequests = () => {
    const data = getAdoptionRequests()
    setRequests(data)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      `${request.firstName} ${request.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = (
    requestId: string, 
    status: AdoptionRequest["status"],
    adminNotes?: string
  ) => {
    updateAdoptionRequestStatus(requestId, status, adminNotes)
    loadRequests()
    
    const statusMessages = {
      approved: "Request has been approved! Notification sent to the applicant.",
      rejected: "Request has been rejected. Notification sent to the applicant.",
      "info-requested": "Additional information requested. Notification sent to the applicant.",
      pending: "Request status updated.",
    }
    
    setSuccessMessage(statusMessages[status])
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    setSelectedRequest(null)
  }

  const getStatusBadge = (status: AdoptionRequest["status"]) => {
    const styles = {
      pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
      approved: "bg-green-400/10 text-green-400 border-green-400/20",
      rejected: "bg-red-400/10 text-red-400 border-red-400/20",
      "info-requested": "bg-blue-400/10 text-blue-400 border-blue-400/20",
    }
    const labels = {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      "info-requested": "Info Requested",
    }
    return (
      <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", styles[status])}>
        {labels[status]}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
    "info-requested": requests.filter(r => r.status === "info-requested").length,
  }

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Adoption Requests</h1>
        <p className="text-gray-400">Review and manage adoption applications.</p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: "all", label: "All" },
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
          { value: "info-requested", label: "Info Requested" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filterStatus === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            )}
          >
            {tab.label}
            <span className="ml-2 opacity-60">({statusCounts[tab.value as keyof typeof statusCounts]})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, pet, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#1a1a1f] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Requests Table */}
      <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Applicant</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Pet</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                    No requests found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-white font-medium">
                          {request.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {request.firstName} {request.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{request.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={request.petImage}
                          alt={request.petName}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-white">{request.petName}</p>
                          <p className="text-xs text-gray-500">{request.petBreed}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400">{formatDate(request.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => setSelectedRequest(request)}
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button
                              onClick={() => handleStatusUpdate(request.id, "approved")}
                              size="sm"
                              className="bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleStatusUpdate(request.id, "rejected")}
                              size="sm"
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleStatusUpdate(request.id, "info-requested")}
                              size="sm"
                              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                            >
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedRequest(null)}
          />
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a1a1f] border border-white/10 rounded-2xl">
            <div className="sticky top-0 bg-[#1a1a1f] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-white">Request Details</h2>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Pet Info */}
              <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                <img
                  src={selectedRequest.petImage}
                  alt={selectedRequest.petName}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedRequest.petName}</h3>
                  <p className="text-sm text-gray-400">{selectedRequest.petBreed}</p>
                  <p className="text-xs text-gray-500 mt-1">Pet ID: {selectedRequest.petId}</p>
                </div>
              </div>

              {/* Applicant Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Applicant Information
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="text-white">{selectedRequest.firstName} {selectedRequest.lastName}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </p>
                    <p className="text-white">{selectedRequest.email}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </p>
                    <p className="text-white">{selectedRequest.phone}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Location
                    </p>
                    <p className="text-white">{selectedRequest.city}, {selectedRequest.state} {selectedRequest.zip}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 mt-4">
                  <p className="text-xs text-gray-500 mb-1">Full Address</p>
                  <p className="text-white">{selectedRequest.address}, {selectedRequest.city}, {selectedRequest.state} {selectedRequest.zip}, {selectedRequest.country}</p>
                </div>
              </div>

              {/* Living Situation */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Living Situation
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Housing Type</p>
                    <p className="text-white capitalize">{selectedRequest.housing}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Has Yard</p>
                    <p className="text-white capitalize">{selectedRequest.hasYard.replace("-", " ")}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Other Pets</p>
                    <p className="text-white capitalize">{selectedRequest.otherPets}</p>
                    {selectedRequest.otherPetsDetails && (
                      <p className="text-xs text-gray-400 mt-1">{selectedRequest.otherPetsDetails}</p>
                    )}
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Hours Alone Daily</p>
                    <p className="text-white">{selectedRequest.hoursAlone} hours</p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <PawPrint className="h-4 w-4" />
                  Pet Experience
                </h4>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Experience Level</p>
                  <p className="text-white capitalize">{selectedRequest.experience.replace("-", " ")}</p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Reason for Adoption</h4>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white">{selectedRequest.reason}</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Submitted</p>
                    <p className="text-white">{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                    <p className="text-white">{formatDate(selectedRequest.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedRequest.adminNotes && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <p className="text-xs text-yellow-400 mb-1">Admin Notes</p>
                  <p className="text-white">{selectedRequest.adminNotes}</p>
                </div>
              )}

              {/* Actions */}
              {selectedRequest.status === "pending" && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                  <Button
                    onClick={() => handleStatusUpdate(selectedRequest.id, "approved")}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedRequest.id, "rejected")}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedRequest.id, "info-requested")}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Request More Info
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
