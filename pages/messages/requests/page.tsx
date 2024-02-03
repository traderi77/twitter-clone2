import FriendRequests from '@/components/messages/FriendRequests'
import { fetchRedis } from '@/libs/helpers/redis'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'
import useCurrentUser from '@/hooks/useCurrentUser'

const page = async () => {
  const { data: currentUser } = useCurrentUser();
  if (!currentUser) notFound()

  // ids of people who sent current logged in user a friend requests
  const incomingSenderIds = (await fetchRedis(
    'smembers',
    `user:${currentUser.id}:incoming_friend_requests`
  )) as string[]

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis('get', `user:${senderId}`)) as string
      const senderParsed = JSON.parse(sender) as User
      
      return {
        senderId,
        senderEmail: senderParsed.email,
      }
    })
  )

  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
      <div className='flex flex-col gap-4'>
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={currentUser.id}
        />
      </div>
    </main>
  )
}

export default page
