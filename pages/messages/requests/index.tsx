import FriendRequests from '@/components/messages/FriendRequests'
import { fetchRedis } from '@/libs/helpers/redis'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import useCurrentUser from '@/hooks/useCurrentUser'
import axios from 'axios'


const page: FC = () => {
  const [incomingFriendRequests, setIncomingFriendRequests] = useState<any[]>([]);
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser || userLoading || !currentUser.id) {
        return;
      }

      try {
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


        const incomingRequests = await Promise.all(
          unseenRequests.map(async (senderId: any) => {
            return {
              senderId,
            };
          })
        );

        setIncomingFriendRequests(incomingRequests);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle the error, e.g., show an error message to the user
      }
    };

    fetchData(); // Ensure fetchData is called on mount
  }, [currentUser]);

  console.log(incomingFriendRequests, 'fr request0');
  
  console.log(currentUser, 'current user');
  if (userLoading || !currentUser.id) {
    return <div>Loading...</div>;
  }


  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
      <div className='flex flex-col gap-4'>
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={currentUser.id}
        />
      </div>
    </main>
  );
};

export default page;
