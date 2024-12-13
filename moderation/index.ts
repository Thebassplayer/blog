import express, { Express } from "express";
import { randomBytes } from "crypto";
import morgan from "morgan";
import cors from "cors";
import axios from "axios";
import { PostId, CommentId, CommentContent, Status } from "../comments/index";
import { EventType } from "../event-bus/index";

type ID = string;

type Post = {
  id: ID;
  title: string;
};
type Posts = {
  [key: ID]: Post;
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

const PORT = 4003;
const MODERATION_SERVICE_URL = `http://localhost:${PORT}`;
const POSTS_SERVICE_URL = `http://localhost:4000`;
const COMMENTS_SERVICE_URL = "http://localhost:4001";
const QUERY_SERVICE_URL = `http://localhost:4002`;
const EVENT_BUS_SERVICE_URL = `http://localhost:4005`;
const CLIENT_URL = "http://localhost:5173";

const posts: Posts = {};

const app: Express = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: [COMMENTS_SERVICE_URL],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.post("/events", async (req, res) => {
  try {
    const { type, data } = req.body as Event;

    if (type === "CommentCreated") {
      const status = data.content.includes("orange") ? "rejected" : "approved";
      await axios.post(`${EVENT_BUS_SERVICE_URL}/events`, {
        type: "CommentModerated",
        data: {
          ...data,
          status,
        },
      });
      res.status;
    }
    res.status(200).send({});
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
  console.log(
    `Server is running on http://localhost:${PORT} - MODERATION SERVICE`
  );
});
