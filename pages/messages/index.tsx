// layout.tsx

import { Icons } from "@/components/messages/Icons";
import { getFriendsByUserId } from "@/libs/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/libs/helpers/redis";
import { notFound } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";
import SignOutButton from "@/components/messages/SignOutButton";
import { ReactNode } from "react";
import { SidebarOption } from "@/types/typings";
import { useEffect, useState } from "react";
import MobileChatLayout from "@/components/messages/MobileChatLayout";
import SidebarChatList from "@/components/messages/SidebarChatList";
import FriendRequestSidebarOptions from "@/components/messages/FriendRequestSidebarOptions";
import { ChevronRight } from "react-feather";
import { chatHrefConstructor } from "@/lib/utils"; 
import axios from "axios";
import { last } from "lodash";
import { I } from "@upstash/redis/zmscore-6fc3e57c";
import { log } from "console";

interface LayoutProps {
  children: ReactNode;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/messages/add",
    Icon: "UserPlus",
  },
];

const Layout = () => {
  const { data: currentUser } = useCurrentUser();
  const [friends, setFriends] = useState([]);
  const [friendsWithLastMessage, setFriendsWithLastMessage] = useState([]);
  const [unseenRequestCount, setUnseenRequestCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("currentUser.id:", currentUser.id);
        if (!currentUser.id) {
          return;
        }

        // Fetch unseen request count
        const response = await axios.get(
          "/api/messages/friends/fetchRequests",
          {
            params: {
              userId: currentUser.id,
            },
          }
        );

        const { data: dataconst } = response;
        const { body: unseenRequests } = dataconst;

        const temp = await axios.get(
          "/api/messages/friends/getFriendsByUserId",
          {
            params: {
              userId: currentUser.id,
            },
          }
          );
          setFriends(temp.data.friends);
          console.log("temp:", temp.data.friends);


        if (!friends) {
          return;
        }

        console.log("friends:", friends);

        if (!friends) {
          return;
        }
        
        const temper: any  = await Promise.all(
          friends.map(async (friend) => {
            console.log("FRIEND:", friend);
            const lastMessageRaw = await axios.get(
              "/api/messages/message/fetch",
              {
                params: {
                  userId: currentUser.id,
                  friendId: friend.id,
                  range: 1,
                },
              }
              );
              return {
                ...friend,
                lastMessage: lastMessageRaw.data.body, // Assuming the message body is in lastMessageRaw.data.body
              };
            })
            );
        console.log("temper:", temper);
        setFriendsWithLastMessage(temper);
            
        console.log("friendsWithLastMessage:", friendsWithLastMessage);

        console.log("unseenRequests:", unseenRequests);
        setUnseenRequestCount(unseenRequests.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentUser.id]);

  if (!currentUser.id || !friendsWithLastMessage) {
    return <div>Loading</div>;
  }
  return (
    <div className="container py-12">
      <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend}
            className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md"
          >
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-400" />
            </div>

            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                currentUser.id,
                friend
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-6 w-6"></div>
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

export default Layout;
