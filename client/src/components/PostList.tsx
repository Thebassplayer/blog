import { useState, useEffect, useCallback } from "react";
import axios from "axios";

type ID = string;

type Post = {
  id: ID;
  title: string;
};
type Posts = {
  [key: ID]: Post;
};

const PostList = () => {
  const [posts, setPosts] = useState<Posts>({});

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:4000/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const PostsArray = useCallback(
    () => Object.values(posts).map(post => [post.id, post.title]),
    [posts]
  )();

  return (
    <div>
      <h1>Post List</h1>
      <ul className="d-flex flex-row flex-wrap justify-content-between">
        {PostsArray.map(([id, title]) => (
          <li
            key={id}
            className="card"
            style={{ width: "30%", marginBottom: "20px" }}
          >
            <div className="card-body"></div>
            <h3>{title}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
