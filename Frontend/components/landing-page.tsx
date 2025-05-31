"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  Brain,
  MessageSquare,
  Search,
  Target,
  Globe,
  Sparkles,
  Star,
  TrendingUp,
  Rocket,
  Clock,
  Heart,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Copilot",
      description: "Intelligent assistant that understands natural language queries and finds perfect candidates",
      href: "/dashboard",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Natural Language Search",
      description: "Search for candidates using plain English - no complex filters needed",
      href: "/natural-language-search",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Resume Parser",
      description: "AI-powered resume analysis with skill extraction and candidate insights",
      href: "/resume-parser",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Candidate Ranking",
      description: "Intelligent ranking system that evaluates candidates against your specific criteria",
      href: "/candidate-ranking",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Web Enrichment",
      description: "Automatically enrich profiles with data from LinkedIn, GitHub, and other platforms",
      href: "/web-enrichment",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Outreach Generator",
      description: "Generate personalized outreach messages that increase response rates",
      href: "/outreach-generator",
      color: "from-pink-500 to-rose-500",
    },
  ]

  const stats = [
    { label: "Response Rate Increase", value: "3x", icon: <TrendingUp className="w-6 h-6" /> },
    { label: "Time Saved", value: "80%", icon: <Clock className="w-6 h-6" /> },
    { label: "Candidate Quality", value: "95%", icon: <Star className="w-6 h-6" /> },
    { label: "Customer Satisfaction", value: "4.9/5", icon: <Heart className="w-6 h-6" /> },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[40rem] h-[40rem] bg-purple-500/10 rounded-full mix-blend-normal filter blur-[160px] animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full mix-blend-normal filter blur-[160px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-pink-500/5 rounded-full mix-blend-normal filter blur-[200px] animate-pulse delay-1000" />

        {/* Mouse Follow Effect */}
        <motion.div
          className="absolute w-[30rem] h-[30rem] bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-full filter blur-[120px] pointer-events-none"
          animate={{
            x: mousePosition.x - 240,
            y: mousePosition.y - 240,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                HireAI
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
              🚀 The Future of AI Recruitment
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Hire Smarter
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                With AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Revolutionary AI-powered recruitment platform that finds, ranks, and engages top talent with natural
              language search and intelligent automation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4"
              >
                <Link href="/dashboard">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 text-lg px-8 py-4"
              >
                <Link href="#demo">Watch Demo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to revolutionize your recruitment process with AI-powered intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link href={feature.href}>
                  <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/70 hover:border-gray-700/50 transition-all duration-300 h-full cursor-pointer">
                    <CardContent className="p-8">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                      <div className="mt-6 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                        <span className="text-sm font-medium">Explore feature</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Your Hiring?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of companies already using HireAI to find and hire the best talent faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4"
              >
                <Link href="/dashboard">
                  Start Your Free Trial
                  <Rocket className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 text-lg px-8 py-4"
              >
                <Link href="#contact">Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">HireAI</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 HireAI. All rights reserved. Built with AI for the future of recruitment.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
