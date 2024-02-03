import { fetchRedis } from '@/libs/helpers/redis'
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
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
    const { currentUser } = await serverAuth(req, res);


    const { id: idToAdd } = z.object({ id: z.string() }).parse(body)


    if (!currentUser) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // verify both users are not already friends
    const isAlreadyFriends = await fetchRedis(
      'sismember',
      `user:${currentUser.id}:friends`,
      idToAdd
    )

    if (isAlreadyFriends) {
      return res.status(400).json({ message: 'Already friends' })
    }

    const hasFriendRequest = await fetchRedis(
      'sismember',
      `user:${currentUser.id}:incoming_friend_requests`,
      idToAdd
    )

    if (!hasFriendRequest) {
      return res.status(400).json({ message: 'No friend request' })
    }

    const [userRaw, friendRaw] = (await Promise.all([
      fetchRedis('get', `user:${currentUser.id}`),
      fetchRedis('get', `user:${idToAdd}`),
    ])) as [string, string]

    const user = JSON.parse(userRaw) as User
    const friend = JSON.parse(friendRaw) as User

    // notify added user

    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${idToAdd}:friends`),
        'new_friend',
        user
      ),
      pusherServer.trigger(
        toPusherKey(`user:${currentUser.id}:friends`),
        'new_friend',
        friend
      ),
      db.sadd(`user:${currentUser.id}:friends`, idToAdd),
      db.sadd(`user:${idToAdd}:friends`, currentUser.id),
      db.srem(`user:${currentUser.id}:incoming_friend_requests`, idToAdd),
    ])

    return res.status(200).json({ message: 'Friend added' })
    return new Response('OK')
  } catch (error) {
    console.log(error)

    if (error instanceof z.ZodError) {
      return res.status(422).json({ message: 'Invalid request payload' })
    }
    return res.status(400).json({ message: 'Invalid request' })
  }
}
