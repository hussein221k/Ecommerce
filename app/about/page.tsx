"use client";

import Navbar from "../components/Navbar";
import { Award, Truck, ShieldCheck, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      
      <main className="pt-24 pb-12">
        {/* Hero Section */}
        <div className="relative h-[400px] flex items-center justify-center overflow-hidden mb-16">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Redefining Luxury
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
              We believe that luxury is not just about price, but about the experience, quality, and the story behind every product.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {[
              { label: "Happy Customers", value: "10k+" },
              { label: "Premium Products", value: "500+" },
              { label: "Years of Excellence", value: "15+" },
              { label: "Global Locations", value: "12" },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-12 mb-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Premium Quality</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Every item in our collection is hand-picked and verified for authenticity and superior craftsmanship.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Global Shipping</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We deliver luxury to your doorstep, anywhere in the world, with insured and tracked shipping.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Secure Shopping</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your security is our priority. We use state-of-the-art encryption for all transactions.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Creative Director",
                  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
                },
                {
                  name: "Michael Chen",
                  role: "Head of Operations",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
                },
                {
                  name: "Emma Davis",
                  role: "Lead Curator",
                  image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
                }
              ].map((member, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
