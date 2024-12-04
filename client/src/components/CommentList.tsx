import { CommentContent } from "./CommentCreate";

export type CommentID = string;

type Comment = {
  id: CommentID;
  content: CommentContent;
};
export type Comments = [Comment];

type CommentLisProps = {
  comments: Comments;
};

const CommentList = ({ comments }: CommentLisProps) => {
  return (
    <ul>
      {comments.map(({ content, id }) => (
        <li key={id} className="list-unstyled">
          {content}
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
