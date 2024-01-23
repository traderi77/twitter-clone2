import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import usePost from "./usePost";

const useLike = ({ postId, userId }: { postId: string, userId?: string }) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedPost } = usePost(postId);
  const loginModal = useLoginModal();
  
  const [hasLiked, setHasLiked] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const list = fetchedPost?.likedIds || [];
    setHasLiked(list.includes(currentUser?.id || ''));
  }, [currentUser?.id, fetchedPost?.likedIds]);

  const toggleLike = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (hasLiked) {
        request = () => axios.delete('/api/like', { data: { postId } });
      } else {
        request = () => axios.post('/api/like', { postId });
      }

      await request();
      setHasLiked(prevHasLiked => !prevHasLiked); // Toggle the state after API call
      toast.success('Success');
    } catch (error) {
      toast.error('Something went wrong');
    }
  }, [currentUser, postId, loginModal, hasLiked]);

  return {
    hasLiked,
    toggleLike,
  };
};

export default useLike;
