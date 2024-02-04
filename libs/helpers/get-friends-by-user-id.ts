import { fetchRedis } from './redis';

export const getFriendsByUserId = async (userId: string): Promise<User[]> => {
  // retrieve friends for the current user
  console.log("userId", userId);
  
  try {
    const friendIds = (await fetchRedis('smembers', `user:${userId}:friends`)) as string[];

    const friendsPromises: Promise<User | null>[] = friendIds.map(async (friendId) => {
      try {
        const friend = await fetchRedis('get', `user:${friendId}`) as string;
        const parsedFriend = JSON.parse(friend) as User;
        return parsedFriend;
      } catch (error) {
        console.error(`Error fetching friend with ID ${friendId}:`, error);
        return null;
      }
    });

    const friends = (await Promise.all(friendsPromises)).filter((friend) => friend !== null) as User[];

    return friends;
  } catch (e) {
    console.error(e);
    return [];
  }
};
