import { useEffect, useState } from "react";

const TARGET = new Date("2026-10-24T10:00:00+07:00");

const pad = (value) => String(value).padStart(2, "0");

const getRemaining = () => {
  const diff = Math.max(0, TARGET.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
    done: diff <= 0,
  };
};

const Countdown = () => {
  const [time, setTime] = useState(getRemaining);

  useEffect(() => {
    const id = window.setInterval(() => setTime(getRemaining()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (time.done) {
    return <p className="countdown-done">Hôm nay là ngày vui của chúng mình</p>;
  }

  const units = [
    { label: "Ngày", value: time.days },
    { label: "Giờ", value: time.hours },
    { label: "Phút", value: time.minutes },
    { label: "Giây", value: time.seconds },
  ];

  return (
    <div className="countdown" aria-label="Đếm ngược tới ngày cưới">
      {units.map((unit) => (
        <div className="countdown-unit" key={unit.label}>
          <strong>{pad(unit.value)}</strong>
          <span>{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
