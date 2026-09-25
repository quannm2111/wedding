import Countdown from "../countdown/Countdown";
import "./hero.scss";

const Hero = () => {
  return (
    <div className="hero">
      <picture>
        <source
          media="(max-width: 430px)"
          srcSet="/optimized/hero-mobile.webp"
          type="image/webp"
        />
        <img
          className="hero-media"
          src="/optimized/hero-desktop.webp"
          alt="Quân và Hường"
          width={1920}
          height={1280}
          decoding="async"
        />
      </picture>
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-kicker">Save the date</p>
        <h1 className="hero-names">
          Quân <span>&</span> Hường
        </h1>
        <p className="hero-date">25 · 10 · 2026</p>
        <Countdown />
        <a className="hero-cta" href="#SaveTheDateSection">
          Xem thiệp mời
        </a>
      </div>
    </div>
  );
};

export default Hero;
