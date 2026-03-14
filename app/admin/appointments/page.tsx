'use client'

import { useEffect, useState } from 'react'
import { Calendar, Clock, User, Plus, X, CheckCircle2, AlertCircle, Edit2, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Search } from 'lucide-react'

type Appointment = {
  id: string
  adoption_request_id: string
  scheduled_date: string
  status: 'Scheduled' | 'Completed' | 'Cancelled'
  notes?: string
}

type AdoptionRequest = {
  id: string
  pet_id: string
}

type Pet = {
  id: string
  name: string
}

export default function AppointmentsPage() {
  const supabase = createClient()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [pets, setPets] = useState<Record<string, Pet>>({})
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [isModalLoading, setIsModalLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .order('scheduled_date', { ascending: false })

      if (appointmentsData) {
        setAppointments(appointmentsData)

        // Load pet data
        const { data: requestsData } = await supabase
          .from('adoption_requests')
          .select('id, pet_id')
          .in('id', appointmentsData.map(a => a.adoption_request_id))

        if (requestsData) {
          const petIds = [...new Set(requestsData.map(r => r.pet_id))]
          const { data: petsData } = await supabase
            .from('pets')
            .select('id, name')
            .in('id', petIds)

          if (petsData) {
            const petsMap = petsData.reduce((acc, pet) => ({ ...acc, [pet.id]: pet }), {})
            setPets(petsMap)
          }
        }
      }
    } catch (err) {
      setError('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    setIsModalLoading(true)
    try {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId)

      if (updateError) {
        setError('Failed to update appointment')
      } else {
        setSuccess('Appointment updated successfully')
        await fetchAppointments()
        setSelectedAppointment(null)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setIsModalLoading(false)
    }
  }

  const handleDelete = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return

    setIsModalLoading(true)
    try {
      const { error: deleteError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId)

      if (deleteError) {
        setError('Failed to delete appointment')
      } else {
        setSuccess('Appointment deleted successfully')
        await fetchAppointments()
        setSelectedAppointment(null)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setIsModalLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'Completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'Cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const upcomingAppointments = appointments
    .filter(a => a.status === 'Scheduled')
    .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())

  const todayAppointments = appointments.filter(a => {
    const appointmentDate = new Date(a.scheduled_date).toISOString().split('T')[0]
    return appointmentDate === new Date().toISOString().split('T')[0] && a.status === 'Scheduled'
  })

  const filteredAppointments = appointments.filter(apt => {
    const petName = pets[appointments.find(a => a.id === apt.id)?.adoption_request_id]?.toString() || ''
    return petName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-[#0f0f12]">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Appointments</h1>
            <p className="text-gray-400">Manage customer visits and appointments</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-6 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by pet name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="mx-6 mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="p-6 grid lg:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Today's</p>
              <p className="text-2xl font-bold text-white">{todayAppointments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <User className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Total</p>
              <p className="text-2xl font-bold text-white">{appointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const request = appointments.find(a => a.id === appointment.id)
              const petName = "Pet" // Will be loaded
              const appointmentDate = new Date(appointment.scheduled_date)
              return (
                <div key={appointment.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">Appointment</h3>
                        <span className={cn('text-xs font-medium px-2 py-1 rounded-full border', getStatusColor(appointment.status))}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {appointmentDate.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-gray-300 line-clamp-1">{appointment.notes}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => setSelectedAppointment(appointment)}
                      className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedAppointment(null)} />
          <div className="relative w-full max-w-md bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Edit Appointment</h2>
              <button onClick={() => setSelectedAppointment(null)} className="p-2 text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Status</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                  <option>Scheduled</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-6 border-t border-white/10">
                <Button
                  onClick={() => handleStatusUpdate(selectedAppointment.id, 'Completed')}
                  disabled={isModalLoading}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isModalLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                  Update
                </Button>
                <Button
                  onClick={() => handleDelete(selectedAppointment.id)}
                  disabled={isModalLoading}
                  variant="outline"
                  className="px-4"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
