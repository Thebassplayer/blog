import axios from "axios";
import { PostID } from "./PostList";
import { useState } from "react";

type Comment = string;

type CommentCreateProps = {
  postId: PostID;
};

const CommentCreate = ({ postId }: CommentCreateProps) => {
  const [comment, setComment] = useState<Comment>("");

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
        comment,
      });
      setComment("");
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
            value={comment}
            onChange={e => setComment(e.target.value)}
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
