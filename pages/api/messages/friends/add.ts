import { fetchRedis } from '@/libs/helpers/redis'
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { addFriendValidator } from '@/lib/validations/add-friend'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import serverAuth from '@/libs/serverAuth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('req');


  try {
    const emailToAdd = req.body.email.email
    console.log('body', emailToAdd); 

    const idToAdd = (await fetchRedis(
      'get',
      `user:email:${emailToAdd}`
    )) as string

    if (!idToAdd) {
      return res.status(400).json({ message: 'This person does not exist.' })
    }

    const { currentUser } = await serverAuth(req, res);



    if (!currentUser) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (idToAdd === currentUser.id) {
      return res.status(400).json({ message: 'You cannot add yourself as a friend' })
    }

    // check if user is already added
    const isAlreadyAdded = (await fetchRedis(
      'sismember',
      `user:${idToAdd}:incoming_friend_requests`,
      currentUser.id
    )) as 0 | 1

    if (isAlreadyAdded) {
      return res.status(400).json({ message: 'Already added this user' })
    }

    // check if user is already added
    const isAlreadyFriends = (await fetchRedis(
      'sismember',
      `user:${currentUser.id}:friends`,
      idToAdd
    )) as 0 | 1

    if (isAlreadyFriends) {
      return res.status(400).json({ message: 'Already friends with this user' })
    }

    // valid request, send friend request

    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      'incoming_friend_requests',
      {
        senderId: currentUser.id,
        senderEmail: currentUser.email,
      }
    )

    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, currentUser.id)

    return res.status(200).json({ message: 'Friend request sent' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ message: 'Invalid request payload' })
    }

    return res.status(400).json({ message: 'Invalid request' })
  }
}
