import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList, { Comments } from "./CommentList";

export type PostID = string;

type PostTitle = string;

type Post = {
  id: PostID;
  title: PostTitle;
  comments: Comments;
};
type Posts = {
  [key: PostID]: Post;
};

const PostList = () => {
  const [posts, setPosts] = useState<Posts>({});

  const fetchPosts = async () => {
    const res = await axios.get("http://posts.com/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const PostsArray = useCallback(
    () =>
      Object.values(posts).map(post => {
        return (
          <li
            key={post.id}
            className="card"
            style={{ width: "30%", marginBottom: "20px" }}
          >
            <div className="card-body">
              <h3>{post.title}</h3>
              <CommentCreate postId={post.id} />
              <CommentList comments={post.comments} />
            </div>
          </li>
        );
      }),
    [posts]
  )();

  const noPosts = PostsArray.length === 0;

  return (
    <div>
      {noPosts ? (
        <h1 className="text-center">No posts</h1>
      ) : (
        <ul className="d-flex flex-row flex-wrap justify-content-between">
          {PostsArray}
        </ul>
      )}
    </div>
  );
};

export default PostList;
