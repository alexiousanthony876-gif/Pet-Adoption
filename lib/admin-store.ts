"use client"

import { Pet } from "@/components/pet-card"
import { pets as initialPets } from "@/lib/pets-data"

// Types
export interface AdoptionRequest {
  id: string
  petId: string
  petName: string
  petImage: string
  petBreed: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  housing: string
  hasYard: string
  otherPets: string
  otherPetsDetails: string
  experience: string
  hoursAlone: string
  reason: string
  status: "pending" | "approved" | "rejected" | "info-requested"
  createdAt: string
  updatedAt: string
  adminNotes?: string
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  createdAt: string
  adoptionHistory: string[]
  status: "active" | "suspended"
}

export interface Notification {
  id: string
  type: "adoption_approved" | "adoption_rejected" | "info_requested" | "new_request" | "pet_added"
  title: string
  message: string
  recipientEmail?: string
  recipientName?: string
  createdAt: string
  read: boolean
}

export interface ActivityLog {
  id: string
  action: string
  details: string
  adminId: string
  adminName: string
  createdAt: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin" | "superadmin"
  createdAt?: string
  createdBy?: string
  status?: "active" | "suspended"
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  occupation: string
  password: string
  createdAt: string
  status: "active" | "suspended"
}

export interface Shelter {
  id: string
  name: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  email: string
  managerId: string
  managerName: string
  petsCount: number
  status: "active" | "inactive"
  createdAt: string
}

// Storage keys
const STORAGE_KEYS = {
  PETS: "pawternity_pets",
  REQUESTS: "pawternity_requests",
  CUSTOMERS: "pawternity_customers",
  NOTIFICATIONS: "pawternity_notifications",
  ACTIVITY_LOGS: "pawternity_activity_logs",
  ADMIN_AUTH: "pawternity_admin_auth",
  USER_AUTH: "pawternity_user_auth",
  USERS: "pawternity_users",
  ADMINS: "pawternity_admins",
  SHELTERS: "pawternity_shelters",
}

// Initialize storage with default data
function initializeStorage() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(STORAGE_KEYS.PETS)) {
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(initialPets))
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(getSampleRequests()))
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(getSampleCustomers()))
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(getSampleUsers()))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADMINS)) {
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(getDefaultAdmins()))
  }
  if (!localStorage.getItem(STORAGE_KEYS.SHELTERS)) {
    localStorage.setItem(STORAGE_KEYS.SHELTERS, JSON.stringify(getSampleShelters()))
  }
}

// Sample data generators
function getSampleRequests(): AdoptionRequest[] {
  return [
    {
      id: "req-1",
      petId: "1",
      petName: "Buddy",
      petImage: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop",
      petBreed: "Golden Retriever",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 234-5678",
      address: "456 Oak Street",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "USA",
      housing: "house",
      hasYard: "yes-fenced",
      otherPets: "dogs",
      otherPetsDetails: "One friendly 3-year-old Labrador",
      experience: "experienced",
      hoursAlone: "2-4",
      reason: "We recently lost our beloved dog and are ready to welcome another furry friend into our family. Buddy seems like the perfect companion for our active lifestyle.",
      status: "pending",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "req-2",
      petId: "2",
      petName: "Luna",
      petImage: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop",
      petBreed: "British Shorthair",
      firstName: "Michael",
      lastName: "Chen",
      email: "m.chen@email.com",
      phone: "(555) 345-6789",
      address: "789 Pine Avenue, Apt 12",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
      housing: "apartment",
      hasYard: "no",
      otherPets: "no",
      otherPetsDetails: "",
      experience: "some",
      hoursAlone: "6-8",
      reason: "I work from home and would love a calm companion. Luna's description matches exactly what I'm looking for in a cat.",
      status: "approved",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "req-3",
      petId: "5",
      petName: "Bella",
      petImage: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop",
      petBreed: "French Bulldog",
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.d@email.com",
      phone: "(555) 456-7890",
      address: "321 Maple Drive",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "USA",
      housing: "condo",
      hasYard: "yes-unfenced",
      otherPets: "cats",
      otherPetsDetails: "One indoor cat, very social",
      experience: "experienced",
      hoursAlone: "4-6",
      reason: "French Bulldogs are my favorite breed! Bella looks absolutely adorable and I have experience with the breed's specific needs.",
      status: "pending",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "req-4",
      petId: "3",
      petName: "Max",
      petImage: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&h=600&fit=crop",
      petBreed: "German Shepherd",
      firstName: "James",
      lastName: "Wilson",
      email: "j.wilson@email.com",
      phone: "(555) 567-8901",
      address: "555 Cedar Lane",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA",
      housing: "house",
      hasYard: "yes-fenced",
      otherPets: "no",
      otherPetsDetails: "",
      experience: "first-time",
      hoursAlone: "8+",
      reason: "I've always wanted a German Shepherd. Max looks like a great dog.",
      status: "rejected",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      adminNotes: "Applicant works long hours and is a first-time owner. German Shepherd not suitable for this situation.",
    },
  ]
}

