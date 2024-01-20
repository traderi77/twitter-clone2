import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

import useUser from "@/hooks/useUser";
import Header from "@/components/Header";
import PostFeed from "@/components/posts/PostFeed";

const SettingsView = () => {
    const router = useRouter();
    const { userId } = router.query;

    const { data: fetchedUser, isLoading } = useUser(userId as string);

    if (isLoading || !fetchedUser) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader color="lightblue" size={80} />
            </div>
        )
    }
    else {
        return (
            <div className="flex flex-col">
                <Header label='Bookmarks'/>
                <PostFeed userId={userId as string} fetchBookmarked={true} fetchLiked={false}/>
            </div>
        )
    }
}


export default SettingsView;