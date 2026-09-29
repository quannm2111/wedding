import "./GuestBook.scss";

const GuestBookForm = ({ handlePostComment }) => {
  return (
    <form
      id="form"
      className="guest-book-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (
          !event.target.elements.name.value ||
          !event.target.elements.message.value
        ) {
          return;
        }
        const payload = {
          guest_name: event.target.elements.name.value,
          message: event.target.elements.message.value,
          create_date: new Date(),
        };
        handlePostComment(payload);
      }}
    >
      <div className="field">
        <label htmlFor="name">Tên của bạn</label>
        <input type="text" id="name" name="name" required />
      </div>
      <div className="field">
        <label htmlFor="message">Nhập lời chúc của bạn</label>
        <textarea name="message" id="message" required />
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-button">
          Gửi lời yêu thương
        </button>
      </div>
    </form>
  );
};

export default GuestBookForm;
