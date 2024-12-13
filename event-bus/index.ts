import express, { Express } from "express";
import axios from "axios";
import { randomBytes } from "crypto";
import morgan from "morgan";
import cors from "cors";

export type EventType = "CommentCreated" | "CommentModerated";

const PORT = 4005;
const POSTS_SERVICE_URL = "http://localhost:4000";
const COMMENTS_SERVICE_URL = "http://localhost:4001";
const QUERY_SERVICE_URL = `http://localhost:4002`;
const MODERATION_SERVICE_URL = `http://localhost:4003`;
const EVENT_BUS_SERVICE_URL = `http://localhost:${PORT}`;

const app: Express = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: [POSTS_SERVICE_URL, COMMENTS_SERVICE_URL],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.post("/events", async (req, res) => {
  try {
    const event = req.body;

    await axios.post(`${POSTS_SERVICE_URL}/events`, event);
    await axios.post(`${COMMENTS_SERVICE_URL}/events`, event);
    await axios.post(`${QUERY_SERVICE_URL}/events`, event);
    await axios.post(`${MODERATION_SERVICE_URL}/events`, event);

    res.status(201).send("Event forwarded");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} - EVENT BUS`);
});
