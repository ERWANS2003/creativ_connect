import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { ArrowLeft, MapPin, Euro, Calendar } from 'lucide-react'

async function getJob(id: string) {
  try {
    return await prisma.job.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })
  } catch {
    return null
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const job = await getJob(params.id)

  if (!job) {
    notFound()
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Link
        href="/jobs"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux annonces
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge>{job.type}</Badge>
                <Badge variant="secondary">{job.category}</Badge>
                {job.level && <Badge variant="outline">{job.level}</Badge>}
              </div>
              <CardDescription className="text-base">
                Publié le {formatDate(job.createdAt)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {job.budget && (
              <div className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-semibold">
                    {job.budget} {job.currency}
                  </p>
                </div>
              </div>
            )}
            {job.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Localisation</p>
                  <p className="font-semibold">{job.location}</p>
                </div>
              </div>
            )}
            {job.duration && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Durée</p>
                  <p className="font-semibold">{job.duration}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Auteur</h3>
            <Link
              href={`/profile/${job.author.id}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar>
                <AvatarImage src={job.author.image || ''} />
                <AvatarFallback>
                  {job.author.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{job.author.name || 'Utilisateur'}</p>
                <p className="text-sm text-muted-foreground">Voir le profil</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

