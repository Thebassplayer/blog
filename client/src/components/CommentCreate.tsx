import axios from "axios";
import { PostID } from "./PostList";
import { useState } from "react";

export type CommentContent = string;

type CommentCreateProps = {
  postId: PostID;
};

const CommentCreate = ({ postId }: CommentCreateProps) => {
  const [commentContent, setCommentContent] = useState<CommentContent>("");

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
        content: commentContent,
      });
      setCommentContent("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form action="submit" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="comment">New Comment</label>
          <input
            id="comment"
            type="text"
            className="form-control"
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommentCreate;
