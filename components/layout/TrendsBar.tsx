import useUsers from '@/hooks/useUsers';
import { useCallback } from 'react';
import Avatar from '../Avatar';
import { use } from 'react';
import { useRouter } from 'next/router';

const TrendsBar = () => {
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
        <h2 className="text-white text-xl font-semibold">Trends for you</h2>
        <div className="flex flex-col gap-6 mt-4">
    </div>
      </div>
    </div>
  );
};

export default TrendsBar;
