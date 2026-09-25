import useInView from "../../hooks/useInView";
import "./contact.scss";

const EVENTS = [
  {
    title: "Lễ Thành Hôn",
    venue: "Trung tâm Hội nghị Tiệc cưới Khách sạn A15",
    address: "55 Trần Hòa, Định Công, Hoàng Mai, Hà Nội",
    time: "Vào lúc 11 giờ 00 phút",
    weekday: "Chủ Nhật",
    dayMonth: "25/10",
    year: "2026",
    query: "Khách sạn A15, 55 Trần Hòa, Định Công, Hoàng Mai, Hà Nội",
  },
  {
    title: "Lễ Vu Quy",
    venue: "Thôn Phú Xuân",
    address: "Xã Thọ Phú, huyện Triệu Sơn, Thanh Hóa",
    time: "Vào lúc 10 giờ 00 phút",
    weekday: "Thứ Bảy",
    dayMonth: "24/10",
    year: "2026",
    query: "Thôn Phú Xuân, xã Thọ Phú, huyện Triệu Sơn, Thanh Hóa",
  },
];

const embedUrl = (query) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=vi&z=16&output=embed`;

const directionsUrl = (query) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

const EventCard = ({ event }) => {
  const [mapRef, showMap] = useInView({ rootMargin: "200px", once: true, threshold: 0 });

  return (
    <article className="event-card">
      <img
        className="event-avatar"
        src="/save_date.png"
        alt="Quân và Hường"
        width="160"
        height="160"
        loading="lazy"
        decoding="async"
      />
      <h2>{event.title}</h2>
      <p className="event-venue">{event.venue}</p>
      <p className="event-address">{event.address}</p>
      <p className="event-time">{event.time}</p>
      <div className="event-date">
        <span>{event.weekday}</span>
        <strong>{event.dayMonth}</strong>
        <em>{event.year}</em>
      </div>
      <div className="event-map-box" ref={mapRef}>
        {showMap ? (
          <iframe
            title={`Bản đồ ${event.title}`}
            src={embedUrl(event.query)}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="event-map-placeholder">Đang tải bản đồ…</div>
        )}
      </div>
      <a
        className="event-map-btn"
        href={directionsUrl(event.query)}
        target="_blank"
        rel="noreferrer"
      >
        Chỉ đường
      </a>
    </article>
  );
};

const Contact = () => {
  return (
    <div className="event-section">
      <div className="event-grid">
        {EVENTS.map((event) => (
          <EventCard key={event.title} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Contact;
