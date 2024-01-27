import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

import useUser from "@/hooks/useUser";
import { AiOutlineSetting } from "react-icons/ai";
import { BiMessageAdd } from "react-icons/bi";

const MessageView = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data: fetchedUser, isLoading } = useUser(userId as string);

  if (isLoading || !fetchedUser) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={80} />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-end">
        <h1 className="text-white self-start"> These are my messages </h1>

        <div className="end flex flex-row gap-4 h-5">
          <AiOutlineSetting className="text-white" />
          <BiMessageAdd className="text-white" />
        </div>
      </div>
    );
  }
};

export default MessageView;
