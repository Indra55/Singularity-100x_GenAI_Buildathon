"use client"

import { useEffect, useRef, useCallback } from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Command,
  XIcon,
  LoaderIcon,
  Users,
  Search,
  MessageSquare,
  Filter,
  Star,
  MapPin,
  Calendar,
  Briefcase,
  Mail,
  Github,
  Linkedin,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"

interface UseAutoResizeTextareaProps {
  minHeight: number
  maxHeight?: number
}

function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current
      if (!textarea) return

      if (reset) {
        textarea.style.height = `${minHeight}px`
        return
      }

      textarea.style.height = `${minHeight}px`
      const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY))

      textarea.style.height = `${newHeight}px`
    },
    [minHeight, maxHeight],
  )

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = `${minHeight}px`
    }
  }, [minHeight])

  return { textareaRef, adjustHeight }
}

interface CommandSuggestion {
  icon: React.ReactNode
  label: string
  description: string
  prefix: string
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string
  showRing?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <div className={cn("relative", containerClassName)}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
            className,
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showRing && isFocused && (
          <motion.span
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    )
  },
)
Textarea.displayName = "Textarea"

interface Candidate {
  id: string
  name: string
  title: string
  location: string
  experience: number
  skills: string[]
  score: number
  availability: string
  email: string
  phone?: string
  github?: string
  linkedin?: string
  summary: string
  projects: string[]
  education: string
  lastActive: string
}

interface SearchResult {
  query: string
  candidates: Candidate[]
  totalFound: number
  searchTime: number
}

