"use client"

import { useEffect, useState } from "react"
import { 
  Search, 
  Mail, 
  Phone, 
  MapPin,
  MoreVertical,
  UserCheck,
  UserX,
  Eye,
  X,
  PawPrint,
  Calendar,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  getCustomers, 
  updateCustomerStatus, 
  getAdoptionRequests,
  Customer,
  AdoptionRequest 
} from "@/lib/admin-store"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [requests, setRequests] = useState<AdoptionRequest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  const loadData = () => {
    setCustomers(getCustomers())
    setRequests(getAdoptionRequests())
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || customer.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getCustomerRequests = (email: string) => {
    return requests.filter(r => r.email === email)
  }

  const handleStatusChange = (customerId: string, status: Customer["status"]) => {
    updateCustomerStatus(customerId, status)
    loadData()
    setShowActionMenu(null)
    setSuccessMessage(status === "suspended" ? "Customer has been suspended." : "Customer has been activated.")
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
        <h1 className="text-3xl font-bold text-white mb-2">Customer Management</h1>
        <p className="text-gray-400">View and manage registered users.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Total Customers</p>
          <p className="text-3xl font-bold text-white">{customers.length}</p>
        </div>
        <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-400">
            {customers.filter(c => c.status === "active").length}
          </p>
        </div>
        <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Suspended</p>
          <p className="text-3xl font-bold text-red-400">
            {customers.filter(c => c.status === "suspended").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#1a1a1f] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-[#1a1a1f] border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Customers Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => {
          const customerRequests = getCustomerRequests(customer.email)
          const approvedCount = customerRequests.filter(r => r.status === "approved").length
          
          return (
            <div
              key={customer.id}
              className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-white font-semibold text-lg">
                    {customer.firstName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      customer.status === "active" 
                        ? "bg-green-400/10 text-green-400" 
                        : "bg-red-400/10 text-red-400"
                    )}>
                      {customer.status}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowActionMenu(showActionMenu === customer.id ? null : customer.id)}
                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {showActionMenu === customer.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-[#252529] border border-white/10 rounded-xl overflow-hidden shadow-xl z-10">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                      {customer.status === "active" ? (
                        <button
                          onClick={() => handleStatusChange(customer.id, "suspended")}
                          className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
                        >
                          <UserX className="h-4 w-4" />
                          Suspend Account
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(customer.id, "active")}
                          className="w-full px-4 py-3 text-left text-sm text-green-400 hover:bg-white/5 flex items-center gap-2"
                        >
                          <UserCheck className="h-4 w-4" />
                          Activate Account
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-400 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{customer.email}</span>
                </p>
                <p className="text-gray-400 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {customer.phone}
                </p>
                <p className="text-gray-400 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {customer.city}, {customer.state}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <PawPrint className="h-4 w-4 text-primary" />
                  <span className="text-gray-400">
                    {approvedCount} adoption{approvedCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Joined {formatDate(customer.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">No customers found.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1f] border border-white/10 rounded-2xl">
            <div className="sticky top-0 bg-[#1a1a1f] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Customer Details</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl">
                  {selectedCustomer.firstName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </h3>
                  <span className={cn(
                    "text-sm px-3 py-1 rounded-full",
                    selectedCustomer.status === "active" 
                      ? "bg-green-400/10 text-green-400" 
                      : "bg-red-400/10 text-red-400"
                  )}>
                    {selectedCustomer.status}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </p>
                  <p className="text-white">{selectedCustomer.email}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Phone
                  </p>
                  <p className="text-white">{selectedCustomer.phone}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 sm:col-span-2">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Address
                  </p>
                  <p className="text-white">
                    {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state}, {selectedCustomer.country}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Member Since
                  </p>
                  <p className="text-white">{formatDate(selectedCustomer.createdAt)}</p>
                </div>
              </div>

              {/* Adoption History */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <PawPrint className="h-4 w-4" />
                  Adoption History
                </h4>
                {getCustomerRequests(selectedCustomer.email).length > 0 ? (
                  <div className="space-y-3">
                    {getCustomerRequests(selectedCustomer.email).map((request) => (
                      <div key={request.id} className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                        <img
                          src={request.petImage}
                          alt={request.petName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-white">{request.petName}</p>
                          <p className="text-xs text-gray-500">{request.petBreed}</p>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          request.status === "approved" && "bg-green-400/10 text-green-400",
                          request.status === "pending" && "bg-yellow-400/10 text-yellow-400",
                          request.status === "rejected" && "bg-red-400/10 text-red-400",
                          request.status === "info-requested" && "bg-blue-400/10 text-blue-400"
                        )}>
                          {request.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No adoption requests yet.</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button
                  onClick={() => window.location.href = `mailto:${selectedCustomer.email}`}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Customer
                </Button>
                {selectedCustomer.status === "active" ? (
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedCustomer.id, "suspended")
                      setSelectedCustomer(null)
                    }}
                    variant="destructive"
                    className="rounded-xl"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedCustomer.id, "active")
                      setSelectedCustomer(null)
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