function getSampleCustomers(): Customer[] {
  return [
    {
      id: "cust-1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 234-5678",
      address: "456 Oak Street",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      adoptionHistory: [],
      status: "active",
    },
    {
      id: "cust-2",
      firstName: "Michael",
      lastName: "Chen",
      email: "m.chen@email.com",
      phone: "(555) 345-6789",
      address: "789 Pine Avenue, Apt 12",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      adoptionHistory: ["2"],
      status: "active",
    },
    {
      id: "cust-3",
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.d@email.com",
      phone: "(555) 456-7890",
      address: "321 Maple Drive",
      city: "Austin",
      state: "TX",
      country: "USA",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      adoptionHistory: [],
      status: "active",
    },
    {
      id: "cust-4",
      firstName: "James",
      lastName: "Wilson",
      email: "j.wilson@email.com",
      phone: "(555) 567-8901",
      address: "555 Cedar Lane",
      city: "Seattle",
      state: "WA",
      country: "USA",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      adoptionHistory: [],
      status: "active",
    },
  ]
}

function getSampleUsers(): User[] {
  return [
    {
      id: "user-1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      phone: "(555) 234-5678",
      address: "456 Oak Street",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      occupation: "Software Engineer",
      password: "password123",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    },
    {
      id: "user-2",
      firstName: "Michael",
      lastName: "Chen",
      email: "michael@example.com",
      phone: "(555) 345-6789",
      address: "789 Pine Avenue",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      occupation: "Marketing Manager",
      password: "password123",
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    },
  ]
}

function getDefaultAdmins(): AdminUser[] {
  return [
    {
      id: "admin-1",
      email: "admin@pawternity.com",
      name: "Admin User",
      role: "admin",
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    },
    {
      id: "superadmin-1",
      email: "superadmin@pawternity.com",
      name: "Super Admin",
      role: "superadmin",
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    },
  ]
}

function getSampleShelters(): Shelter[] {
  return [
    {
      id: "shelter-1",
      name: "Happy Paws Shelter",
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      phone: "(555) 111-2222",
      email: "info@happypaws.com",
      managerId: "admin-1",
      managerName: "Admin User",
      petsCount: 25,
      status: "active",
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "shelter-2",
      name: "Furry Friends Rescue",
      address: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      phone: "(555) 333-4444",
      email: "contact@furryfriends.org",
      managerId: "admin-1",
      managerName: "Admin User",
      petsCount: 18,
      status: "active",
      createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "shelter-3",
      name: "Second Chance Animals",
      address: "789 Elm Street",
      city: "Austin",
      state: "TX",
      country: "USA",
      phone: "(555) 555-6666",
      email: "help@secondchance.org",
      managerId: "superadmin-1",
      managerName: "Super Admin",
      petsCount: 32,
      status: "active",
      createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

// Storage functions
export function getPets(): Pet[] {
  if (typeof window === "undefined") return initialPets
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.PETS)
  return data ? JSON.parse(data) : initialPets
}

export function savePets(pets: Pet[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets))
}

export function addPet(pet: Pet) {
  const pets = getPets()
  pets.push(pet)
  savePets(pets)
  addActivityLog("Pet Added", `Added new pet: ${pet.name} (${pet.breed})`)
}

export function updatePet(updatedPet: Pet) {
  const pets = getPets()
  const index = pets.findIndex(p => p.id === updatedPet.id)
  if (index !== -1) {
    pets[index] = updatedPet
    savePets(pets)
    addActivityLog("Pet Updated", `Updated pet: ${updatedPet.name}`)
  }
}

export function deletePet(petId: string) {
  const pets = getPets()
  const pet = pets.find(p => p.id === petId)
  const filtered = pets.filter(p => p.id !== petId)
  savePets(filtered)
  if (pet) {
    addActivityLog("Pet Removed", `Removed pet: ${pet.name}`)
  }
}

export function getAdoptionRequests(): AdoptionRequest[] {
  if (typeof window === "undefined") return []
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.REQUESTS)
  return data ? JSON.parse(data) : []
}

