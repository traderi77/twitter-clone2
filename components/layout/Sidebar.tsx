import { signOut } from 'next-auth/react';
import { BiBookmark, BiLogOut, BiMessageDetail, BiSearch } from 'react-icons/bi';
import { BsHouseFill, BsBellFill, BsSearch } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';

import useCurrentUser from '@/hooks/useCurrentUser';

import SidebarItem from './SidebarItem';
import SidebarLogo from './SidebarLogo';
import SidebarTweetButton from './SidebarTweetButton';
import { AiFillSetting } from 'react-icons/ai';

const Sidebar = () => {
  const { data: currentUser } = useCurrentUser();

  const items = [
    {
      icon: BsHouseFill,
      label: 'Home',
      href: '/',
    },
    {
      icon: BiSearch,
      label: 'Explore',
      href: '/explore',
      auth: true, 
    },
    {
      icon: BsBellFill,
      label: 'Notifications',
      href: '/notifications',
      auth: true,
      alert: currentUser?.hasNotification
    },
    {
      icon: FaUser,
      label: 'Profile',
      href: `/users/${currentUser?.id}`,
      auth: true,
    },

    {
      icon: BiMessageDetail,
      label: 'Messages',
      href: `/messages/${currentUser?.id}`,
      auth: true,
    },

    {
      icon: BiBookmark,
      label: 'Bookmarks',
      href: `/bookmarks/${currentUser?.id}`,
      auth: true,
    },

    {
      icon: AiFillSetting, 
      label: 'Settings', 
      href: `/settings/${currentUser?.id}`,
      auth: true,
    },
  ]

  return (
    <div className="col-span-1 h-full pr-4 md:pr-6">
        <div className="flex flex-col items-end">
          <div className="space-y-2 lg:w-[230px]">
            <SidebarLogo />
            {items.map((item) => (
              <SidebarItem
                key={item.href}
                alert={item.alert}
                auth={item.auth}
                href={item.href} 
                icon={item.icon} 
                label={item.label}
              />
            ))}
            {currentUser && <SidebarItem onClick={() => signOut()} icon={BiLogOut} label="Logout" />}
            <SidebarTweetButton />
          </div>
        </div>
      </div>
  )
};

export default Sidebar;
