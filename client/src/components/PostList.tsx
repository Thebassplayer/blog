import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

export type PostID = string;

type PostTitle = string;

type Post = {
  id: PostID;
  title: PostTitle;
};
type Posts = {
  [key: PostID]: Post;
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
        {PostsArray.map(([postId, title]) => (
          <>
            <li
              key={postId}
              className="card"
              style={{ width: "30%", marginBottom: "20px" }}
            >
              <div className="card-body"></div>
              <h3>{title}</h3>
              <CommentCreate postId={postId} />
              <CommentList postId={postId} />
            </li>
          </>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
