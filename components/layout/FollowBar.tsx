import useUsers from '@/hooks/useUsers';
import { useCallback } from 'react';
import Avatar from '../Avatar';
import { use } from 'react';
import { useRouter } from 'next/router';

const FollowBar = () => {
  const router = useRouter();

  const { data: users = [] } = useUsers();

  if (users.length === 0) {
    return null;
  }

  const onClick = (userId: string) => {
    const url = `/users/${userId}`;

    router.push(url);
  }

  return (
    <div className="px-6 py-4 hidden lg:block">
      <div className="bg-neutral-800 rounded-xl p-4">
        <h2 className="text-white text-xl font-semibold">Who to follow</h2>
        <div className="flex flex-col gap-6 mt-4">
          {users.map((user: Record<string, any>) => (
            <div key={user.id} onClick={() => onClick(user.id)}  className="flex flex-row gap-4 cursor-pointer">
              <Avatar userId={user.id} />
              <div className="flex flex-col">
                <p className="text-white font-semibold text-sm">{user.name}</p>
                <p className="text-neutral-400 text-sm">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowBar;
