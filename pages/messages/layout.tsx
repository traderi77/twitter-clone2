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

interface LayoutProps {
  children: ReactNode;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

const Layout = async ({ children }: LayoutProps) => {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) notFound();

  const friends = await getFriendsByUserId(currentUser.id);
  console.log("friends", friends);

  const unseenRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${currentUser.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  return (
    <div className="w-full flex h-screen">
      {/* ... (existing code) */}

      <div className="max-h-screen container py-16 md:py-12 w-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;
