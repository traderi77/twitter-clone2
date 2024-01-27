import usePosts from '@/hooks/usePosts';

import PostItem from './PostItem';
import { truncateSync } from 'fs';

interface PostFeedProps {
  userId?: string,
  fetchBookmarked?: boolean,
  fetchLiked?: boolean, 
  
}

const PostFeed: React.FC<PostFeedProps> = ({ userId, fetchBookmarked, fetchLiked }) => {
  const { data: posts = [] } = usePosts(userId, fetchBookmarked, fetchLiked);

  return ( 
    <>
      {posts.map((post: Record<string, any>,) => (
        <PostItem userId={userId} key={post.id} data={post} />
      ))}
    </>
  );
};

export default PostFeed;