export function HireAIInterface() {
  const [value, setValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [showOutreachModal, setShowOutreachModal] = useState(false)
  const [generatedMessages, setGeneratedMessages] = useState<Record<string, string>>({})
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  })
  const [inputFocused, setInputFocused] = useState(false)
  const commandPaletteRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [sortOption, setSortOption] = useState<"score" | "experience">("score")
  const [filters, setFilters] = useState<{ location?: string; experience?: number }>({})

  const commandSuggestions: CommandSuggestion[] = [
    {
      icon: <Search className="w-4 h-4" />,
      label: "Find Candidates",
      description: "Search for candidates using natural language",
      prefix: "/find",
    },
    {
      icon: <Filter className="w-4 h-4" />,
      label: "Filter Results",
      description: "Apply advanced filters to search results",
      prefix: "/filter",
    },
    {
      icon: <MessageSquare className="w-4 h-4" />,
      label: "Generate Outreach",
      description: "Create personalized messages for candidates",
      prefix: "/outreach",
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Bulk Actions",
      description: "Perform actions on multiple candidates",
      prefix: "/bulk",
    },
  ]

  useEffect(() => {
    if (value.startsWith("/") && !value.includes(" ")) {
      setShowCommandPalette(true)
      const matchingSuggestionIndex = commandSuggestions.findIndex((cmd) => cmd.prefix.startsWith(value))
      if (matchingSuggestionIndex >= 0) {
        setActiveSuggestion(matchingSuggestionIndex)
      } else {
        setActiveSuggestion(-1)
      }
    } else {
      setShowCommandPalette(false)
    }
  }, [value])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveSuggestion((prev) => (prev < commandSuggestions.length - 1 ? prev + 1 : 0))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : commandSuggestions.length - 1))
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault()
        if (activeSuggestion >= 0) {
          const selectedCommand = commandSuggestions[activeSuggestion]
          setValue(selectedCommand.prefix + " ")
          setShowCommandPalette(false)
        }
      } else if (e.key === "Escape") {
        e.preventDefault()
        setShowCommandPalette(false)
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        handleSearch()
      }
    }
  }

  const handleSearch = async () => {
    if (!value.trim()) return

    setIsSearching(true)

    try {
      const response = await fetch("/api/search-candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
      })

      const results = await response.json()
      setSearchResults(results)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId],
    )
  }

  const generateOutreachMessages = async () => {
    if (selectedCandidates.length === 0) return

    setIsGeneratingMessages(true)
    setShowOutreachModal(true)

    try {
      const response = await fetch("/api/generate-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateIds: selectedCandidates,
          jobQuery: value,
        }),
      })

      const messages = await response.json()
      setGeneratedMessages(messages)
    } catch (error) {
      console.error("Message generation failed:", error)
    } finally {
      setIsGeneratingMessages(false)
    }
  }

  const selectCommandSuggestion = (index: number) => {
    const selectedCommand = commandSuggestions[index]
    setValue(selectedCommand.prefix + " ")
    setShowCommandPalette(false)
  }

  const sortedCandidates = React.useMemo(() => {
    if (!searchResults?.candidates) return []

    const sorted = [...searchResults.candidates]

    if (sortOption === "score") {
      sorted.sort((a, b) => b.score - a.score)
    } else if (sortOption === "experience") {
      sorted.sort((a, b) => b.experience - a.experience)
    }

    return sorted
  }, [searchResults, sortOption])

  const filteredCandidates = React.useMemo(() => {
    let filtered = [...sortedCandidates]

    if (filters.location) {
      filtered = filtered.filter((c) => c.location.toLowerCase().includes(filters.location!.toLowerCase()))
    }
    if (filters.experience) {
      filtered = filtered.filter((c) => c.experience >= filters.experience!)
    }

    return filtered
  }, [sortedCandidates, filters])

  return (
    <div className="min-h-screen flex flex-col w-full bg-transparent text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10 p-6">
        {/* Header */}
        <motion.div
          className="text-center space-y-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block"
          >
            <h1 className="text-4xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/40 pb-1">
              HireAI Copilot
            </h1>
            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
          <motion.p
            className="text-sm text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Find and connect with top AI talent using natural language
          </motion.p>
        </motion.div>

        {/* Search Interface */}
        <motion.div
          className="relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl mb-8"
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <AnimatePresence>
            {showCommandPalette && (
              <motion.div
                ref={commandPaletteRef}
                className="absolute left-4 right-4 bottom-full mb-2 backdrop-blur-xl bg-black/90 rounded-lg z-50 shadow-lg border border-white/10 overflow-hidden"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
              >
                <div className="py-1 bg-black/95">
                  {commandSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.prefix}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer",
                        activeSuggestion === index ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5",
                      )}
                      onClick={() => selectCommandSuggestion(index)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <div className="w-5 h-5 flex items-center justify-center text-white/60">{suggestion.icon}</div>
                      <div className="font-medium">{suggestion.label}</div>
                      <div className="text-white/40 text-xs ml-1">{suggestion.prefix}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-4">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                adjustHeight()
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Find senior GenAI engineers with LangChain + RAG experience in Europe, open to contract work..."
              containerClassName="w-full"
              className={cn(
                "w-full px-4 py-3",
                "resize-none",
                "bg-transparent",
                "border-none",
                "text-white/90 text-sm",
                "focus:outline-none",
                "placeholder:text-white/20",
                "min-h-[60px]",
              )}
              showRing={false}
            />
          </div>

          <div className="p-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                data-command-button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowCommandPalette((prev) => !prev)
                }}
                whileTap={{ scale: 0.94 }}
                className={cn(
                  "p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group",
                  showCommandPalette && "bg-white/10 text-white/90",
                )}
              >
                <Command className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="flex items-center gap-3">
              {selectedCandidates.length > 0 && (
                <motion.button
                  type="button"
                  onClick={generateOutreachMessages}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Generate Outreach ({selectedCandidates.length})
                </motion.button>
              )}

              <motion.button
                type="button"
                onClick={handleSearch}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSearching || !value.trim()}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  "flex items-center gap-2",
                  value.trim() ? "bg-white text-[#0A0A0B] shadow-lg shadow-white/10" : "bg-white/[0.05] text-white/40",
                )}
              >
                {isSearching ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Search</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Search Results */}
        <AnimatePresence>
          {searchResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div className="text-white/70">
                  Found <span className="text-white font-medium">{searchResults.totalFound}</span> candidates in{" "}
                  <span className="text-white font-medium">{searchResults.searchTime}ms</span>
                </div>
                <div className="text-sm text-white/40">Query: "{searchResults.query}"</div>
              </div>

              {/* Filtering and Sorting */}
              <div className="flex items-center space-x-4">
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-white/70">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-none rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as "score" | "experience")}
                  >
                    <option value="score">Score</option>
                    <option value="experience">Experience</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-white/70">
                    Location:
                  </label>
                  <input
                    type="text"
                    id="location"
                    className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-none rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                    placeholder="e.g., Europe"
                    value={filters.location || ""}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-white/70">
                    Min. Experience:
                  </label>
                  <input
                    type="number"
                    id="experience"
                    className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-none rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-white"
                    placeholder="e.g., 5"
                    value={filters.experience || ""}
                    onChange={(e) => setFilters({ ...filters, experience: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70">&nbsp;</label>
                  <button
                    onClick={() => setFilters({})}
                    className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-none rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white bg-violet-500 hover:bg-violet-600"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setViewMode("card")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    viewMode === "card"
                      ? "bg-violet-500 text-white shadow-lg shadow-violet-100"
                      : "bg-white/[0.05] text-white/40 hover:text-white/70",
                  )}
                >
                  Card View
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all ml-2",
                    viewMode === "list"
                      ? "bg-violet-500 text-white shadow-lg shadow-violet-100"
                      : "bg-white/[0.05] text-white/40 hover:text-white/70",
                  )}
                >
                  List View
                </button>
              </div>

              {/* Candidates Display */}
              <AnimatePresence mode="wait">
                {viewMode === "card" ? (
                  <motion.div
                    key="card"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filteredCandidates.map((candidate, index) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        index={index}
                        isSelected={selectedCandidates.includes(candidate.id)}
                        onToggleSelect={() => toggleCandidateSelection(candidate.id)}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.ul
                    key="list"
                    className="divide-y divide-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filteredCandidates.map((candidate) => (
                      <CandidateListItem
                        key={candidate.id}
                        candidate={candidate}
                        isSelected={selectedCandidates.includes(candidate.id)}
                        onToggleSelect={() => toggleCandidateSelection(candidate.id)}
                      />
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 backdrop-blur-2xl bg-white/[0.02] rounded-full px-6 py-3 shadow-lg border border-white/[0.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="flex items-center gap-3">
                <LoaderIcon className="w-5 h-5 animate-spin text-violet-400" />
                <span className="text-sm text-white/70">Searching candidates...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Outreach Modal */}
      <OutreachModal
        isOpen={showOutreachModal}
        onClose={() => setShowOutreachModal(false)}
        candidates={searchResults?.candidates.filter((c) => selectedCandidates.includes(c.id)) || []}
        messages={generatedMessages}
        isGenerating={isGeneratingMessages}
      />

      {/* Mouse Follow Effect */}
      {inputFocused && (
        <motion.div
          className="fixed w-[50rem] h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 150,
            mass: 0.5,
          }}
        />
      )}
    </div>
  )
}

