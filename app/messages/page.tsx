'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

type Message = {
  id: string
  content: string
  sender: {
    id: string
    name: string | null
    image: string | null
    email: string | null
  }
  read: boolean
  readAt: Date | null
  createdAt: Date
}

type Participant = {
  id: string
  user: {
    id: string
    name: string | null
    image: string | null
    email: string | null
  }
  hasUnread: boolean
  lastReadAt: Date | null
}

type Conversation = {
  id: string
  participants: Participant[]
  messages: Message[]
  updatedAt: Date
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMobileView, setIsMobileView] = useState(false)
  const [showConversationList, setShowConversationList] = useState(true)

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobileView()
    window.addEventListener('resize', checkMobileView)
    return () => window.removeEventListener('resize', checkMobileView)
  }, [])

  useEffect(() => {
    if (!session) return

    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/conversations')
        if (!res.ok) throw new Error('Failed to fetch conversations')
        const data = await res.json()
        setConversations(data)
      } catch (err) {
        console.error('Error fetching conversations:', err)
        setError('Failed to load conversations')
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [session])

  useEffect(() => {
    if (!selectedConversation) return

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/conversations/${selectedConversation.id}/messages`)
        if (!res.ok) throw new Error('Failed to fetch messages')
        const data = await res.json()
        setMessages(data.messages)
      } catch (err) {
        console.error('Error fetching messages:', err)
        setError('Failed to load messages')
      }
    }

    fetchMessages()
  }, [selectedConversation])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const res = await fetch(`/api/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
      })

      if (!res.ok) throw new Error('Failed to send message')

      const sentMessage = await res.json()
      setMessages(prev => [...prev, sentMessage])
      setNewMessage('')

      // Update the conversation in the list to show the latest message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, updatedAt: new Date() }
            : conv
        ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      )
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message')
    }
  }

  const getOtherParticipants = (conversation: Conversation) => {
    if (!session?.user) return []
    return conversation.participants.filter(p => p.user.id !== session.user.id)
  }

  const getConversationName = (conversation: Conversation) => {
    const others = getOtherParticipants(conversation)
    if (others.length === 0) return 'You'
    return others.map(p => p.user.name || p.user.email?.split('@')[0]).join(', ')
  }

  const getConversationAvatar = (conversation: Conversation) => {
    const others = getOtherParticipants(conversation)
    if (others.length === 0) return null
    return others[0].user.image
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-200px)] border rounded-lg overflow-hidden">
      {/* Conversation List */}
      <div 
        className={`w-full md:w-80 border-r ${!isMobileView || showConversationList ? 'block' : 'hidden'} md:block`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <ScrollArea className="h-[calc(100%-65px)]">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No conversations yet
            </div>
          ) : (
            conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`p-4 border-b hover:bg-muted/50 cursor-pointer flex items-center ${
                  selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                }`}
                onClick={() => {
                  setSelectedConversation(conversation)
                  if (isMobileView) setShowConversationList(false)
                }}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={getConversationAvatar(conversation) || ''} />
                  <AvatarFallback>
                    {getConversationName(conversation)
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()
                      .substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{getConversationName(conversation)}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.messages[0]?.content || 'No messages yet'}
                  </p>
                </div>
                {conversation.participants.some(
                  p => p.user.id !== session?.user?.id && p.hasUnread
                ) && (
                  <div className="ml-2 w-2 h-2 bg-primary rounded-full"></div>
                )}
              </div>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Messages */}
      <div className={`flex-1 flex flex-col ${!isMobileView || !showConversationList ? 'flex' : 'hidden'} md:flex`}>
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center">
              {isMobileView && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 md:hidden"
                  onClick={() => setShowConversationList(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>
              )}
              <h2 className="text-lg font-semibold">
                {getConversationName(selectedConversation)}
              </h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender.id === session?.user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender.id === session?.user?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70 text-right">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                          locale: fr
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  Send
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  )
}
