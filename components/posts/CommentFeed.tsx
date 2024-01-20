import CommentItem from './CommentItem';

interface CommentFeedProps {
  comments?: Record<string, any>[];
}

const CommentFeed: React.FC<CommentFeedProps> = ({ comments = [] }) => {
  return (
    console.log(comments), 
    <>
      {comments.map((comment: Record<string, any>,) => (
        <CommentItem userId={comment.user.id} key={comment.id} data={comment} />
      ))}
    </>
  );
};

export default CommentFeed;
