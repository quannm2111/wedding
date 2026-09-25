import useInView from "../../hooks/useInView";
import "./WeddingAlbum.scss";

const ToolBox = () => {
  const [iconRef, isInView] = useInView({ once: true });

  return (
    <div className="tool-box-wrapper">
      <div className="hint">
        <img
          ref={iconRef}
          src="/icon/click.svg"
          className={isInView ? "pulse-soft" : ""}
          width={50}
          height={50}
          alt=""
        />
        <p>Kéo góc trang để lật album, nhấn ảnh để xem phóng to</p>
      </div>
    </div>
  );
};

export default ToolBox;
