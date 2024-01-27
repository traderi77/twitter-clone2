import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import usePost from "./usePost";
import usePosts from "./usePosts";

const useBookmark = ({ postId, userId }: { postId: string, userId?: string }) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
  const { mutate: mutateFetchedPosts } = usePosts(userId);

  const loginModal = useLoginModal();

  const hasBookmarked = useMemo(() => {
    const list = fetchedPost?.bookmarkedIds || [];

    return list.includes(currentUser?.id);
  }, [fetchedPost, currentUser]);

  const toggleBookmark = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (hasBookmarked) {
        request = () => axios.delete('/api/bookmark', { data: { postId } });
      } else {
        request = () => axios.post('/api/bookmark', { postId });
      }

      await request();
      mutateFetchedPost();
      mutateFetchedPosts();

    } catch (error) {
      toast.error('Something went wrong');
    }
  }, [currentUser, hasBookmarked, postId, mutateFetchedPosts, mutateFetchedPost, loginModal]);

  return {
    hasBookmarked,
    toggleBookmark,
  }
}
export default useBookmark;
