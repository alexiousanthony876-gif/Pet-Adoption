"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Dog, 
  FileText, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp,
  ArrowRight,
  PawPrint
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getStats, getAdoptionRequests, getActivityLogs, AdoptionRequest, ActivityLog } from "@/lib/admin-store"

interface StatCard {
  label: string
  value: number
  icon: React.ElementType
  color: string
  bgColor: string
  trend?: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPets: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedAdoptions: 0,
    rejectedRequests: 0,
    registeredUsers: 0,
    activeUsers: 0,
  })
  const [recentRequests, setRecentRequests] = useState<AdoptionRequest[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const statsData = getStats()
    setStats(statsData)
    
    const requests = getAdoptionRequests()
    setRecentRequests(requests.slice(0, 5))
    
    const activity = getActivityLogs()
    setRecentActivity(activity.slice(0, 5))
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statCards: StatCard[] = [
    {
      label: "Total Pets",
      value: stats.totalPets,
      icon: Dog,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      trend: "+2 this week",
    },
    {
      label: "Total Requests",
      value: stats.totalRequests,
      icon: FileText,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      trend: "+5 this week",
    },
    {
      label: "Pending Requests",
      value: stats.pendingRequests,
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      label: "Approved Adoptions",
      value: stats.approvedAdoptions,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      trend: "+1 this week",
    },
    {
      label: "Registered Users",
      value: stats.registeredUsers,
      icon: Users,
      color: "text-pink-400",
      bgColor: "bg-pink-400/10",
      trend: "+3 this week",
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      icon: TrendingUp,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
    },
  ]

  const getStatusBadge = (status: AdoptionRequest["status"]) => {
    const styles = {
      pending: "bg-yellow-400/10 text-yellow-400",
      approved: "bg-green-400/10 text-green-400",
      rejected: "bg-red-400/10 text-red-400",
      "info-requested": "bg-blue-400/10 text-blue-400",
    }
    const labels = {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      "info-requested": "Info Requested",
    }
    return (
      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", styles[status])}>
        {labels[status]}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back! Here is what is happening with your adoption platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              {stat.trend && (
                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Recent Adoption Requests</h2>
            <Link
              href="/admin/requests"
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentRequests.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No adoption requests yet
              </div>
            ) : (
              recentRequests.map((request) => (
                <div key={request.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={request.petImage}
                      alt={request.petName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {request.firstName} {request.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        wants to adopt <span className="text-gray-400">{request.petName}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(request.status)}
                      <span className="text-xs text-gray-500">{formatDate(request.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <Link
              href="/admin/activity"
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentActivity.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <PawPrint className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              recentActivity.map((log) => (
                <div key={log.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{log.action}</p>
                      <p className="text-xs text-gray-500 truncate">{log.details}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-primary/20 to-accent/20 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/pets"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Add New Pet
          </Link>
          <Link
            href="/admin/requests"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Review Pending Requests
          </Link>
          <Link
            href="/admin/customers"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Manage Customers
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
          >
            View Public Site
          </Link>
        </div>
      </div>
    </div>
  )
}
