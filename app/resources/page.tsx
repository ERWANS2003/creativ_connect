'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { Plus, Download, TrendingUp } from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  type: string
  category: string
  fileUrl: string | null
  thumbnailUrl: string | null
  price: number | null
  currency: string | null
  downloadCount: number
  createdAt: Date
  author: {
    name: string | null
    image: string | null
  }
}

export default function ResourcesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    type: searchParams.get('type') || 'all',
  })

  useEffect(() => {
    fetchResources()
  }, [searchParams])

  const fetchResources = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category && filters.category !== 'all') params.append('category', filters.category)
      if (filters.type && filters.type !== 'all') params.append('type', filters.type)

      const response = await fetch(`/api/resources?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setResources(data)
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
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
    
    router.push(`/resources?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v && v !== 'all') params.append(k, v)
    })
    router.push(`/resources?${params.toString()}`)
    fetchResources()
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Ressources</h1>
          <p className="text-muted-foreground mt-2">
            Téléchargez et partagez templates, presets, LUTs et plus
          </p>
        </div>
        <Button asChild>
          <Link href="/resources/new">
            <Plus className="mr-2 h-4 w-4" />
            Partager une ressource
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-8 p-4 border rounded-lg bg-card">
        <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-3">
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
              <SelectValue placeholder="Type de ressource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="TEMPLATE">Template</SelectItem>
              <SelectItem value="PRESET">Preset</SelectItem>
              <SelectItem value="LUT">LUT</SelectItem>
              <SelectItem value="SOUND_PACK">Pack son</SelectItem>
              <SelectItem value="MODEL_3D">Modèle 3D</SelectItem>
              <SelectItem value="OTHER">Autre</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="md:col-span-3">Filtrer</Button>
        </form>
      </div>

      {/* Resources List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>
                    {resource.type} • {resource.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{resource.downloadCount} téléchargements</span>
                    </div>
                    {resource.price !== null && resource.price > 0 ? (
                      <span className="text-lg font-semibold">
                        {resource.price} {resource.currency}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-primary">Gratuit</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatRelativeTime(resource.createdAt)}</span>
                    <Link
                      href={`/resources/${resource.id}`}
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Télécharger
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">
                Aucune ressource ne correspond à vos critères
              </p>
              <Button asChild variant="outline">
                <Link href="/resources/new">Partager la première ressource</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
