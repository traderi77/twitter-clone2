import { fetchRedis } from '@/libs/helpers/redis'
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { Message, messageValidator } from '@/lib/validations/message'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'
import useCurrentUser from '@/hooks/useCurrentUser'
import { NextApiRequest, NextApiResponse} from 'next'
import serverAuth from '@/libs/serverAuth'



export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
  ) {

  try {
    const body = await req.body
    console.log('body', body)
    const {currentUser } = await serverAuth(req, res);

    const { text, chatId }: { text: string; chatId: string } = await req.body


    if (!currentUser) return res.status(401).json({ message: 'Unauthorized' })

    const [userId1, userId2] = chatId.split('--')

    if (currentUser.id !== userId1 && currentUser.id !== userId2) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const friendId = currentUser.id === userId1 ? userId2 : userId1

    const friendList = (await fetchRedis(
      'smembers',
      `user:${currentUser.id}:friends`
    )) as string[]
    const isFriend = friendList.includes(friendId)

    if (!isFriend) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const rawSender = (await fetchRedis(
      'get',
      `user:${currentUser.id}`
    )) as string
    const sender = JSON.parse(rawSender) as User

    const timestamp = Date.now()

    const messageData: Message = {
      id: nanoid(),
      senderId: currentUser.id,
      text,
      timestamp,
    }

    const message = messageValidator.parse(messageData)

    // notify all connected chat room clients
    await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', message)

    await pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
      ...message,
      senderName: sender.name
    })

    // all valid, send the message
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    })

    return res.status(200).json(message)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message })
    }
    return res.status(500).json({ message: 'Inter00nal Server Error' })
  }
}
