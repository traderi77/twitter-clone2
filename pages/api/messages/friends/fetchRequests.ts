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
import { id } from 'date-fns/locale';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userId as string;

    const redisResponse = await fetchRedis(
      'smembers',
      `user:${userId}:incoming_friend_requests`
    ) as User[];
    

    if (!redisResponse) {
      return res.status(200).json({ body: [] });
    }

    const { currentUser } = await serverAuth(req, res);

    if (!currentUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.status(200).json({ message: 'success', body: redisResponse });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ message: 'Invalid request payload' });
    }

    return res.status(400).json({ message: 'Invalid request' });
  }
}
