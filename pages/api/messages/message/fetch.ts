import { fetchRedis } from "@/libs/helpers/redis";
import { z } from "zod";
import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import { chatHrefConstructor } from "@/lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.body, 'req.body')
    const { userId, friendId, range } = req.body;

    // Check if any of the required parameters is undefined or empty string
    if (!userId || !friendId || !range) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    
    const [lastMessageRaw] = (await fetchRedis(
      "zrange",
      `chat:${chatHrefConstructor(userId, friendId)}:messages`,
      -range,
      -range,
      )) as string[];
      
      const { currentUser } = await serverAuth(req, res);
  
      if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
    if (!lastMessageRaw) {
      return res.status(400).json({ message: "This person does not exist." });
    }


    return res.status(200).json({ message: "OK", body: lastMessageRaw });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({ message: "Invalid request payload" });
    }

    return res.status(400).json({ message: "Invalid request" });
  }
}
