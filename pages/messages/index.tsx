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

import axios from "axios";

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
  const [unseenRequestCount, setUnseenRequestCount] = useState(0);


  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("currentUser.id:", currentUser.id);

        // Fetch unseen request count
        const response = await (axios.get(
          "/api/messages/friends/fetchRequests",
          {
            params: {
              userId: currentUser.id,
            },
          }
        ))

        const { data: dataconst } = response; 
        const { body: unseenRequests } = dataconst; 

        console.log("unseenRequests:", unseenRequests);
        setUnseenRequestCount(unseenRequests.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentUser.id]);

  if (!unseenRequestCount || !currentUser.id) {
    return ( <div>Loading</div>)
  }

  return (
    <div className="w-full flex h-screen">
      <div className="md:hidden">
        <MobileChatLayout
          friends={friends}
          session={currentUser}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
        />
      </div>

      <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        {friends.length > 0 ? (
          <div className="text-xs font-semibold leading-6 text-gray-400">
            Your chats
          </div>
        ) : null}

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatList sessionId={currentUser.id} friends={friends} />
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </div>

              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}

                <li>
                  <FriendRequestSidebarOptions
                    sessionId={currentUser.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                </li>
              </ul>
            </li>

            <li className="-mx-6 mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-8 w-8 bg-gray-50"></div>

                <span className="sr-only">Your profile</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <aside className="max-h-screen container py-16 md:py-12 w-full"></aside>
    </div>
  );
};

export default Layout;
