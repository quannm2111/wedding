import "./GuestBook.scss";

const Comment = ({ tagName, children }) => {
  return (
    <div className="comment-wrapper">
      <h2>{tagName}</h2>
      <p>{children}</p>
      <div className="crossline">
        <div></div>
      </div>
    </div>
  );
};

const GuestBookComment = ({ comment }) => {
  const items = [...comment].sort((a, b) => {
    const left = a.create_date?.seconds || a.create_date || 0;
    const right = b.create_date?.seconds || b.create_date || 0;
    return right - left;
  });

  return (
    <div className="guest-book-comment">
      {items.map((com) => (
        <Comment key={com.id} tagName={com.guest_name}>
          {com.message}
        </Comment>
      ))}
    </div>
  );
};

export default GuestBookComment;
