import useInView from "../../hooks/useInView";
import Fancybox from "../FancyBox";
import "./CoupleImage.scss";

const PersonCard = ({ href, src, alt, caption, name, father, mother }) => (
  <article className="couple-card">
    <a href={href} data-fancybox="couple" data-caption={caption}>
      <img
        alt={alt}
        src={src}
        width="800"
        height="1000"
        className="couple-img"
        loading="lazy"
        decoding="async"
      />
    </a>
    <div>
      <div className="couple-names">{name}</div>
      <p>Con ông:</p>
      <p className="text-bold">{father}</p>
      <p>Con bà:</p>
      <p className="text-bold">{mother}</p>
    </div>
  </article>
);

const MobieView = () => {
  const [titleRef, isInView] = useInView({ once: true });

  return (
    <div className="couple-container">
      <div className="couple-header">
        <Fancybox options={{ Carousel: { infinite: false } }}>
          <PersonCard
            href="/optimized/groom-lg.webp"
            src="/optimized/groom.webp"
            alt="Chú rể Nguyễn Mạnh Quân"
            caption="Chú rể : Nguyễn Mạnh Quân"
            name="Nguyễn Mạnh Quân"
            father="NGÔ ANH TUẤN"
            mother="NGUYỄN BÍCH HỢP"
          />
          <PersonCard
            href="/optimized/bride-lg.webp"
            src="/optimized/bride.webp"
            alt="Cô dâu Trần Mai Hường"
            caption="Cô dâu : Trần Mai Hường"
            name="Trần Mai Hường"
            father="HOÀNG MINH TUÂN"
            mother="VŨ THỊ KIM THANH"
          />
        </Fancybox>
      </div>
      <div
        ref={titleRef}
        className={isInView ? "couple-title reveal" : "couple-title"}
      >
        We are Getting Married
      </div>
    </div>
  );
};

export default MobieView;
