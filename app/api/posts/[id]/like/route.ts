import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ liked: false })
    }

    const like = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId: params.id,
          userId: session.user.id,
        },
      },
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error('Error checking like:', error)
    return NextResponse.json({ liked: false })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post introuvable' },
        { status: 404 }
      )
    }

    // Vérifier si l'utilisateur a déjà liké
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId: params.id,
          userId: session.user.id,
        },
      },
    })

    if (existingLike) {
      // Retirer le like
      await prisma.postLike.delete({
        where: {
          id: existingLike.id,
        },
      })
      return NextResponse.json({ liked: false })
    } else {
      // Ajouter le like
      await prisma.postLike.create({
        data: {
          postId: params.id,
          userId: session.user.id,
        },
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Erreur lors du like' },
      { status: 500 }
    )
  }
}
