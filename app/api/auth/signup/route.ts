import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      { message: 'Compte créé avec succès', userId: user.id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    
    // Erreur de connexion à la base de données
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database')) {
      return NextResponse.json(
        { error: 'Impossible de se connecter à la base de données. Vérifiez votre configuration.' },
        { status: 503 }
      )
    }
    
    // Erreur si les tables n'existent pas
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Les tables de la base de données n\'existent pas. Exécutez: npm run db:push' },
        { status: 503 }
      )
    }
    
    // Erreur de validation Prisma
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    )
  }
}

