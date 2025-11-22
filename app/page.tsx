import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, FileText, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatRelativeTime } from '@/lib/utils'

async function getRecentJobs() {
  try {
    return await prisma.job.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })
  } catch {
    return []
  }
}

async function getPopularResources() {
  try {
    return await prisma.resource.findMany({
      take: 6,
      orderBy: { downloadCount: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })
  } catch {
    return []
  }
}

async function getRecentPosts() {
  try {
    return await prisma.post.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [jobs, resources, posts] = await Promise.all([
    getRecentJobs(),
    getPopularResources(),
    getRecentPosts(),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="flex flex-col items-center text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            La communauté des{' '}
            <span className="text-primary">créateurs</span>
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Rejoignez des milliers de monteurs vidéo, motion designers, graphistes,
            designers 3D et sound designers. Partagez vos ressources, trouvez des
            opportunités et développez votre réseau.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/auth/signup">Commencer gratuitement</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/community">Explorer la communauté</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-12 border-t">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Video className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Annonces</CardTitle>
              <CardDescription>
                Trouvez des jobs, collaborations et missions freelance
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Ressources</CardTitle>
              <CardDescription>
                Téléchargez et partagez templates, presets, LUTs et plus
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Communauté</CardTitle>
              <CardDescription>
                Échangez conseils, tutoriels et discussions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="container py-12 border-t">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Annonces récentes</h2>
          <Button variant="ghost" asChild>
            <Link href="/jobs">
              Voir tout <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {job.type} • {job.category}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                  {job.budget && (
                    <p className="mt-2 text-sm font-semibold">
                      {job.budget} {job.currency}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
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
            <p className="col-span-full text-center text-muted-foreground py-8">
              Aucune annonce pour le moment
            </p>
          )}
        </div>
      </section>

      {/* Popular Resources */}
      <section className="container py-12 border-t">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Ressources populaires</h2>
          <Button variant="ghost" asChild>
            <Link href="/resources">
              Voir tout <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
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
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{resource.downloadCount} téléchargements</span>
                    </div>
                    <Link
                      href={`/resources/${resource.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      Voir →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-8">
              Aucune ressource pour le moment
            </p>
          )}
        </div>
      </section>

      {/* Recent Community Posts */}
      <section className="container py-12 border-t">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Derniers posts</h2>
          <Button variant="ghost" asChild>
            <Link href="/community">
              Voir tout <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription>
                    Par {post.author.name} • {formatRelativeTime(post.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.content}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{post._count.comments} commentaires</span>
                    <span>{post._count.likes} likes</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-8">
              Aucun post pour le moment
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

