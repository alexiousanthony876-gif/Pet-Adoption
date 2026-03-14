"use client"

import { useEffect, useState } from "react"
import { 
  Search, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock,
  X,
  Loader2,
  AlertCircle,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

type AdoptionRequest = {
  id: string
  user_id: string
  pet_id: string
  status: "Pending" | "In Review" | "Approved" | "Rejected" | "Completed"
  reason_for_adoption: string
  home_type: string
  other_pets?: string
  num_family_members: number
  experience_with_pets: string
  approved_by?: string
  approved_at?: string
  rejected_reason?: string
  created_at: string
}

type Pet = {
  id: string
  name: string
}

type User = {
  id: string
  email: string
}

export default function AdoptionRequestsPage() {
  const supabase = createClient()
  const [requests, setRequests] = useState<AdoptionRequest[]>([])
  const [pets, setPets] = useState<Record<string, Pet>>({})
  const [users, setUsers] = useState<Record<string, User>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isModalLoading, setIsModalLoading] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load adoption requests
      const { data: requestsData } = await supabase
        .from("adoption_requests")
        .select("*")
        .order("created_at", { ascending: false })

      if (requestsData) {
        setRequests(requestsData)

        // Load pet and user data for all requests
        const petIds = [...new Set(requestsData.map(r => r.pet_id))]
        const userIds = [...new Set(requestsData.map(r => r.user_id))]

        if (petIds.length > 0) {
          const { data: petsData } = await supabase
            .from("pets")
            .select("id, name")
            .in("id", petIds)

          if (petsData) {
            const petsMap = petsData.reduce((acc, pet) => ({ ...acc, [pet.id]: pet }), {})
            setPets(petsMap)
          }
        }

        if (userIds.length > 0) {
          // Note: In a real app, you'd have a profiles table or fetch from auth
          // For now, we'll display user_id
          const usersMap = userIds.reduce((acc, id) => ({ ...acc, [id]: { id, email: "User" } }), {})
          setUsers(usersMap)
        }
      }
    } catch (err) {
      setError("Failed to load adoption requests")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    if (newStatus === "Rejected" && !rejectReason) {
      setError("Please provide a rejection reason")
      return
    }

    setIsModalLoading(true)
    setError("")

    try {
      const updateData: any = { status: newStatus }
      if (newStatus === "Approved") {
        updateData.approved_at = new Date().toISOString()
      }
      if (newStatus === "Rejected") {
        updateData.rejected_reason = rejectReason
      }

      const { error: updateError } = await supabase
        .from("adoption_requests")
        .update(updateData)
        .eq("id", requestId)

      if (updateError) {
        setError("Failed to update request")
      } else {
        setSuccess(`Request ${newStatus.toLowerCase()} successfully`)
        await loadData()
        setSelectedRequest(null)
        setRejectReason("")
        setTimeout(() => setSuccess(""), 3000)
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setIsModalLoading(false)
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      (pets[request.pet_id]?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    return matchesSearch && matchesStatus
  })

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
        return "bg-green-500/10 text-green-400"
      case "Rejected":
        return "bg-red-500/10 text-red-400"
      case "In Review":
        return "bg-blue-500/10 text-blue-400"
      default:
        return "bg-yellow-500/10 text-yellow-400"
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f12]">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Adoption Requests</h1>
            <p className="text-gray-400">Review and manage adoption applications</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 border-b border-white/10">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by pet name..."
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
            <option value="Pending">Pending</option>
            <option value="In Review">In Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
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
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Requests List */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No adoption requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">
                        {pets[request.pet_id]?.name || "Unknown Pet"}
                      </h3>
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1",
                        getStatusBg(request.status)
                      )}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      Submitted {new Date(request.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-300 line-clamp-2">{request.reason_for_adoption}</p>
                  </div>
                  <Button
                    onClick={() => setSelectedRequest(request)}
                    className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedRequest(null)} />
          <div className="relative w-full max-w-2xl bg-[#1a1a1f] border border-white/10 rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#1a1a1f] pb-4 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {pets[selectedRequest.pet_id]?.name} - Adoption Request
                </h2>
                <p className="text-sm text-gray-400">
                  Submitted {new Date(selectedRequest.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 mb-6">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Current Status */}
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2">Current Status</p>
                <span className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                  getStatusBg(selectedRequest.status)
                )}>
                  {getStatusIcon(selectedRequest.status)}
                  {selectedRequest.status}
                </span>
              </div>

              {/* Application Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Application Details</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Home Type</p>
                    <p className="text-white font-medium">{selectedRequest.home_type}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Family Size</p>
                    <p className="text-white font-medium">{selectedRequest.num_family_members}</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2">Why Adopt?</p>
                  <p className="text-gray-300 text-sm">{selectedRequest.reason_for_adoption}</p>
                </div>

                {selectedRequest.other_pets && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-2">Other Pets</p>
                    <p className="text-gray-300 text-sm">{selectedRequest.other_pets}</p>
                  </div>
                )}

                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2">Pet Experience</p>
                  <p className="text-gray-300 text-sm">{selectedRequest.experience_with_pets || "Not provided"}</p>
                </div>

                {selectedRequest.rejected_reason && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-xs text-red-400 mb-2">Rejection Reason</p>
                    <p className="text-red-300 text-sm">{selectedRequest.rejected_reason}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedRequest.status === "Pending" && (
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleStatusUpdate(selectedRequest.id, "In Review")}
                      disabled={isModalLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isModalLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Clock className="h-4 w-4 mr-2" />}
                      Move to Review
                    </Button>
                  </div>
                </div>
              )}

              {selectedRequest.status === "In Review" && (
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleStatusUpdate(selectedRequest.id, "Approved")}
                      disabled={isModalLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isModalLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        if (rejectReason) {
                          handleStatusUpdate(selectedRequest.id, "Rejected")
                        }
                      }}
                      disabled={isModalLoading || !rejectReason}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isModalLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                      Reject
                    </Button>
                  </div>
                  {true && (
                    <div>
                      <label className="block text-sm text-white mb-2">Rejection reason (if rejecting)</label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Explain why this application is being rejected..."
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:border-primary outline-none resize-none"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={() => setSelectedRequest(null)}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
