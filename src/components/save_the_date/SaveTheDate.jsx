import SaveTheDateCalendar from "./Calender";
import "./SaveTheDate.scss";

const removeUnnessaryChar = (string) => {
  const decodedString = decodeURI(
    string.replace("+", " ").replace("?", "").replace("&", "")
  );

  if (decodedString.split("zarsrc")?.length > 1) {
    return decodedString.split("zarsrc")[0];
  }

  if (decodedString.split("fbclid")?.length > 1) {
    return decodedString.split("fbclid")[0];
  }

  return decodedString;
};

const SaveTheDate = () => {
  const name = window.location.search || "";
  const decodedName = removeUnnessaryChar(name);

  return (
    <div className="save-the-date">
      <img
        className="save-the-date-photo"
        src="/optimized/save-date-bg.webp"
        alt="Ảnh cưới Quân và Hường"
        width="1400"
        height="1800"
        loading="lazy"
        decoding="async"
      />
      <div className="save-the-date-wrapper paper-card">
        <img
          className="avatar"
          src="/save_date.png"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div className="for-the-wedding">
          <p>For The Wedding Of Us</p>
        </div>
        <SaveTheDateCalendar />
        <div className="invitation">
          <p className="invitation-label">Trân trọng kính mời</p>
          <p className="decoded-name">
            {decodedName ? decodedName : "Bạn và người thương"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaveTheDate;
