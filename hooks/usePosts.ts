import useSWR from "swr";
import fetcher from "@/libs/fetcher";

const usePosts = (
  userId?: string,
  fetchBookmarked?: boolean,
  fetchLiked?: boolean
) => {
  let url = "/api/posts";

  if (userId) {
    url += `?userId=${userId}`;

    if (fetchBookmarked) {
      // Adjust the URL to include the fetchBookmarked parameter
      url += `&fetchBookmarked=true`;
    }

    if (fetchLiked) {
      // Adjust the URL to include the fetchLiked parameter
      url += `&fetchLiked=true`;
    }
  }

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default usePosts;
