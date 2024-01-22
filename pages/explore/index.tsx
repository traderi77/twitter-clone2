import { useRouter } from "next/router";
import useUser from "@/hooks/useUser";
const MessageView = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data: fetchedUser, isLoading } = useUser(userId as string);
    return (
      <div className="flex flex-col">
        <div className="mt-5">
          Just some text
        </div>
      </div>
    )
}


export default MessageView;