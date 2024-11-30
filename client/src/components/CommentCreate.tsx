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
    <div className="container mt-3">
      <form onSubmit={submitHandler} className="d-flex flex-column gap-3">
        <div className="form-group mb-0">
          <label htmlFor="comment" className="m-0">
            New Comment
          </label>
          <input
            id="comment"
            type="text"
            className="form-control"
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-0">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommentCreate;