function CandidateCard({
  candidate,
  index,
  isSelected,
  onToggleSelect,
}: {
  candidate: Candidate
  index: number
  isSelected: boolean
  onToggleSelect: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "backdrop-blur-2xl bg-white/[0.02] rounded-xl border border-white/[0.05] p-6 hover:bg-white/[0.04] transition-all cursor-pointer",
        isSelected && "ring-2 ring-violet-500/50 bg-violet-500/[0.05]",
      )}
      onClick={onToggleSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-medium text-lg">{candidate.name}</h3>
          <p className="text-white/60 text-sm">{candidate.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{candidate.score}</span>
          </div>
          {isSelected && (
            <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{candidate.location}</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Briefcase className="w-4 h-4" />
          <span>{candidate.experience} years experience</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{candidate.availability}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-white/70 text-sm line-clamp-3">{candidate.summary}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {candidate.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="px-2 py-1 bg-white/[0.05] rounded-md text-xs text-white/80">
            {skill}
          </span>
        ))}
        {candidate.skills.length > 4 && (
          <span className="px-2 py-1 bg-white/[0.05] rounded-md text-xs text-white/60">
            +{candidate.skills.length - 4} more
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-white/[0.05]">
        {candidate.email && <Mail className="w-4 h-4 text-white/40" />}
        {candidate.github && <Github className="w-4 h-4 text-white/40" />}
        {candidate.linkedin && <Linkedin className="w-4 h-4 text-white/40" />}
        <div className="ml-auto text-xs text-white/40">Active {candidate.lastActive}</div>
      </div>
    </motion.div>
  )
}

function CandidateListItem({
  candidate,
  isSelected,
  onToggleSelect,
}: {
  candidate: Candidate
  isSelected: boolean
  onToggleSelect: () => void
}) {
  return (
    <motion.li
      className={cn(
        "px-6 py-4 transition-colors cursor-pointer",
        "hover:bg-violet-800/20",
        isSelected && "bg-violet-700/30",
      )}
      onClick={onToggleSelect}
      layout
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <h3 className="text-lg font-medium text-white">{candidate.name}</h3>
          <p className="text-sm text-white/60">{candidate.title}</p>
        </div>

        <div className="text-white/60">
          <p>Location: {candidate.location}</p>
          <p>Experience: {candidate.experience} years</p>
          <p>
            Skills: {candidate.skills.slice(0, 3).join(", ")}{" "}
            {candidate.skills.length > 3 ? `+${candidate.skills.length - 3} more` : ""}
          </p>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{candidate.score}</span>
          </div>
          {isSelected && (
            <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
      </div>
    </motion.li>
  )
}

function OutreachModal({
  isOpen,
  onClose,
  candidates,
  messages,
  isGenerating,
}: {
  isOpen: boolean
  onClose: () => void
  candidates: Candidate[]
  messages: Record<string, string>
  isGenerating: boolean
}) {
  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-black/90 border border-white/10 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium text-white">Generated Outreach Messages</h2>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <h3 className="text-white font-medium">{candidate.name}</h3>
                  <p className="text-white/60 text-sm">{candidate.title}</p>
                </div>
              </div>

              <div className="bg-white/[0.02] rounded-lg p-4">
                {isGenerating ? (
                  <div className="flex items-center gap-2 text-white/60">
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    <span>Generating personalized message...</span>
                  </div>
                ) : (
                  <div className="text-white/80 text-sm whitespace-pre-wrap">
                    {messages[candidate.id] || "Message generation failed"}
                  </div>
                )}
              </div>

              {!isGenerating && messages[candidate.id] && (
                <div className="flex items-center gap-2 mt-4">
                  <button className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-md transition-colors">
                    Copy Message
                  </button>
                  <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-md transition-colors">
                    Send Email
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
