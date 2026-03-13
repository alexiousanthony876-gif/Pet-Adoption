"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Heart, PawPrint, Settings, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getUserAuth, logoutUser, type User as UserType } from "@/lib/admin-store"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pets", label: "Browse Pets" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
]

export function Navigation() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    
    // Check for logged in user
    const authUser = getUserAuth()
    setUser(authUser)
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    router.push("/")
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass py-3 shadow-lg"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <PawPrint className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
              <Heart className="absolute -top-1 -right-1 h-3 w-3 text-primary fill-primary animate-pulse-slow" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Pawternity<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-primary transition-colors font-medium relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" title="Admin Dashboard">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="font-medium gap-2">
                    <User className="h-4 w-4" />
                    {user.firstName}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive"
                  onClick={handleLogout}
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" className="font-medium">
                  Sign In
                </Button>
              </Link>
            )}
            <Link href="/pets">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full px-6">
                Adopt Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass mt-4 rounded-2xl p-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium text-lg py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-border my-2" />
              <Link
                href="/admin"
                className="text-foreground/80 hover:text-primary transition-colors font-medium text-lg py-2 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                Admin Dashboard
              </Link>
              <Button variant="ghost" className="justify-start font-medium">
                Sign In
              </Button>
              <Link href="/pets" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full">
                  Adopt Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
