import { lazy, Suspense, useEffect, useState } from 'react';
import { calendarDays, dateLabel, getCountdown, wedding } from '../wedding';
import Reveal from './Reveal';
import WeddingCalendar from './WeddingCalendar';
import StoryTimeline from './StoryTimeline';
const WeddingAlbum = lazy(() => import('./wedding_album/WeddingAlbum'));
function Countdown() {
  const [remaining, setRemaining] = useState(getCountdown);
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  if (remaining.done) return <p className="countdown-message">{remaining.isWeddingDay ? 'Hôm nay là ngày vui của chúng mình' : 'Cảm ơn bạn đã cùng chúng mình lưu giữ ngày hạnh phúc'}</p>;
  return <div className="wedding-countdown" aria-label="Đếm ngược tới ngày cưới">{[['days', 'Ngày'], ['hours', 'Giờ'], ['minutes', 'Phút'], ['seconds', 'Giây']].map(([key, label]) => <div key={key}><strong>{String(remaining[key]).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>;
}
function SectionHeading({ eyebrow, title, children }) {
  return <Reveal className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><span className="heading-flourish" aria-hidden="true">✧</span>{children}</Reveal>;
}
function Ceremony({ title, event }) {
  const date = new Date(event.startsAt);
  const format = options => new Intl.DateTimeFormat('vi-VN', { ...options, timeZone: wedding.timeZone }).format(date);
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([event.venue, event.address].filter(Boolean).join(', '))}`;
  return <article className="venue" aria-label={title}>
    <div className="ceremony-date" aria-hidden="true"><strong>{format({ day: '2-digit' })}</strong><span>THÁNG {format({ month: 'numeric' })}</span></div>
    <h3>{title}</h3>
    <p className="event-time">{format({ hour: '2-digit', minute: '2-digit', hour12: false })} · {format({ weekday: 'long' })} · {format({ day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
    {event.venue && <p className="event-venue">{event.venue}</p>}
    <p>{event.address}</p>
    <a className="button" href={directions} target="_blank" rel="noreferrer" aria-label={`Chỉ đường đến ${title}`}>Chỉ đường <span aria-hidden="true">↗</span></a>
  </article>;
}
export default function WeddingPage() {
  const calendar = calendarDays();
  return <main>
    <section className="wedding-hero" id="HomepageSection" aria-label="Thiệp cưới Quân và Hường">
      <div className="hero-backdrop" style={{ backgroundImage: `url("${wedding.images.desktop}")` }} aria-hidden="true" />
      <div className="hero-veil" />
      <div className="hero-visual">
        <span className="hero-orbit" aria-hidden="true" />
        <picture><source media="(max-width: 430px)" srcSet={wedding.images.mobile} /><img className="hero-photo" src={wedding.images.desktop} alt="Quân và Hường bên nhau" /></picture>
        <div className="hero-memory"><img src={wedding.images.thanks} alt="Khoảnh khắc yêu thương của Quân và Hường" /><span aria-hidden="true">Our forever ♡</span></div>
        <span className="hero-seal" aria-hidden="true">Q <span>♡</span> H</span>
      </div>
      <div className="hero-hearts" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <span key={i} style={{ '--i': i }}>♡</span>)}</div>
      <div className="hero-topline"><span>Q <i>&</i> H</span><span></span></div>
      <div className="hero-copy"><div className="hero-copy-ornament" aria-hidden="true">♡</div><p className="eyebrow">Save our date</p><h1>{wedding.groom.shortName} <span><br/>&<br/></span> {wedding.bride.shortName}</h1><p className="hero-vow">Một lời hẹn ước, một đời có nhau.</p><p className="hero-date">{dateLabel.replaceAll('/', ' . ')}</p><Countdown /><a className="button hero-link" href="#InvitationSection">Xem lời mời <span aria-hidden="true">↓</span></a></div>
      <div className="hero-footnote">MỘT NGÀY ĐẶC BIỆT · MỘT ĐỜI CÓ NHAU</div>
    </section>
    <section className="invitation section-wrap" id="InvitationSection">
      <Reveal className="invitation-card"><span className="ornament" aria-hidden="true">♡</span><p className="eyebrow">Together with our families</p><h2>Trân trọng kính mời</h2><p className="invitation-text">{wedding.invitation}</p><div className="invitation-names"></div><p className="small-caps"></p></Reveal>
    </section>
    <section className="couple-section section-wrap" id="CoupleImageSection">
      <SectionHeading eyebrow="The bride & groom" title="Chúng mình" />
      <div className="person-grid">{[wedding.groom, wedding.bride].map((person, index) => <Reveal key={person.role} delay={index * 140}><article className="person-card"><div className="person-photo"><img src={person.image} alt={person.name} loading="lazy" width="800" height="1000" /></div><div className="person-copy"><p className="eyebrow">{person === wedding.groom ? 'Nhà trai' : 'Nhà gái'}</p><h3>{person.name}</h3><span className="person-divider" aria-hidden="true">♡</span><p>Ông <strong>{person.father}</strong></p><p>Bà <strong>{person.mother}</strong></p></div></article></Reveal>)}</div>
    </section>
    <section className="date-section" id="SaveTheDateSection"><div className="section-wrap"><SectionHeading eyebrow="A day to remember" title="Ngày chung đôi" /><div className="celebration-grid"><Reveal className="date-card"><WeddingCalendar /></Reveal><div className="ceremony-list"><Reveal delay={100}><Ceremony title="Lễ vu quy" event={wedding.vuQuy} /></Reveal><Reveal delay={180}><Ceremony title="Lễ thành hôn" event={wedding} /></Reveal></div></div></div></section>
    <section className="story-section section-wrap" id="TimelineSection"><SectionHeading eyebrow="Our love story" title="Hành trình có nhau" /><StoryTimeline /></section>
    <section className="album-section section-wrap" id="WeddingAlbumSection"><SectionHeading eyebrow="Our moments" title="Khoảnh khắc yêu thương"><p className="section-intro">Một chút ngọt ngào, một chút bình yên. Và thật nhiều yêu thương.</p></SectionHeading><Reveal threshold={0.01}><Suspense fallback={<p className="album-placeholder">Đang tải album…</p>}><WeddingAlbum /></Suspense></Reveal></section>
    <section className="thanks-banner" id="ThankYouSection" aria-labelledby="thanks-title">
      <div className="thanks-backdrop" style={{ backgroundImage: `url("${wedding.images.thanks}")` }} aria-hidden="true" />
      <div className="thanks-veil" />
      <Reveal className="thanks-portrait">
        <div className="thanks-photo-wrap"><img src={wedding.images.thanks} alt="Ảnh cưới của Quân và Hường" loading="lazy" width="1600" height="2400" /></div>
        <div className="thanks-photo-note"><span aria-hidden="true">♡</span><span>Hẹn gặp trong ngày hạnh phúc</span></div>
      </Reveal>
      <Reveal className="thanks-copy">
        <span className="thanks-ornament" aria-hidden="true">♡</span>
        <p className="eyebrow">With love & gratitude</p>
        <h2 id="thanks-title">Cảm ơn bạn</h2>
        <p className="thanks-message">{wedding.thanks}</p>
        <div className="thanks-signoff"><span className="small-caps">THƯƠNG MẾN TỪ</span><div className="signature">{wedding.groom.shortName} <br /> & <br /> {wedding.bride.shortName}</div></div>
        <div className="thanks-date"><span aria-hidden="true">✧</span><span>{dateLabel.replaceAll('/', ' . ')}</span><span aria-hidden="true">✧</span></div>
      </Reveal>
    </section>
    <footer>QUÂN & HƯỜNG <span aria-hidden="true">♡</span> {calendar.year}</footer>
  </main>;
}
