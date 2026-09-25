import { calendarDays, wedding } from '../wedding';

const events = [
  { title: 'Lễ vu quy', tone: 'vu-quy', event: wedding.vuQuy },
  { title: 'Lễ thành hôn', tone: 'thanh-hon', event: wedding },
].map(item => {
  const date = new Date(item.event.startsAt);
  const format = options => new Intl.DateTimeFormat('vi-VN', { ...options, timeZone: wedding.timeZone }).format(date);
  return {
    ...item,
    day: Number(format({ day: 'numeric' })),
    month: Number(format({ month: 'numeric' })),
    year: Number(format({ year: 'numeric' })),
    dateLabel: format({ day: '2-digit', month: '2-digit' }),
    time: format({ hour: '2-digit', minute: '2-digit', hour12: false }),
  };
});

function Heart() {
  return <svg viewBox="0 0 50 46" aria-hidden="true"><path d="M25 43 5 24C-10 9 11-9 25 8 39-9 60 9 45 24Z" /></svg>;
}

export default function WeddingCalendar() {
  const calendar = calendarDays();
  return <>
    <div className="calendar-heading">
      <span className="calendar-flourish" aria-hidden="true">♡</span>
      <p className="calendar-title">Tháng {calendar.month}<span>{calendar.year}</span></p>
      <p className="calendar-subtitle">Hai ngày vui · Một đời bên nhau</p>
    </div>
    <div className="wedding-calendar" role="group" aria-label={`Lịch tháng ${calendar.month}, ${calendar.year}`}>
      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => <span className="weekday" key={day}>{day}</span>)}
      {calendar.cells.map((day, i) => {
        const event = events.find(item => item.day === day && item.month === calendar.month && item.year === calendar.year);
        return <span key={i}
          className={event ? `calendar-event ${event.tone} ${event.tone === 'thanh-hon' ? 'wedding-day' : 'vuquy-day'}` : 'calendar-day'}
          aria-label={event ? `${event.title}, ${event.time}, ngày ${event.dateLabel}/${event.year}` : undefined}
          title={event ? `${event.title} · ${event.time} · ${event.dateLabel}` : undefined}>
          {event && <Heart />}<span>{day}</span>
        </span>;
      })}
    </div>
    <div className="calendar-legend" aria-label="Hai ngày lễ">
      {events.map(item => <div className={`calendar-legend-item ${item.tone}`} key={item.tone}>
        <span className="calendar-legend-date"><Heart /><span>{item.day}</span></span>
        <div><strong>{item.title}</strong><span>{item.time} · {item.dateLabel}</span></div>
      </div>)}
    </div>
  </>;
}
