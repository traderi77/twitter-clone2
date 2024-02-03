import { fetchRedis } from '@/libs/helpers/redis'
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import useCurrentUser from '@/hooks/useCurrentUser'


export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { data: currentUser } = useCurrentUser()


    const { id: idToAdd } = z.object({ id: z.string() }).parse(body)


    if (!currentUser) {
      return new Response('Unauthorized', { status: 401 })
    }

    // verify both users are not already friends
    const isAlreadyFriends = await fetchRedis(
      'sismember',
      `user:${currentUser.id}:friends`,
      idToAdd
    )

    if (isAlreadyFriends) {
      return new Response('Already friends', { status: 400 })
    }

    const hasFriendRequest = await fetchRedis(
      'sismember',
      `user:${currentUser.id}:incoming_friend_requests`,
      idToAdd
    )

    if (!hasFriendRequest) {
      return new Response('No friend request', { status: 400 })
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

    return new Response('OK')
  } catch (error) {
    console.log(error)

    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 })
    }

    return new Response('Invalid request', { status: 400 })
  }
}