export function saveAdoptionRequests(requests: AdoptionRequest[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests))
}

export function addAdoptionRequest(request: AdoptionRequest) {
  const requests = getAdoptionRequests()
  requests.unshift(request)
  saveAdoptionRequests(requests)
  
  // Add notification
  addNotification({
    type: "new_request",
    title: "New Adoption Request",
    message: `${request.firstName} ${request.lastName} submitted an adoption request for ${request.petName}`,
  })
}

export function updateAdoptionRequestStatus(
  requestId: string, 
  status: AdoptionRequest["status"],
  adminNotes?: string
) {
  const requests = getAdoptionRequests()
  const index = requests.findIndex(r => r.id === requestId)
  if (index !== -1) {
    requests[index].status = status
    requests[index].updatedAt = new Date().toISOString()
    if (adminNotes) {
      requests[index].adminNotes = adminNotes
    }
    saveAdoptionRequests(requests)
    
    const request = requests[index]
    
    // Add notification based on status
    if (status === "approved") {
      addNotification({
        type: "adoption_approved",
        title: "Adoption Approved",
        message: `Congratulations! Your adoption request for ${request.petName} has been approved. Our team will contact you shortly for the next steps.`,
        recipientEmail: request.email,
        recipientName: `${request.firstName} ${request.lastName}`,
      })
      addActivityLog("Request Approved", `Approved adoption request from ${request.firstName} ${request.lastName} for ${request.petName}`)
    } else if (status === "rejected") {
      addNotification({
        type: "adoption_rejected",
        title: "Adoption Request Update",
        message: `Thank you for your interest in adopting ${request.petName}. Unfortunately, your request could not be approved at this time.`,
        recipientEmail: request.email,
        recipientName: `${request.firstName} ${request.lastName}`,
      })
      addActivityLog("Request Rejected", `Rejected adoption request from ${request.firstName} ${request.lastName} for ${request.petName}`)
    } else if (status === "info-requested") {
      addNotification({
        type: "info_requested",
        title: "Additional Information Required",
        message: `We need additional information regarding your adoption request for ${request.petName}. Please check your email or contact us.`,
        recipientEmail: request.email,
        recipientName: `${request.firstName} ${request.lastName}`,
      })
      addActivityLog("Info Requested", `Requested more information from ${request.firstName} ${request.lastName} for ${request.petName}`)
    }
  }
}

export function getCustomers(): Customer[] {
  if (typeof window === "undefined") return []
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS)
  return data ? JSON.parse(data) : []
}

export function saveCustomers(customers: Customer[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers))
}

export function updateCustomerStatus(customerId: string, status: Customer["status"]) {
  const customers = getCustomers()
  const index = customers.findIndex(c => c.id === customerId)
  if (index !== -1) {
    customers[index].status = status
    saveCustomers(customers)
    addActivityLog(
      status === "suspended" ? "Customer Suspended" : "Customer Activated",
      `${status === "suspended" ? "Suspended" : "Activated"} customer: ${customers[index].firstName} ${customers[index].lastName}`
    )
  }
}

export function getNotifications(): Notification[] {
  if (typeof window === "undefined") return []
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
  return data ? JSON.parse(data) : []
}

export function saveNotifications(notifications: Notification[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
}

export function addNotification(notification: Omit<Notification, "id" | "createdAt" | "read">) {
  const notifications = getNotifications()
  notifications.unshift({
    ...notification,
    id: `notif-${Date.now()}`,
    createdAt: new Date().toISOString(),
    read: false,
  })
  saveNotifications(notifications)
}

export function markNotificationAsRead(notificationId: string) {
  const notifications = getNotifications()
  const index = notifications.findIndex(n => n.id === notificationId)
  if (index !== -1) {
    notifications[index].read = true
    saveNotifications(notifications)
  }
}

export function markAllNotificationsAsRead() {
  const notifications = getNotifications()
  notifications.forEach(n => n.read = true)
  saveNotifications(notifications)
}

export function getActivityLogs(): ActivityLog[] {
  if (typeof window === "undefined") return []
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)
  return data ? JSON.parse(data) : []
}

