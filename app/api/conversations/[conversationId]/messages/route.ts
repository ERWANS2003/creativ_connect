import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const cursor = searchParams.get('cursor')

    const messages = await prisma.message.findMany({
      where: {
        conversationId: params.conversationId,
        ...(cursor && {
          createdAt: {
            lt: new Date(parseInt(cursor))
          }
        })
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit + 1 // Get one extra to know if there are more
    })

    let nextCursor = null
    if (messages.length > limit) {
      const nextItem = messages.pop()
      nextCursor = nextItem?.createdAt.getTime()
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId: params.conversationId,
        senderId: { not: session.user.id },
        read: false
      },
      data: {
        read: true,
        readAt: new Date()
      }
    })

    // Update conversation participant's last read
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId: params.conversationId,
        userId: session.user.id
      },
      data: {
        lastReadAt: new Date(),
        hasUnread: false
      }
    })

    return NextResponse.json({
      messages: messages.reverse(),
      nextCursor
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { content } = await request.json()
    
    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    // Check if user is a participant in the conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId: params.conversationId,
        userId: session.user.id
      }
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'You are not a participant in this conversation' },
        { status: 403 }
      )
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        conversationId: params.conversationId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
          }
        }
      }
    })

    // Update conversation's updatedAt
    await prisma.conversation.update({
      where: { id: params.conversationId },
      data: { updatedAt: new Date() }
    })

    // Mark other participants as having unread messages
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId: params.conversationId,
        userId: { not: session.user.id }
      },
      data: {
        hasUnread: true
      }
    })

    // TODO: Emit WebSocket event for real-time updates

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
