'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { Plus, MessageCircle, Heart } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PostLikeButton } from '@/components/community/PostLikeButton'
import { useSession } from 'next-auth/react'

interface Post {
  id: string
  title: string
  content: string
  createdAt: Date
  author: {
    name: string | null
    image: string | null
  }
  _count: {
    comments: number
    likes: number
  }
  userLiked?: boolean
}

export default function CommunityPage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Communauté</h1>
          <p className="text-muted-foreground mt-2">
            Partagez vos conseils, tutoriels et discussions
          </p>
        </div>
        <Button asChild>
          <Link href="/community/new">
            <Plus className="mr-2 h-4 w-4" />
            Créer un post
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={post.author.image || ''} />
                      <AvatarFallback>
                        {post.author.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <CardDescription>
                        {post.author.name} • {formatRelativeTime(post.createdAt)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-4 mb-4">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span>{post._count.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post._count.comments}</span>
                    </div>
                    <Link
                      href={`/community/${post.id}`}
                      className="ml-auto text-primary hover:underline"
                    >
                      Lire la suite →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">
                Aucun post pour le moment
              </p>
              <Button asChild variant="outline">
                <Link href="/community/new">Créer le premier post</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
