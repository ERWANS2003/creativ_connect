import { prisma } from './prisma'

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string = 'info'
) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    })
  } catch (error) {
    console.error('Error creating notification:', error)
  }
}