export function saveActivityLogs(logs: ActivityLog[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs))
}

export function addActivityLog(action: string, details: string) {
  const logs = getActivityLogs()
  const admin = getAdminAuth()
  logs.unshift({
    id: `log-${Date.now()}`,
    action,
    details,
    adminId: admin?.id || "system",
    adminName: admin?.name || "System",
    createdAt: new Date().toISOString(),
  })
  // Keep only last 100 logs
  saveActivityLogs(logs.slice(0, 100))
}

// Admin authentication
const ADMIN_CREDENTIALS = {
  email: "admin@pawternity.com",
  password: "admin123",
  user: {
    id: "admin-1",
    email: "admin@pawternity.com",
    name: "Admin User",
    role: "superadmin" as const,
  }
}

export function loginAdmin(email: string, password: string): AdminUser | null {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(ADMIN_CREDENTIALS.user))
    }
    addActivityLog("Admin Login", `${ADMIN_CREDENTIALS.user.name} logged in`)
    return ADMIN_CREDENTIALS.user
  }
  return null
}

export function logoutAdmin() {
  if (typeof window !== "undefined") {
    const admin = getAdminAuth()
    if (admin) {
      addActivityLog("Admin Logout", `${admin.name} logged out`)
    }
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH)
  }
}

export function getAdminAuth(): AdminUser | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH)
  return data ? JSON.parse(data) : null
}

export function isAdminAuthenticated(): boolean {
  return getAdminAuth() !== null
}

// Statistics
export function getStats() {
  const pets = getPets()
  const requests = getAdoptionRequests()
  const customers = getCustomers()
  const users = getUsers()
  const shelters = getShelters()
  
  return {
    totalPets: pets.length,
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === "pending").length,
    approvedAdoptions: requests.filter(r => r.status === "approved").length,
    rejectedRequests: requests.filter(r => r.status === "rejected").length,
    registeredUsers: users.length,
    activeUsers: users.filter(u => u.status === "active").length,
    totalShelters: shelters.length,
    activeShelters: shelters.filter(s => s.status === "active").length,
  }
}

// User Management
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.USERS)
  return data ? JSON.parse(data) : []
}

export function saveUsers(users: User[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export function registerUser(user: Omit<User, "id" | "createdAt" | "status">): User | null {
  const users = getUsers()
  
  // Check if email already exists
  if (users.some(u => u.email === user.email)) {
    return null
  }
  
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "active",
  }
  
  users.push(newUser)
  saveUsers(users)
  
  // Also add to customers
  const customers = getCustomers()
  customers.push({
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    phone: newUser.phone,
    address: newUser.address,
    city: newUser.city,
    state: newUser.state,
    country: newUser.country,
    createdAt: newUser.createdAt,
    adoptionHistory: [],
    status: "active",
  })
  saveCustomers(customers)
  
  addActivityLog("User Registered", `New user registered: ${newUser.firstName} ${newUser.lastName}`)
  
  return newUser
}

export function loginUser(email: string, password: string): User | null {
  const users = getUsers()
  const user = users.find(u => u.email === email && u.password === password)
  
  if (user && user.status === "active") {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USER_AUTH, JSON.stringify(user))
    }
    return user
  }
  return null
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.USER_AUTH)
  }
}

export function getUserAuth(): User | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(STORAGE_KEYS.USER_AUTH)
  return data ? JSON.parse(data) : null
}

export function isUserAuthenticated(): boolean {
  return getUserAuth() !== null
}

export function getUserAdoptionRequests(userEmail: string): AdoptionRequest[] {
  const requests = getAdoptionRequests()
  return requests.filter(r => r.email === userEmail)
}

export function getUserNotifications(userEmail: string): Notification[] {
  const notifications = getNotifications()
  return notifications.filter(n => n.recipientEmail === userEmail)
}

// Admin Management (for Super Admin)
export function getAdmins(): AdminUser[] {
  if (typeof window === "undefined") return []
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.ADMINS)
  return data ? JSON.parse(data) : []
}

export function saveAdmins(admins: AdminUser[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins))
}

