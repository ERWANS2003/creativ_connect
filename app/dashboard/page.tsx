import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, FileText, Briefcase, Users } from 'lucide-react'

async function getUserStats(userId: string) {
  try {
    const [jobs, resources, posts] = await Promise.all([
      prisma.job.count({ where: { authorId: userId } }),
      prisma.resource.count({ where: { authorId: userId } }),
      prisma.post.count({ where: { authorId: userId } }),
    ])

    return { jobs, resources, posts }
  } catch {
    return { jobs: 0, resources: 0, posts: 0 }
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const stats = await getUserStats(session.user.id)

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos annonces, ressources et posts
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Annonces</CardTitle>
              <Briefcase className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>{stats.jobs} annonce(s) publiée(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/jobs/new">
                <Plus className="mr-2 h-4 w-4" />
                Publier une annonce
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Ressources</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>{stats.resources} ressource(s) partagée(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/resources/new">
                <Plus className="mr-2 h-4 w-4" />
                Partager une ressource
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Posts</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>{stats.posts} post(s) créé(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/community/new">
                <Plus className="mr-2 h-4 w-4" />
                Créer un post
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mes annonces récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Vos annonces récentes apparaîtront ici
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/jobs">Voir toutes mes annonces</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes ressources récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Vos ressources récentes apparaîtront ici
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/resources">Voir toutes mes ressources</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Profile Link */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Mon profil</CardTitle>
            <CardDescription>
              Gérez vos informations personnelles et votre portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/profile/${session.user.id}`}>
                Modifier mon profil
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

