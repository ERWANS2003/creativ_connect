'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface Job {
  id: string
  title: string
  description: string
  type: string
  category: string
  level: string | null
  budget: number | null
  currency: string | null
  location: string | null
  createdAt: Date
  author: {
    name: string | null
    image: string | null
  }
}

export default function JobsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    type: searchParams.get('type') || 'all',
    level: searchParams.get('level') || 'all',
  })

  useEffect(() => {
    fetchJobs()
  }, [searchParams])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category && filters.category !== 'all') params.append('category', filters.category)
      if (filters.type && filters.type !== 'all') params.append('type', filters.type)
      if (filters.level && filters.level !== 'all') params.append('level', filters.level)

      const response = await fetch(`/api/jobs?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'all') params.append(k, v)
    })
    
    router.push(`/jobs?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v && v !== 'all') params.append(k, v)
    })
    router.push(`/jobs?${params.toString()}`)
    fetchJobs()
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Annonces</h1>
          <p className="text-muted-foreground mt-2">
            Trouvez des opportunités de travail et de collaboration
          </p>
        </div>
        <Button asChild>
          <Link href="/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            Publier une annonce
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-8 p-4 border rounded-lg bg-card">
        <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-4">
          <Input
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Domaine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les domaines</SelectItem>
              <SelectItem value="VIDEO_EDITING">Montage vidéo</SelectItem>
              <SelectItem value="MOTION_DESIGN">Motion design</SelectItem>
              <SelectItem value="GRAPHIC_DESIGN">Graphisme</SelectItem>
              <SelectItem value="DESIGN_3D">Design 3D</SelectItem>
              <SelectItem value="SOUND_DESIGN">Sound design</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="JOB">Job</SelectItem>
              <SelectItem value="COLLABORATION">Collaboration</SelectItem>
              <SelectItem value="FREELANCE">Freelance</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.level}
            onValueChange={(value) => handleFilterChange('level', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="mid">Intermédiaire</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="md:col-span-4">Filtrer</Button>
        </form>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription>
                    {job.type} • {job.category} {job.level && `• ${job.level}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {job.description}
                  </p>
                  {job.budget && (
                    <p className="text-lg font-semibold mb-2">
                      {job.budget} {job.currency}
                    </p>
                  )}
                  {job.location && (
                    <p className="text-sm text-muted-foreground mb-4">
                      📍 {job.location}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatRelativeTime(job.createdAt)}</span>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-primary hover:underline"
                    >
                      Voir détails →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">
                Aucune annonce ne correspond à vos critères
              </p>
              <Button asChild variant="outline">
                <Link href="/jobs/new">Publier la première annonce</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