export function createAdmin(admin: Omit<AdminUser, "id" | "createdAt" | "status">): AdminUser | null {
  const admins = getAdmins()
  
  // Check if email already exists
  if (admins.some(a => a.email === admin.email)) {
    return null
  }
  
  const currentAdmin = getAdminAuth()
  
  const newAdmin: AdminUser = {
    ...admin,
    id: `admin-${Date.now()}`,
    createdAt: new Date().toISOString(),
    createdBy: currentAdmin?.id,
    status: "active",
  }
  
  admins.push(newAdmin)
  saveAdmins(admins)
  
  addActivityLog("Admin Created", `New admin created: ${newAdmin.name} (${newAdmin.role})`)
  
  return newAdmin
}

export function updateAdminStatus(adminId: string, status: "active" | "suspended") {
  const admins = getAdmins()
  const index = admins.findIndex(a => a.id === adminId)
  if (index !== -1) {
    admins[index].status = status
    saveAdmins(admins)
    addActivityLog(
      status === "suspended" ? "Admin Suspended" : "Admin Activated",
      `${status === "suspended" ? "Suspended" : "Activated"} admin: ${admins[index].name}`
    )
  }
}

export function deleteAdmin(adminId: string) {
  const admins = getAdmins()
  const admin = admins.find(a => a.id === adminId)
  const filtered = admins.filter(a => a.id !== adminId)
  saveAdmins(filtered)
  if (admin) {
    addActivityLog("Admin Deleted", `Deleted admin: ${admin.name}`)
  }
}

// Enhanced Admin Login
export function loginAdminEnhanced(email: string, password: string): AdminUser | null {
  // Check default super admin credentials
  if (email === "superadmin@pawternity.com" && password === "superadmin123") {
    const superAdmin: AdminUser = {
      id: "superadmin-1",
      email: "superadmin@pawternity.com",
      name: "Super Admin",
      role: "superadmin",
      status: "active",
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(superAdmin))
    }
    addActivityLog("Super Admin Login", `${superAdmin.name} logged in`)
    return superAdmin
  }
  
  // Check default admin credentials
  if (email === "admin@pawternity.com" && password === "admin123") {
    const admin: AdminUser = {
      id: "admin-1",
      email: "admin@pawternity.com",
      name: "Admin User",
      role: "admin",
      status: "active",
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(admin))
    }
    addActivityLog("Admin Login", `${admin.name} logged in`)
    return admin
  }
  
  return null
}

// Shelter Management
export function getShelters(): Shelter[] {
  if (typeof window === "undefined") return []
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.SHELTERS)
  return data ? JSON.parse(data) : []
}

export function saveShelters(shelters: Shelter[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.SHELTERS, JSON.stringify(shelters))
}

export function addShelter(shelter: Omit<Shelter, "id" | "createdAt">): Shelter {
  const shelters = getShelters()
  
  const newShelter: Shelter = {
    ...shelter,
    id: `shelter-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  
  shelters.push(newShelter)
  saveShelters(shelters)
  
  addActivityLog("Shelter Added", `New shelter added: ${newShelter.name}`)
  
  return newShelter
}

export function updateShelter(updatedShelter: Shelter) {
  const shelters = getShelters()
  const index = shelters.findIndex(s => s.id === updatedShelter.id)
  if (index !== -1) {
    shelters[index] = updatedShelter
    saveShelters(shelters)
    addActivityLog("Shelter Updated", `Updated shelter: ${updatedShelter.name}`)
  }
}

export function deleteShelter(shelterId: string) {
  const shelters = getShelters()
  const shelter = shelters.find(s => s.id === shelterId)
  const filtered = shelters.filter(s => s.id !== shelterId)
  saveShelters(filtered)
  if (shelter) {
    addActivityLog("Shelter Deleted", `Deleted shelter: ${shelter.name}`)
  }
}

// Update user status
export function updateUserStatus(userId: string, status: "active" | "suspended") {
  const users = getUsers()
  const index = users.findIndex(u => u.id === userId)
  if (index !== -1) {
    users[index].status = status
    saveUsers(users)
    
    // Also update customer status
    const customers = getCustomers()
    const custIndex = customers.findIndex(c => c.id === userId)
    if (custIndex !== -1) {
      customers[custIndex].status = status
      saveCustomers(customers)
    }
    
    addActivityLog(
      status === "suspended" ? "User Suspended" : "User Activated",
      `${status === "suspended" ? "Suspended" : "Activated"} user: ${users[index].firstName} ${users[index].lastName}`
    )
  }
}
