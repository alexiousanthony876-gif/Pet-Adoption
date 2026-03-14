"use client"

import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Dog Mom",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    content: "Adopting Buddy through Pawternity Hub was the best decision we ever made. The process was smooth, and the team was incredibly supportive throughout.",
    rating: 5,
    petName: "Buddy",
  },
  {
    name: "Michael Chen",
    role: "Cat Dad",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    content: "Luna has brought so much joy into our home. The detailed pet profiles helped us find the perfect match for our lifestyle. Highly recommend!",
    rating: 5,
    petName: "Luna",
  },
  {
    name: "Emily Rodriguez",
    role: "Pet Parent",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    content: "The team at Pawternity Hub made our adoption experience wonderful. They matched us with Max, and he's been the perfect addition to our family.",
    rating: 5,
    petName: "Max",
  },
]

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <div
      className="glass rounded-3xl p-8 transition-all duration-700"
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Quote className="h-10 w-10 text-primary/30 mb-4" />
      
      <p className="text-foreground/80 text-lg leading-relaxed mb-6">
        {`"`}{testimonial.content}{`"`}
      </p>
      
      <div className="flex items-center gap-1 mb-6">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-primary text-primary" />
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
        />
        <div>
          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">
            {testimonial.role} of {testimonial.petName}
          </p>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 transition-all duration-700 opacity-100 translate-y-0">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            Happy Tails from Our Community
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Hear from families who found their perfect companions through Pawternity Hub.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
