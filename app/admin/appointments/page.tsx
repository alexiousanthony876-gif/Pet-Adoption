'use client'

import { useEffect, useState } from 'react'
import { Calendar, Clock, User, Plus, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Appointment {
  id: string
  pet_id: string
  pet_name: string
  user_name: string
  user_email: string
  appointment_date: string
  appointment_time: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes: string
  created_at: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (err) {
      setError('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-400'
      case 'completed':
        return 'bg-green-500/10 text-green-400'
      case 'cancelled':
        return 'bg-red-500/10 text-red-400'
      default:
        return 'bg-gray-500/10 text-gray-400'
    }
  }

  const upcomingAppointments = appointments
    .filter(a => a.status === 'scheduled')
    .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())

  const todayAppointments = appointments.filter(a => {
    const appointmentDate = new Date(a.appointment_date).toISOString().split('T')[0]
    return appointmentDate === new Date().toISOString().split('T')[0] && a.status === 'scheduled'
  })

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Appointment Management</h1>
          <p className="text-gray-400">Schedule and manage adoption appointments</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Appointments */}
        <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Today's Appointments</p>
              <p className="text-2xl font-bold text-white">{todayAppointments.length}</p>
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Upcoming</p>
              <p className="text-2xl font-bold text-white">{upcomingAppointments.length}</p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <User className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Appointments</p>
              <p className="text-2xl font-bold text-white">{appointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-500/50 mx-auto mb-4" />
            <p className="text-gray-400">No appointments scheduled yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{appointment.pet_name}</h3>
                      <span className={cn('px-3 py-1 rounded-full text-xs font-medium', getStatusColor(appointment.status))}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{appointment.user_name}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {appointment.appointment_time}
                      </div>
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-gray-500 mt-3">{appointment.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
