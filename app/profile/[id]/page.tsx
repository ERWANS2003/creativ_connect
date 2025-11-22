import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { ExternalLink, Briefcase, FileText, Users } from 'lucide-react'

async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: true,
        socialLinks: true,
        portfolioItems: true,
        _count: {
          select: {
            jobs: true,
            resources: true,
            posts: true,
          },
        },
      },
    })

    return user
  } catch {
    return null
  }
}

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getUserProfile(params.id)

  if (!user) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-3">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.image || ''} />
                  <AvatarFallback className="text-2xl">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{user.name || 'Utilisateur'}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                {user.bio && (
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                )}
                <div className="flex flex-wrap gap-2 justify-center">
                  {user.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
                {user.socialLinks.length > 0 && (
                  <div className="flex gap-2">
                    {user.socialLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Annonces</span>
                </div>
                <span className="font-semibold">{user._count.jobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Ressources</span>
                </div>
                <span className="font-semibold">{user._count.resources}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Posts</span>
                </div>
                <span className="font-semibold">{user._count.posts}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Portfolio */}
          {user.portfolioItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {user.portfolioItems.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.projectUrl && (
                          <a
                            href={item.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            Voir le projet <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

