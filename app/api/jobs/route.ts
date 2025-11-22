import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const level = searchParams.get('level')

    const where: any = {}
    if (category) where.category = category
    if (type) where.type = type
    if (level) where.level = level

    const jobs = await prisma.job.findMany({
      where,
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

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des annonces' },
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
      level,
      duration,
      budget,
      currency,
      location,
      expiresAt,
    } = body

    if (!title || !description || !type || !category) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      )
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        type,
        category,
        level,
        duration,
        budget: budget ? parseFloat(budget) : null,
        currency: currency || 'EUR',
        location,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        authorId: session.user.id,
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'annonce' },
      { status: 500 }
    )
  }
}

