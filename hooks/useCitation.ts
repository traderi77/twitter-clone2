import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import usePost from "./usePost";
import usePosts from "./usePosts";

const useCitation = ({ postId, userId }: { postId: string, userId?: string }) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
  const { mutate: mutateFetchedPosts } = usePosts(userId);

  const loginModal = useLoginModal();

  const hasCited = useMemo(() => {
    const list = fetchedPost?.citedIds || [];

    return list.includes(currentUser?.id);
  }, [fetchedPost, currentUser]);

  const toggleCitation= useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (hasCited) {
        request = () => axios.delete('/api/citation', { data: { postId } });
      } else {
        request = () => axios.post('/api/citation', { postId });
      }

      await request();
      mutateFetchedPost();
      mutateFetchedPosts();

    } catch (error) {
      toast.error('Something went wrong');
    }
  }, [currentUser, hasCited, postId, mutateFetchedPosts, mutateFetchedPost, loginModal]);

  return {
    hasCited,
    toggleCitation,
  }
}
export default useCitation;
