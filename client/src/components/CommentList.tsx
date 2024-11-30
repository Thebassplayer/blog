import { PostID } from "./PostList";
import { CommentContent } from "./CommentCreate";
import { useEffect, useState } from "react";
import axios from "axios";

export type CommentID = string;

type Comment = {
  id: CommentID;
  content: CommentContent;
};
type Comments = [Comment];

type CommentLisProps = {
  postId: PostID;
};

const CommentList = ({ postId }: CommentLisProps) => {
  const [comments, setComments] = useState<Comments | []>([]);
  console.log(comments);

  const fetchComments = async (postId: PostID) => {
    try {
      const res = await axios.get(
        `http://localhost:4001/posts/${postId}/comments`
      );
      setComments(res.data);
    } catch (error) {
      console.error(error);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments(postId);
  }, [postId]);

  return (
    <ul>
      {comments.map(({ content, id }) => (
        <li key={id}>{content}</li>
      ))}
    </ul>
  );
};

export default CommentList;
