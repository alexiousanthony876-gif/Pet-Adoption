"use client"

import Link from "next/link"
import { PawPrint, Heart, Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Mission", href: "/about#mission" },
    { label: "Team", href: "/about#team" },
    { label: "Careers", href: "/careers" },
  ],
  resources: [
    { label: "Pet Care Guide", href: "/resources/pet-care" },
    { label: "Adoption Process", href: "/resources/adoption" },
    { label: "FAQs", href: "/faqs" },
    { label: "Blog", href: "/blog" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
}

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="relative">
                <PawPrint className="h-8 w-8 text-primary" />
                <Heart className="absolute -top-1 -right-1 h-3 w-3 text-primary fill-primary" />
              </div>
              <span className="text-xl font-bold">
                Pawternity<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-background/70 mb-6 max-w-sm leading-relaxed">
              Connecting loving families with pets in need of forever homes since 2020.
              Every adoption saves a life.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <p className="font-medium">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-full bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:border-primary"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@pawternityhub.com</span>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Phone className="h-4 w-4 text-primary" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-background/70">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>123 Pet Street<br />San Francisco, CA 94102</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            2024 Pawternity Hub. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-background/50 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
