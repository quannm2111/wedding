import useInView from "../../hooks/useInView";
import "./Thanksyou.scss";

const Thanksyou = () => {
  const [heartRef, isInView] = useInView({ once: true });

  return (
    <div className="thankyou-wrapper">
      <img
        alt="Cảm ơn"
        height="280"
        src="./thank_you.png"
        width="280"
        loading="lazy"
        decoding="async"
      />
      <p>
        Chúng em/mình rất vui và hạnh phúc khi có anh/chị/bạn là một phần của
        ngày đặc biệt này.
      </p>
      <p className="emphasis">
        Hẹn gặp anh/chị/bạn trong ngày vui của tụi em/mình!
      </p>
      <p>Yêu thương nhiều từ Quân & Hường</p>
      <img
        ref={heartRef}
        className={isInView ? "heart-icon pulse-soft" : "heart-icon"}
        src="./hand_drawn_hearts.png"
        width={72}
        height={72}
        alt=""
      />
      <h2>25.10.2026</h2>
    </div>
  );
};

export default Thanksyou;
