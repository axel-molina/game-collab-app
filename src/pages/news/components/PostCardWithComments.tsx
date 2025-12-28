import { usePostComments } from "@/hooks/usePostComments";
import { PostCard } from "@/components/posts/PostCard";

interface PostCardWithCommentsProps {
  post: any;
}

export function PostCardWithComments({ post }: PostCardWithCommentsProps) {
  const { data: comments } = usePostComments(post.id);

  // Count all comments including nested replies
  const countComments = (comments: any[]): number => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies ? countComments(comment.replies) : 0);
    }, 0);
  };

  const commentCount = comments ? countComments(comments) : 0;

  return <PostCard post={post} commentCount={commentCount} />;
}
