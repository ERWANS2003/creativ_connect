import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')

    const where: any = {}
    if (category) where.category = category
    if (type) where.type = type

    const resources = await prisma.resource.findMany({
      where,
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

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des ressources' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      type,
      category,
      fileUrl,
      thumbnailUrl,
      price,
      currency,
    } = body

    if (!title || !description || !type || !category) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      )
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        type,
        category,
        fileUrl,
        thumbnailUrl,
        price: price ? parseFloat(price) : 0,
        currency: currency || 'EUR',
        authorId: session.user.id,
      },
    })

    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la ressource' },
      { status: 500 }
    )
  }
}

