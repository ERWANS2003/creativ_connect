import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { ArrowLeft, Download, TrendingUp, Euro } from 'lucide-react'

async function getResource(id: string) {
  try {
    return await prisma.resource.findUnique({
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

export default async function ResourceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const resource = await getResource(params.id)

  if (!resource) {
    notFound()
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Link
        href="/resources"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux ressources
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{resource.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge>{resource.type}</Badge>
                <Badge variant="secondary">{resource.category}</Badge>
              </div>
              <CardDescription className="text-base">
                Publié le {formatDate(resource.createdAt)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {resource.thumbnailUrl && (
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={resource.thumbnailUrl}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Téléchargements</p>
                <p className="font-semibold">{resource.downloadCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Euro className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Prix</p>
                <p className="font-semibold">
                  {resource.price && resource.price > 0
                    ? `${resource.price} ${resource.currency}`
                    : 'Gratuit'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {resource.description}
            </p>
          </div>

          {resource.fileUrl && (
            <div className="border-t pt-6">
              <Button asChild className="w-full" size="lg">
                <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </a>
              </Button>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Auteur</h3>
            <Link
              href={`/profile/${resource.author.id}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar>
                <AvatarImage src={resource.author.image || ''} />
                <AvatarFallback>
                  {resource.author.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{resource.author.name || 'Utilisateur'}</p>
                <p className="text-sm text-muted-foreground">Voir le profil</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

