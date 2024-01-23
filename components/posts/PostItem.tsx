import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import { formatDistanceToNowStrict } from 'date-fns';
import useLoginModal from '@/hooks/useLoginModal';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useState } from 'react';
import useLike from '@/hooks/useLike';
import useBookmark from '@/hooks/useBookmark';
import useCitation from '@/hooks/useCitation';
import Avatar from '../Avatar';
import { BiBookmark, BiRepost, BiShare, BiShareAlt} from 'react-icons/bi';
import { FaRetweet } from 'react-icons/fa';
import usePost from '@/hooks/usePost';


interface PostItemProps {
  data: Record<string, any>;
  userId?: string;
}

const PostItem: React.FC<PostItemProps> = ({ data = {}, userId }) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const { data: currentUser } = useCurrentUser();
  const { hasLiked, toggleLike } = useLike({ postId: data.id, userId});
  const { hasBookmarked, toggleBookmark } = useBookmark({ postId: data.id, userId});
  const { hasCited, toggleCitation } = useCitation({ postId: data.id, userId}); 
  const { data: citedPost } = usePost(data.citedId);
  const displayData = (data.isCited === true && citedPost && citedPost.user) ? citedPost : data;

  const commentsLength = displayData.comments.length || 0;
  const likedLength = displayData.likedIds.length || 0;
  const bookmarkedLength = displayData.bookmarkedIds.length || 0;
  const citedLength = displayData.citedIds.length || 0;


  const goToUser = useCallback((ev: any) => {
    ev.stopPropagation();
    router.push(`/users/${displayData.user.id}`)
  }, [router, displayData.user.id]);


  const goToCitationUser = useCallback((ev: any) => {
    ev.stopPropagation();
    router.push(`/users/${data.user.id}`)
  }, [router, data.user.id]);


  const goToPost = useCallback(() => {
    router.push(`/posts/${displayData.id}`);
  }, [router, displayData.id]);


  const onLike = useCallback(async (ev: any) => {
    ev.stopPropagation();
  
    if (!currentUser) {
      return loginModal.onOpen();
    }
    toggleLike();
  }, [loginModal, currentUser, toggleLike]);
  

  console.log('hasliked', hasLiked)
  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;

  const onCite = useCallback(async (ev: any) => {
    ev.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }
    toggleCitation();
  }, [loginModal, currentUser, toggleCitation]);

  const CiteIcon = hasCited ? BiRepost : BiRepost;

  const onBookmark = useCallback(async (ev: any) => {
    ev.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    toggleBookmark();
  }, [loginModal, currentUser, toggleBookmark]);

  const BookmarkIcon = hasBookmarked ? BiBookmark : BiBookmark;





  const createdAt = useMemo(() => {
    if (!displayData?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(displayData.createdAt));
  }, [displayData.createdAt])

  return (
    <div 
      onClick={goToPost}
      className="
        border-b-[1px] 
        border-neutral-800 
        p-5 
        cursor-pointer 
        hover:bg-neutral-900 
        transition
      ">
    {data.isCited === true && citedPost && citedPost.user && (
      <div className="flex flex-row flex-wrap">
        <span onClick={goToCitationUser} className="text-neutral-500 text-sm w-full flex flex-row gap-2 ml-10 hover:underline">
          <FaRetweet/> {data.user.name} retweeted
        </span>
      </div>
    )}        
      <div className="flex flex-row items-start gap-3 w-full">
        <Avatar userId={displayData.user.id} />
        <div className='w-full'>
          <div className="flex flex-row items-center gap-2 w-full">
            <p 
              onClick={goToUser} 
              className="
                text-white 
                font-semibold 
                cursor-pointer 
                hover:underline
            ">
              {displayData.user.name}
            </p>
            <span 
              onClick={goToUser} 
              className="
                text-neutral-500
                cursor-pointer
                hover:underline
                hidden
                md:block
            ">
              @{displayData.user.username}
            </span>
            <span className="text-neutral-500 text-sm">
              {createdAt}
            </span>
          </div>
          <div className="text-white mt-1 w-full">
            {displayData.body}
          </div>
          <div className="flex flex-row justify-between mt-3 gap-10">
            <div 
              onClick={goToPost}
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-sky-500
            ">
              <AiOutlineMessage size={20} />
              <p>
                {commentsLength}
              </p>
            </div>

            <div
              onClick={onCite}
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-blue-500
            ">
              <CiteIcon color={hasCited ? 'blue' : ''} size={20} />
              <p>
                {citedLength}
              </p>
            </div>

            <div
              onClick={onLike}
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-red-500
            ">
              <LikeIcon color={hasLiked ? 'red' : ''} size={20} />
              <p>
                {likedLength}
              </p>
            </div>
            <div
              onClick={onBookmark}
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-blue-500
            ">
              <BookmarkIcon color={hasBookmarked ? 'blue' : ''} size={20} />
              <p>
                {bookmarkedLength}
              </p>
            </div>
            <div className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-blue-500
            ">
              <BiShareAlt size={20} />
            </div>
          </div>
        </div>
      </div>
      </div> 
  )
}

export default PostItem;