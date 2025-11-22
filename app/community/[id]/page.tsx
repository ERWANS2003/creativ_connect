import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { CommentForm } from '@/components/community/CommentForm'
import { PostLikeButton } from '@/components/community/PostLikeButton'

async function getPost(id: string, userId?: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        likes: userId ? {
          where: {
            userId,
          },
        } : false,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })

    if (!post) return null

    return {
      ...post,
      userLiked: userId ? post.likes.length > 0 : false,
    }
  } catch {
    return null
  }
}

export default async function PostDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const post = await getPost(params.id, session?.user?.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Link
        href="/community"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la communauté
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={post.author.image || ''} />
              <AvatarFallback>
                {post.author.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
              <CardDescription>
                Par {post.author.name} • {formatRelativeTime(post.createdAt)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap mb-4">
            {post.content}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <PostLikeButton
              postId={post.id}
              initialLikes={post._count.likes}
              initialLiked={post.userLiked}
            />
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Commentaires ({post.comments.length})</h2>
        
        <CommentForm postId={post.id} />

        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={comment.author.image || ''} />
                    <AvatarFallback>
                      {comment.author.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{comment.author.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucun commentaire pour le moment. Soyez le premier à commenter !
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

