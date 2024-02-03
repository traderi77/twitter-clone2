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
import Layout from "./Layout"; // Import the Layout component
import { useEffect, useState } from "react";


const Page = () => {
  const { data: currentUser } = useCurrentUser();
  const [friendsWithLastMessage, setFriendsWithLastMessage] = useState([]);

  console.log('currentUser23948', currentUser);

  useEffect(() => {
    const fetchData = async () => {
      console.log('currentUser', currentUser);

      const friends = await FriendsByUserId(currentUser.id);

      if (friends.length === 0) {
        return;
      }

      const friendsWithLastMessage = await Promise.all(
        friends.map(async (friend) => {
          const [lastMessageRaw] = (await fetchRedis(
            'zrange',
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

      // Now you have friendsWithLastMessage ready for use
      console.log('Friends with last message:', friendsWithLastMessage);
    };

    fetchData();
  }, []); // The empty dependency array ensures this runs once when the component mounts

  return (
    <div className="container py-12">
      <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md"
          >
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-400" />
            </div>

            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                currentUser.id,
                friend.id
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-6 w-6">
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">{friend.name}</h4>
                <p className="mt-1 max-w-md">
                  <span className="text-zinc-400">
                    {friend.lastMessage.senderId === currentUser.id
                      ? "You: "
                      : ""}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Page;

// const page = async ({}) => {
//   const { data: currentUser } = useCurrentUser();
//   if (!currentUser) notFound();

//   const friends = await getFriendsByUserId(currentUser.id);

//   const friendsWithLastMessage = await Promise.all(
//     friends.map(async (friend) => {
//       const [lastMessageRaw] = (await fetchRedis(
//         "zrange",
//         `chat:${chatHrefConstructor(currentUser.id, friend.id)}:messages`,
//         -1,
//         -1
//       )) as string[];

//       const lastMessage = JSON.parse(lastMessageRaw) as Message;

//       return {
//         ...friend,
//         lastMessage,
//       };
//     })
//   );

//   return (
//     <div className="container py-12">
//       <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
//       {friendsWithLastMessage.length === 0 ? (
//         <p className="text-sm text-zinc-500">Nothing to show here...</p>
//       ) : (
//         friendsWithLastMessage.map((friend) => (
//           <div
//             key={friend.id}
//             className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md"
//           >
//             <div className="absolute right-4 inset-y-0 flex items-center">
//               <ChevronRight className="h-7 w-7 text-zinc-400" />
//             </div>

//             <Link
//               href={`/dashboard/chat/${chatHrefConstructor(
//                 currentUser.id,
//                 friend.id
//               )}`}
//               className="relative sm:flex"
//             >
//               <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
//                 <div className="relative h-6 w-6">
//                 </div>
//               </div>

//               <div>
//                 <h4 className="text-lg font-semibold">{friend.name}</h4>
//                 <p className="mt-1 max-w-md">
//                   <span className="text-zinc-400">
//                     {friend.lastMessage.senderId === currentUser.id
//                       ? "You: "
//                       : ""}
//                   </span>
//                   {friend.lastMessage.text}
//                 </p>
//               </div>
//             </Link>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default page;
