import express, { Express } from "express";
import { randomBytes } from "crypto";
const app: Express = express();

type Post = {
  id: string;
  title: string;
};

type ID = string;

type Posts = {
  [key: ID]: Post;
};

const posts: Posts = {};

app.use(express.json());

app.get("/post", (req, res) => {
  res.send(posts);
});

app.post("/post", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  res.status(201).send(posts[id]);
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
