// pages/api/getFriends.ts

import { fetchRedis } from "@/libs/helpers/redis";
import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userId;

    const { currentUser } = await serverAuth(req, res);
    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Retrieve friend IDs
    const friendIds = (await fetchRedis('smembers', `user:${userId}:friends`)) as string[];
    // Fetch friends details
    const friendsPromises: Promise<User | null>[] = friendIds.map(async (friendId) => {
      try {
        const friend = await fetchRedis('get', `user:${friendId}`) as string;
        console.log('test', friend, 'api friend')
        const parsedFriend = JSON.parse(friend).value as User;
        return parsedFriend;
      } catch (error) {
        console.error(`Error fetching friend with ID ${friendId}:`, error);
        return null;
      }
    });


    // Filter out null values and get the final list of friends
    const friends = (await Promise.all(friendsPromises)).filter((friend) => friend !== null) as User[];


    return res.status(200).json({ message: "OK", friends });
  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}
