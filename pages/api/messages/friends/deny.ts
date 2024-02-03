import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import useCurrentUser from '@/hooks/useCurrentUser'
import { NextApiRequest, NextApiResponse } from 'next'
import serverAuth from '@/libs/serverAuth'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('req', req.body);
  
try {
    const body = await req.body

    const { currentUser } = await serverAuth(req, res);


    if (!currentUser) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id: idToDeny } = z.object({ id: z.string() }).parse(body)

    await db.srem(`user:${currentUser.id}:incoming_friend_requests`, idToDeny)

    return res.status(200).json({ message: 'Friend request denied' })
  } catch (error) {
    console.log(error)

    if (error instanceof z.ZodError) {
      return res.status(422).json({ message: 'Invalid request payload' })
    }
    return res.status(400).json({ message: 'Invalid request' })
  }
}
