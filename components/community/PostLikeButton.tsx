'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface PostLikeButtonProps {
  postId: string
  initialLikes: number
  initialLiked: boolean
}

export function PostLikeButton({ postId, initialLikes, initialLiked }: PostLikeButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(initialLiked)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
        setLikes((prev) => (data.liked ? prev + 1 : prev - 1))
        router.refresh()
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className={liked ? 'text-red-500 hover:text-red-600' : ''}
    >
      <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
      {likes}
    </Button>
  )
}

