import useInView from "../../hooks/useInView";
import Fancybox from "../FancyBox";
import "./CoupleImage.scss";

const DesktopView = () => {
  const [titleRef, isInView] = useInView({ once: true });

  return (
    <div className="couple-container">
      <div className="couple-header">
        <Fancybox options={{ Carousel: { infinite: false } }}>
          <a
            href="/optimized/groom-lg.webp"
            data-fancybox="couple"
            data-caption="Chú rể : Nguyễn Mạnh Quân"
          >
            <img
              alt="Chú rể Nguyễn Mạnh Quân"
              src="/optimized/groom.webp"
              width="800"
              height="1000"
              className="couple-img"
              loading="lazy"
              decoding="async"
            />
          </a>
          <a
            href="/optimized/bride-lg.webp"
            data-fancybox="couple"
            data-caption="Cô dâu : Trần Mai Hường"
          >
            <img
              alt="Cô dâu Trần Mai Hường"
              src="/optimized/bride.webp"
              width="800"
              height="1000"
              className="couple-img"
              loading="lazy"
              decoding="async"
            />
          </a>
        </Fancybox>
      </div>
      <div
        ref={titleRef}
        className={isInView ? "couple-title reveal" : "couple-title"}
      >
        We are Getting Married
      </div>
      <div className="couple-parents">
        <div>
          <div className="couple-names">Nguyễn Mạnh Quân</div>
          <p>
            Con ông: <span>NGÔ ANH TUẤN</span>
          </p>
          <p>
            Con bà: <span>NGUYỄN BÍCH HỢP</span>
          </p>
        </div>
        <div>
          <div className="couple-names">Trần Mai Hường</div>
          <p>
            Con ông: <span>HOÀNG MINH TUÂN</span>
          </p>
          <p>
            Con bà: <span>VŨ THỊ KIM THANH</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesktopView;
