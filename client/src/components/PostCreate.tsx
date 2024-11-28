import axios from "axios";
import { useState } from "react";
const PostCreate = () => {
  const [title, setTitle] = useState<string>("");

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      await axios.post("http://localhost:4000/posts", { title });
      setTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form action="Submit" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            className="form-control"
            placeholder="Your comment here"
            onChange={e => setTitle(e.target.value)}
            value={title}
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default PostCreate;
