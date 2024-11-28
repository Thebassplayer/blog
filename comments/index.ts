import express, { Express } from "express";
import { randomBytes } from "crypto";
import morgan from "morgan";
import cors from "cors";

type PostId = string;
type CommentId = string;
type CommentContent = string;
type Comment = {
  id: CommentId;
  content: CommentContent;
};

const app: Express = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

const commentsByPostId: { [key: PostId]: Comment[] } = {};

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

app.post("/posts/:id/comments", (req, res) => {
  try {
    const commentId: CommentId = randomBytes(4).toString("hex");
    const { id: postId } = req.params;
    const { content: commentContent } = req.body;

    const comments: Comment[] = commentsByPostId[postId] || [];
    comments.push({ id: commentId, content: commentContent });
    commentsByPostId[postId] = comments;

    console.log("commentsByPostId: ", commentsByPostId);

    res.status(201).send(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(4001, () => {
  console.log("Server is running on http://localhost:4001");
});
