import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";
import { Input } from "@/components/ui/input"

import useUser from "@/hooks/useUser";
const MessageView = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data: fetchedUser, isLoading } = useUser(userId as string);
    return (
      <div className="flex flex-col">
        <div className="mt-5">
          <Input
            className="w-full bg-black border-white border-2 rounded-lg pd-5 highlight-none text-white"   
            placeholder="Search for people and groups"
          />
      </div>
      </div>
    )
}


export default MessageView;