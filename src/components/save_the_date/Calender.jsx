import "./SaveTheDate.scss";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const YEAR = 2026;
const MONTH = 9; // October (0-indexed)
const WEDDING_DAY = 25;

const SaveTheDateCalendar = () => {
  const firstWeekday = new Date(YEAR, MONTH, 1).getDay();
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <div className="calender-place-holder">
      <h3>Tháng 10, 2026</h3>
      <div className="calender">
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
        {cells.map((day, index) =>
          day === WEDDING_DAY ? (
            <div className="heart-container" key="wedding-day">
              <span className="text">{day}</span>
            </div>
          ) : (
            <div key={`${day ?? "empty"}-${index}`}>{day ?? ""}</div>
          )
        )}
      </div>
    </div>
  );
};

export default SaveTheDateCalendar;
