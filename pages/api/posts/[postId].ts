import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { postId, to_delete } = req.query;

      if (!postId || typeof postId !== 'string') {
        throw new Error('Invalid ID');
      }

      if (to_delete === 'true') {
        // If delete_post is true, delete the post
        await prisma.post.delete({
          where: {
            id: postId,
          },
        });

        return res.status(200).json({ message: 'Post deleted successfully' });
      } else {
        // If delete_post is not true, retrieve the post
        const post = await prisma.post.findUnique({
          where: {
            id: postId,
          },
          include: {
            user: true,
            comments: {
              include: {
                user: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });

        return res.status(200).json(post);
      }
    } catch (error) {
      console.error(error);
      return res.status(400).end();
    }
  } else {
    return res.status(405).end();
  }
}
