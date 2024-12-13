import axios from "axios";
import { useState } from "react";

const postsServiceUrl: string = import.meta.env.VITE_APP_POSTS_SERVICE_URL;

console.log(postsServiceUrl);

const PostCreate = () => {
  const [title, setTitle] = useState<string>("");

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      await axios.post(`http://localhost:4000/posts`, { title });
      setTitle("");
    } catch (error) {
      setTitle("");
      console.error(error);
    }
  };

  return (
    <div className="container mt-3">
      <form onSubmit={submitHandler} className="d-flex flex-column gap-3">
        <div className="form-group mb-0">
          <label htmlFor="title" className="m-0">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="form-control m-0"
            placeholder="Your comment here"
            onChange={e => setTitle(e.target.value)}
            value={title}
          />
        </div>
        <button className="btn btn-primary mt-0">Submit</button>
      </form>
    </div>
  );
};

export default PostCreate;
