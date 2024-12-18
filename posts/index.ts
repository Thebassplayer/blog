import express, { Express } from "express";
import { randomBytes } from "crypto";
import morgan from "morgan";
import cors from "cors";
import axios from "axios";

type ID = string;

type Post = {
  id: ID;
  title: string;
};
type Posts = {
  [key: ID]: Post;
};

type Event = {
  type: "PostCreated";
  data: Post;
};

const PORT = 4000;
const EVENT_BUS_SERVICE_URL = `http://event-bus-srv:4005`;
const CLIENT_URL = "http://posts.com";

const posts: Posts = {};

const app: Express = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.get("/posts", (req, res) => {
  try {
    res.send(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/posts/create", async (req, res) => {
  try {
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;
    posts[id] = {
      id,
      title,
    };

    const event: Event = {
      type: "PostCreated",
      data: posts[id],
    };

    await axios.post(`${EVENT_BUS_SERVICE_URL}/events`, event);

    res.status(201).send(posts[id]);
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
  console.log("v 0.0.1");
  console.log(`Server is running on http://localhost:${PORT} - POSTS SERVICE`);
});
