"use client"

import { useEffect, useState } from "react"
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  PawPrint,
  Mail,
  CheckCheck,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  saveNotifications,
  Notification 
} from "@/lib/admin-store"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadNotifications()
  }, [])

  const loadNotifications = () => {
    const data = getNotifications()
    setNotifications(data)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true
    if (filter === "unread") return !notif.read
    return notif.type === filter
  })

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id)
    loadNotifications()
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
    loadNotifications()
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      saveNotifications([])
      loadNotifications()
    }
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "adoption_approved":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "adoption_rejected":
        return <XCircle className="h-5 w-5 text-red-400" />
      case "info_requested":
        return <AlertCircle className="h-5 w-5 text-blue-400" />
      case "new_request":
        return <Mail className="h-5 w-5 text-purple-400" />
      case "pet_added":
        return <PawPrint className="h-5 w-5 text-primary" />
      default:
        return <Bell className="h-5 w-5 text-gray-400" />
    }
  }

  const getBgColor = (type: Notification["type"]) => {
    switch (type) {
      case "adoption_approved":
        return "bg-green-400/10"
      case "adoption_rejected":
        return "bg-red-400/10"
      case "info_requested":
        return "bg-blue-400/10"
      case "new_request":
        return "bg-purple-400/10"
      case "pet_added":
        return "bg-primary/10"
      default:
        return "bg-gray-400/10"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-gray-400">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up!"
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleMarkAllAsRead}
            variant="ghost"
            className="text-gray-400 hover:text-white"
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
          <Button
            onClick={handleClearAll}
            variant="ghost"
            className="text-gray-400 hover:text-white"
            disabled={notifications.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear all
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: "all", label: "All" },
          { value: "unread", label: "Unread" },
          { value: "new_request", label: "New Requests" },
          { value: "adoption_approved", label: "Approved" },
          { value: "adoption_rejected", label: "Rejected" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-12 text-center">
            <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === "unread" 
                ? "You have no unread notifications."
                : "Notifications will appear here when there is activity."
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "bg-[#1a1a1f] border rounded-2xl p-5 transition-all hover:border-white/20",
                notification.read ? "border-white/10" : "border-primary/50"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn("p-3 rounded-xl", getBgColor(notification.type))}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={cn(
                        "font-medium",
                        notification.read ? "text-gray-300" : "text-white"
                      )}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                      {notification.recipientEmail && (
                        <p className="text-xs text-gray-500 mt-2">
                          Sent to: {notification.recipientName} ({notification.recipientEmail})
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-xs text-primary hover:text-primary/80 whitespace-nowrap"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Email Notification Info */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-400" />
          Email Notifications
        </h3>
        <p className="text-gray-400 text-sm">
          When you approve, reject, or request more information on an adoption request, 
          the system automatically sends an email notification to the applicant. All sent 
          notifications are logged here for your reference.
        </p>
      </div>
    </div>
  )
}
