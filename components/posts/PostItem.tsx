import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import { formatDistanceToNowStrict } from 'date-fns';
import useLoginModal from '@/hooks/useLoginModal';
import useCurrentUser from '@/hooks/useCurrentUser';
import useLike from '@/hooks/useLike';
import useBookmark from '@/hooks/useBookmark';
import useCitation from '@/hooks/useCitation';
import Avatar from '../Avatar';
import { BiBookmark, BiBookmarks, BiLink, BiRepost, BiShare, BiShareAlt } from 'react-icons/bi';
import { FaRetweet } from 'react-icons/fa';
import usePost from '@/hooks/usePost';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import PostItemDots from './PostItemDots';
import { BookMarked, BookMarkedIcon, BookmarkCheck, BookmarkXIcon } from 'lucide-react';
import { BsBookmark, BsBookmarksFill } from 'react-icons/bs';



interface PostItemProps {
  data: Record<string, any>;
  userId?: string;
}

const PostItem: React.FC<PostItemProps> = ({ data = {}, userId }) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const { data: currentUser } = useCurrentUser();
  const { hasLiked, toggleLike } = useLike({ postId: data.id, userId });
  const { hasBookmarked, toggleBookmark } = useBookmark({ postId: data.id, userId });
  const { hasCited, toggleCitation } = useCitation({ postId: data.id, userId });
  const { data: citedPost } = usePost(data.citedId);
  const displayData = (data.isCited === true && citedPost && citedPost.user) ? citedPost : data;

  const commentsLength = displayData.comments.length || 0;
  const likedLength = displayData.likedIds.length || 0;
  const bookmarkedLength = displayData.bookmarkedIds.length || 0;
  const citedLength = displayData.citedIds.length || 0;

  const copyLinkToPost = useCallback((ev: any) => {
    ev.stopPropagation();

    // Construct the post link
    const postLink = `${window.location.origin}/posts/${displayData.id}`;

    // Copy the post link to the clipboard
    navigator.clipboard.writeText(postLink);
  }, [displayData.id]);


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
      className={data.isCited === true && citedPost && citedPost.user ?
        "border-b-[1px] border-neutral-800 p-5 pt-2 cursor-pointer hover:bg-neutral-900 transition"
        :
        " border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition"
      }>
      {data.isCited === true && citedPost && citedPost.user && (
        <div className="mt-0flex flex-row flex-wrap">
          <span onClick={goToCitationUser} className="text-neutral-500 text-sm w-full flex flex-row gap-2 ml-10 hover:underline">
            <FaRetweet /> {data.user.name} retweeted
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
              {createdAt} ago
            </span>
            <div onClick={(event) => event.preventDefault()} className='ml-auto'>
              <PostItemDots data={displayData} userId={displayData.userId} />
            </div>
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
              <AiOutlineMessage size={24} />
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
              <CiteIcon className={hasCited ? 'text-blue-500 fill-blue-500': ''}  
              size={24} />
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
              <LikeIcon color={hasLiked ? 'red' : ''} size={24} />
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
              <BsBookmarksFill className={hasBookmarked ? 'text-blue-500 fill-blue-500': ''} 
                  size={24} />
              <p>
                {bookmarkedLength}
              </p>
            </div>
            <HoverCard>
              <HoverCardTrigger>
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
                  <BiShareAlt size={24} />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="text-neutral-500 bg-black">
                <div onClick={(event) => event.preventDefault()} className="flex flex-row w-full">
                  <div onClick={copyLinkToPost} className='flex flex-row w-full gap-5' ><BiLink size={24} />
                    <p>Copy link to post</p>
                  </div>
                </div>

              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostItem;