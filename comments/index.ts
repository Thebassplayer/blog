import express, { Express } from "express";
import { randomBytes } from "crypto";
import morgan from "morgan";
import cors from "cors";
import axios from "axios";

type EventType = "CommentCreated" | "CommentModerated";
type PostId = string;
type CommentId = string;
type CommentContent = string;
type Status = "pending" | "approved" | "rejected";
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
const EVENT_BUS_SERVICE_URL = `http://event-bus-srv:4005`;
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

    console.log(`Received event: ${event.type} for post: ${event.data.postId}`);

    await axios.post(`${EVENT_BUS_SERVICE_URL}/events`, event);

    res.status(201).send(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/events", async (req, res) => {
  try {
    const event: Event = req.body;
    const { type, data } = event;

    if (type === "CommentModerated") {
      const { id, postId, status } = data;
      const comments = commentsByPostId[postId] || [];
      const comment = comments.find(comment => comment.id === id);

      if (comment) {
        comment.status = status;
      } else {
        comments.push(data);
      }

      await axios.post(`${EVENT_BUS_SERVICE_URL}/events`, {
        type: "CommentUpdated",
        data: {
          ...data,
          status,
        },
      });

      res.status(200).send({});
      return;
    }

    res.send({});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT} - COMMENTS SERVICE`
  );
});
