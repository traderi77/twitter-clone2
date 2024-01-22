import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";
import Input from "@/components/Input";
import useUser from "@/hooks/useUser";
import { AiOutlineSetting } from "react-icons/ai";
import { BiMessageAdd } from "react-icons/bi";
import { LucideFormInput } from "lucide-react";
const MessageView = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data: fetchedUser, isLoading } = useUser(userId as string);
    return (
      <div className="flex flex-col">
        <div className="mt-5">
          <LucideFormInput
            className="w-full"   
            size={20}
            color="white"
          />
      </div>
      </div>
    )
}


export default MessageView;