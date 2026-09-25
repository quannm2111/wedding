import { useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import useMediaQuery from "../../hooks/useMediaQuery";
import "./WeddingAlbum.scss";

const ALBUM_SRC = [
  "/wedding_album_cover.png",
  "/optimized/album/Album_bia.webp",
  "/optimized/album/Album_01_01.webp",
  "/optimized/album/Album_01_02.webp",
  "/optimized/album/Album_02-01.webp",
  "/optimized/album/Album_02-02.webp",
  "/optimized/album/Album_03-01.webp",
  "/optimized/album/Album_03-02.webp",
  "/optimized/album/Album_04-01.webp",
  "/optimized/album/Album_04-02.webp",
  "/optimized/album/Album_05-01.webp",
  "/optimized/album/Album_05-02.webp",
  "/optimized/album/Album_06-01.webp",
  "/optimized/album/Album_06-02.webp",
  "/optimized/album/Album_07-01.webp",
  "/optimized/album/Album_07-02.webp",
  "/optimized/album/Album_08-01.webp",
  "/optimized/album/Album_08-02.webp",
  "/optimized/album/Album_09-01.webp",
  "/optimized/album/Album_09-02.webp",
  "/optimized/album/Album_10-01.webp",
  "/optimized/album/Album_10-02.webp",
];

const ALBUM_MOBILE_SRC = ALBUM_SRC.slice(1);
const PAGE_WINDOW = 2;

const openAlbum = (sources, index) => {
  Fancybox.show(
    sources.map((src, i) => ({
      src,
      type: "image",
      caption: `Trang ${i + 1}`,
    })),
    { startIndex: index }
  );
};

const FlipBook = () => {
  const isMobile = useMediaQuery("(max-width: 727px)");
  const sources = isMobile ? ALBUM_MOBILE_SRC : ALBUM_SRC;
  const [page, setPage] = useState(0);

  return (
    <div className="flip_book_wrapper">
      <HTMLFlipBook
        width={400}
        height={600}
        {...(!isMobile ? { size: "stretch" } : {})}
        maxShadowOpacity={0.5}
        showPageCorners
        disableFlipByClick
        clickEventForward
        onFlip={(event) => setPage(event.data)}
      >
        {sources.map((src, index) => (
          <div className="demoPage" key={src}>
            {Math.abs(index - page) <= PAGE_WINDOW ? (
              <button
                type="button"
                className="album-zoom"
                onClick={() => openAlbum(sources, index)}
              >
                <img
                  alt={`Trang album ${index + 1}`}
                  src={src}
                  decoding="async"
                />
              </button>
            ) : (
              <div className="page-placeholder" />
            )}
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default FlipBook;
