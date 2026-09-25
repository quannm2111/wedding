import { useState } from "react";
import useInView from "../../hooks/useInView";
import "./WeddingBox.scss";

const WeddingBox = () => {
  const [titleRef, isInView] = useInView({ once: true });
  const [copied, setCopied] = useState(false);

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText("0869616809");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="wedding-box-container">
      <div className="wedding-box paper-card">
        <div className="title-wrapper">
          <span ref={titleRef} className={isInView ? "reveal" : ""}>
            Hộp mừng cưới
          </span>
        </div>
        <p className="des">
          Nếu có thể, bạn hãy tới tham dự đám cưới, chung vui và mừng cưới trực
          tiếp cho chúng mình nha.
        </p>
        <div className="qr-card">
          <img
            alt="Mã QR chuyển khoản"
            className="qr-image"
            height="180"
            src="/qr_code.png"
            width="180"
            loading="lazy"
            decoding="async"
          />
          <p className="bank-des">Timo Digital Bank by BVBBank</p>
          <p className="bank-des">HOANG THANH HUYEN</p>
          <p className="bank-des">STK: 0869616809</p>
          <button type="button" className="copy-btn" onClick={copyAccount}>
            {copied ? "Đã sao chép" : "Sao chép STK"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeddingBox;
