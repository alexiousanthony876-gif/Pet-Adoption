"use client"

import { useEffect, useState } from "react"
import { 
  Activity, 
  Search,
  Filter,
  Calendar,
  User,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getActivityLogs, ActivityLog } from "@/lib/admin-store"

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState<string>("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const data = getActivityLogs()
    setLogs(data)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const actionTypes = [...new Set(logs.map(l => l.action))]

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = filterAction === "all" || log.action === filterAction
    return matchesSearch && matchesAction
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getActionColor = (action: string) => {
    if (action.includes("Approved")) return "text-green-400 bg-green-400/10"
    if (action.includes("Rejected")) return "text-red-400 bg-red-400/10"
    if (action.includes("Added") || action.includes("Login")) return "text-blue-400 bg-blue-400/10"
    if (action.includes("Removed") || action.includes("Suspended")) return "text-orange-400 bg-orange-400/10"
    if (action.includes("Updated")) return "text-purple-400 bg-purple-400/10"
    return "text-gray-400 bg-gray-400/10"
  }

  // Group logs by date
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    const date = new Date(log.createdAt).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(log)
    return acc
  }, {} as Record<string, ActivityLog[]>)

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Activity Logs</h1>
        <p className="text-gray-400">Track all administrative actions and system events.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search activity logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#1a1a1f] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-3 bg-[#1a1a1f] border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors cursor-pointer"
        >
          <option value="all">All Actions</option>
          {actionTypes.map((action) => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      {Object.keys(groupedLogs).length === 0 ? (
        <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-12 text-center">
          <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No activity yet</h3>
          <p className="text-gray-500">
            Activity logs will appear here as actions are performed in the admin panel.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-400">{date}</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              
              <div className="space-y-3">
                {dateLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-[#1a1a1f] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap",
                        getActionColor(log.action)
                      )}>
                        {log.action}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">{log.details}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.adminName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(log.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          About Activity Logs
        </h3>
        <p className="text-gray-400 text-sm">
          Activity logs track all important actions performed in the admin panel, including 
          pet management, adoption request approvals/rejections, customer status changes, 
          and admin login/logout events. Logs are kept for the last 100 entries.
        </p>
      </div>
    </div>
  )
}
