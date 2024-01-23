import { BiBlock, BiDotsHorizontal, BiDotsVertical, BiFlag, BiLock } from "react-icons/bi"
import { useRouter } from "next/router"
import useLoginModal from "@/hooks/useLoginModal"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { BsMicMute, BsPersonAdd } from "react-icons/bs";
import { AiFillAlert } from "react-icons/ai";

interface PostItemProps {
    data: Record<string, any>;
    userId?: string;
}

const PostItemDots: React.FC<PostItemProps> = ({ data = {}, userId }) => {
    console.log(userId);

    return (
        <div>
            <HoverCard>
                <HoverCardTrigger>
                    <BiDotsHorizontal
                        className='text-neutral-500'
                        size={20} />
                </HoverCardTrigger>
                <HoverCardContent className="flex flex-row flex-wrap gap-5">

                    <div className='flex flex-row w-full gap-5' ><BsPersonAdd size={20} />
                        <p>Follow @{data.user.username}</p>
                    </div>

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