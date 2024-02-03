import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";
import useUser from "@/hooks/useUser";
import { AiOutlineSetting } from "react-icons/ai";
import { BiMessageAdd } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
import useCurrentUser from "@/hooks/useCurrentUser";
import { getFriendsByUserId } from "@/libs/helpers/get-friends-by-user-id";

const Page = () => {
  const router = useRouter();

  const { data: currentUser } = useCurrentUser();

  const fetchData = async () => {
    if (currentUser) {
      const friends = await getFriendsByUserId(currentUser.id);
      return friends;
    }
    return null;
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={80} />
      </div>
    );
  } else {
    return (
      <div className="text-white">
        Hello {JSON.stringify(currentUser.id)}{" "}
        {JSON.stringify(fetchData())}
      </div>
    );
  }
};

export default Page;
