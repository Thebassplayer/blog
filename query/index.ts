import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";

type PostId = string;
type CommentId = string;
type PostTitle = string;

type Post = {
  id: PostId;
  title: PostTitle;
};
type CommentContent = string;

type Comment = {
  id: CommentId;
  content: CommentContent;
  status?: Status;
};

type Comments = Comment[];

type Status = "pending" | "approved" | "rejected";

type EventType = "CommentCreated" | "PostCreated" | "CommentUpdated";

type Posts = {
  [key: PostId]: {
    id: PostId;
    title: PostTitle;
    comments?: Comments;
  };
};

type Event =
  | {
      type: "CommentCreated";
      data: {
        id: CommentId;
        content: CommentContent;
        postId: PostId;
        status: Status;
      };
    }
  | {
      type: "PostCreated";
      data: Post;
    }
  | {
      type: "CommentUpdated";
      data: {
        id: CommentId;
        content: CommentContent;
        postId: PostId;
        status: Status;
      };
    };

const PORT = 4002;
const POSTS_SERVICE_URL = `http://localhost:4000`;
const COMMENTS_SERVICE_URL = "http://localhost:4001";
const EVENT_BUS_SERVICE_URL = `http://event-bus-srv:4005`;
const CLIENT_URL = "http://localhost:5173";

const posts: Posts = {};

const app: Express = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: [
      POSTS_SERVICE_URL,
      COMMENTS_SERVICE_URL,
      EVENT_BUS_SERVICE_URL,
      CLIENT_URL,
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  try {
    const event: Event = req.body;

    const { type, data } = event;

    if (type === "PostCreated") {
      const { id, title } = data as Post;
      posts[id] = { id, title, comments: [] };
    }
    if (type === "CommentCreated") {
      const { id, content, postId } = data as {
        id: CommentId;
        content: CommentContent;
        postId: PostId;
        status: Status;
      };

      const post = posts[postId];
      post.comments = post.comments || [];
      post.comments.push({ id, content });
    }

    if (type === "CommentUpdated") {
      const { id, content, postId, status } = data as {
        id: CommentId;
        content: CommentContent;
        postId: PostId;
        status: Status;
      };

      const post = posts[postId];
      const comment = post.comments?.find(comment => comment.id === id);
      if (comment) {
        comment.status = status;
        comment.content = content;
      } else {
        console.error("Comment not found");
      }
    }

    console.dir(posts, { depth: null });

    res.send({});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} - QUERY SERVICE`);
});
