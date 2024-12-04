import express, { Express } from "express";
import { randomBytes } from "crypto";
import morgan from "morgan";
import cors from "cors";
import axios from "axios";
import { EventType } from "../event-bus/index";

export type PostId = string;
export type CommentId = string;
export type CommentContent = string;
export type Status = "pending" | "approved" | "rejected";
type Comment = {
  id: CommentId;
  content: CommentContent;
  status: Status;
};

type Event = {
  type: EventType;
  data: {
    id: CommentId;
    content: CommentContent;
    postId: PostId;
    status: Status;
  };
};

const PORT = 4001;
const POSTS_SERVICE_URL = `http://localhost:4000`;
const COMMENTS_SERVICE_URL = `http://localhost:${PORT}`;
const QUERY_SERVICE_URL = `http://localhost:4002`;
const EVENT_BUS_SERVICE_URL = `http://localhost:4005`;
const CLIENT_URL = "http://localhost:5173";

const app: Express = express();

const commentsByPostId: { [key: PostId]: Comment[] } = {};

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [CLIENT_URL, EVENT_BUS_SERVICE_URL],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.get("/posts/:id/comments", (req, res) => {
  try {
    const { id: postId } = req.params;
    const comments: Comment[] = commentsByPostId[postId] || [];

    res.send(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/posts/:id/comments", async (req, res) => {
  try {
    const commentId: CommentId = randomBytes(4).toString("hex");
    const { id: postId } = req.params;
    const { content: commentContent } = req.body;

    const comments: Comment[] = commentsByPostId[postId] || [];
    const defaultStatus: Status = "pending";
    comments.push({
      id: commentId,
      content: commentContent,
      status: defaultStatus,
    });
    commentsByPostId[postId] = comments;

    const event: Event = {
      type: "CommentCreated",
      data: {
        id: commentId,
        content: commentContent,
        status: defaultStatus,
        postId,
      },
    };

    await axios.post(`${EVENT_BUS_SERVICE_URL}/events`, event);

    res.status(201).send(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/events", (req, res) => {
  const event: Event = req.body;
  console.log("Received event:", event);
  res.send({});
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
