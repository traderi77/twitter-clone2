import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).end();
  }

  try {
    const { postId } = req.body;

    const { currentUser } = await serverAuth(req, res);

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid ID");
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Invalid ID");
    }

    let updatedCitedIds = [...(post.citedIds || [])];

    if (req.method === "POST") {
      updatedCitedIds.push(currentUser.id);

      // Create a new post as a citation
      const newCitedPost = await prisma.post.create({
        data: {
          isCited: true,
          citedId: postId,
          userId: currentUser.id,
          // You can set other properties as needed, but there's no "body" in a citation
        },
      });

      // NOTIFICATION PART START
      try {
        const citedPost = await prisma.post.findUnique({
          where: {
            id: postId,
          },
        });

        if (citedPost?.userId) {
          await prisma.notification.create({
            data: {
              body: "Someone cited your tweet!",
              userId: citedPost.userId,
            },
          });

          await prisma.user.update({
            where: {
              id: citedPost.userId,
            },
            data: {
              hasNotification: true,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
      // NOTIFICATION PART END
    }

    if (req.method === "DELETE") {
      // Delete the citation post first
      await prisma.post.deleteMany({
        where: {
          isCited: true,
          citedId: postId,
          userId: currentUser.id,
        },
      });

      updatedCitedIds = updatedCitedIds.filter(
        (citedId) => citedId !== currentUser?.id
      );
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        citedIds: updatedCitedIds,
      },
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
