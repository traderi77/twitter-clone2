// page.tsx

import { getFriendsByUserId } from "@/libs/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/libs/helpers/redis";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import Layout from "./layout"; // Import the Layout component

const Page = async ({}) => {
  const { data: currentUser } = useCurrentUser();
  if (!currentUser) notFound();

  const friends = await getFriendsByUserId(currentUser.id);

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(currentUser.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[];

      const lastMessage = JSON.parse(lastMessageRaw) as Message;

      return {
        ...friend,
        lastMessage,
      };
    })
  );
  return (
    <Layout> {/* Wrap your page content with the Layout component */}
      <div className="container py-12">
        <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
        {/* ... (existing code) */}
      </div>
    </Layout>
  );
};

export default Page;
