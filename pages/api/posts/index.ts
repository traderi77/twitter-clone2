import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import { Prisma } from "@prisma/client"; // Import Prisma types
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    if (req.method === 'POST') {
      // Handle creating a new post
      const { currentUser } = await serverAuth(req, res);
      const { body } = req.body;

      const post = await prisma.post.create({
        data: {
          body,
          userId: currentUser.id
        }
      });

      return res.status(200).json(post);
    }

    if (req.method === 'GET') {
      const { userId, fetchBookmarked, fetchLiked } = req.query;

      let posts;

      console.log('were hereee', userId, fetchBookmarked, fetchLiked)
      if (userId && typeof userId === 'string') {
      
        if (fetchBookmarked === 'true') {
          // Fetch bookmarked posts
          posts = await prisma.post.findMany({
            where: {
              bookmarkedIds: {
                has: userId, // Filter bookmarked by current user
              },
            },
            include: {
              user: true,
              comments: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 6
          });
        } else if (fetchLiked === 'true') {
          // Fetch liked posts
          posts = await prisma.post.findMany({
            where: {
              likedIds: {
                has: userId, // Filter liked by current user
              },
            },
            include: {
              user: true,
              comments: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 6
          });
        }
        else {
          // Fetch all posts
          posts = await prisma.post.findMany({
            where: {
              userId,
            },
            include: {
              user: true,
              comments: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 6
          });
        }
      }
      else {
        // Fetch all posts
        posts = await prisma.post.findMany({
          include: {
            user: true,
            comments: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 6
        });
      }

    return res.status(200).json(posts);
  }
    
  }

  
  catch (error) {
  console.log(error);
  return res.status(400).end();
}
}