import { BiBlock, BiDotsHorizontal, BiDotsVertical, BiFlag, BiLock } from "react-icons/bi"
import { useRouter } from "next/router"
import useLoginModal from "@/hooks/useLoginModal"
import useCurrentUser from "@/hooks/useCurrentUser"
import useUser from "@/hooks/useUser"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"



import { BsMicMute, BsPersonCheck, BsPersonDashFill } from "react-icons/bs";
import useFollow from "@/hooks/useFollow";

interface PostItemProps {
    data: Record<string, any>;
    userId: string;
}

const PostItemDots: React.FC<PostItemProps> = ({ data = {}, userId }) => {
    
    const { data: currentUser } = useCurrentUser();
    const { data: fetchedUser } = useUser(userId);
    const { isFollowing, toggleFollow } = useFollow(userId);
    

    return (
        <div className="text-neutral-500 bg-black">
            <HoverCard>
                <HoverCardTrigger>
                    <BiDotsHorizontal
                        className='text-neutral-500'
                        size={20} />
                </HoverCardTrigger>
                <HoverCardContent onClick={(event) => event.stopPropagation()} className="flex flex-row flex-wrap gap-5">

                   {currentUser?.id !== userId && (
                        <div className='flex flex-row w-full gap-5' onClick={toggleFollow} >
                            {isFollowing ? <BsPersonDashFill size={20}/> : <BsPersonCheck size={20}/> }
                            <p>{isFollowing ? 'Unfollow' : 'Follow'} @{data.user.username}</p>
                        </div>
                    )}

                    <div className='flex flex-row w-full gap-5' ><BsMicMute size={20} />
                        <p>Mute @{data.user.username}</p>
                    </div>

                    <div className='flex flex-row w-full gap-5' ><BiBlock size={20} />
                        <p>Block @{data.user.username}</p>
                    </div>

                    <div className='flex flex-row w-full gap-5'> <BiFlag size={20} />
                        <p>Report Violation of EU Censorship Law</p>
                    </div>

                </HoverCardContent>
            </HoverCard>
        </div>
    )
}

export default PostItemDots;