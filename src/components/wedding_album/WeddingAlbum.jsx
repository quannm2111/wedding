import { useEffect, useRef, useState } from 'react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import Reveal from '../Reveal';
import useMediaQuery from '../../hooks/useMediaQuery';
import { wedding } from '../../wedding';
import { weddingImageRatios } from '../../generated/weddingAlbum';

const PAGE_SIZE = 8;
export default function WeddingAlbum() {
  const desktop = useMediaQuery('(min-width: 1024px)');
  const tablet = useMediaQuery('(min-width: 768px)');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [imageRatios, setImageRatios] = useState(weddingImageRatios);
  const gallery = useRef(null);
  const nextFocus = useRef(null);
  const photos = wedding.album.slice(0, visibleCount);
  const groups = Array.from({ length: Math.ceil(photos.length / PAGE_SIZE) }, (_, i) => photos.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE));
  useEffect(() => {
    if (nextFocus.current === null) return;
    gallery.current?.querySelector(`[data-photo-index="${nextFocus.current}"]`)?.focus({ preventScroll: true });
    if (nextFocus.current === 0) {
      gallery.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    }
    nextFocus.current = null;
  }, [visibleCount]);
  const open = index => Fancybox.show(photos.map(src => ({ src, type: 'image' })), {
    startIndex: index, Toolbar: { display: { left: [], middle: [], right: ['iterateZoom', 'close'] } },
  });
  if (!photos.length) return <p>Album ảnh cưới đang được cập nhật.</p>;
  return <div ref={gallery} className="album-collection" role="region" aria-label="Album ảnh cưới">
    <div id="album-photo-grid" className="album-batches">
      {groups.map((group, batch) => {
        const renderPhoto = local => {
          if (!group[local]) return null;
          const index = batch * PAGE_SIZE + local;
          return <div key={index} className="album-grid-cell">
            <Reveal threshold={0.05} delay={0} mobileFrom={local % 2 ? 'left' : 'right'}>
              <button className="album-grid-photo" data-photo-index={index} type="button" aria-label={`Phóng to ảnh ${index + 1}`} onClick={() => open(index)}>
                <img src={group[local]} alt={`Ảnh cưới của Quân và Hường ${index + 1}`} width="1600" height={1600 * (imageRatios[group[local]] || 1.5)} loading="lazy" decoding="async" onLoad={event => {
                  const image = event.currentTarget;
                  const ratio = image.naturalHeight / image.naturalWidth;
                  if (Number.isFinite(ratio) && ratio > 0) setImageRatios(previous => previous[group[local]] === ratio ? previous : { ...previous, [group[local]]: ratio });
                }} />
                <span className="album-grid-zoom" aria-hidden="true">⤢</span>
              </button>
            </Reveal>
          </div>;
        };
        const complete = group.length === PAGE_SIZE;
        let columns;
        if (desktop && complete) columns = [[0], [1, 2], [3, 4], [5, 6, 7]];
        else if (tablet) {
          const count = Math.min(desktop ? 4 : 3, group.length);
          let cursor = 0;
          columns = Array.from({ length: count }, (_, i) => {
            const size = Math.floor(group.length / count) + (i >= count - group.length % count ? 1 : 0);
            return Array.from({ length: size }, () => cursor++);
          });
        } else columns = [complete ? [1, 4, 6] : [0, 2, 4, 6], complete ? [2, 3, 5, 7] : [1, 3, 5, 7]]
          .map(column => column.filter(i => group[i])).filter(column => column.length);
        const totalRatio = column => column.reduce((sum, i) => sum + (imageRatios[group[i]] || 1.5), 0);
        const metrics = columns.map(column => ({ ratio: totalRatio(column), gaps: column.length - 1 }));
        const weight = metrics.reduce((sum, item) => sum + 1 / item.ratio, 0);
        const gapWeight = metrics.reduce((sum, item) => sum + item.gaps / item.ratio, 0);
        // Solve a shared height for every column, including its internal gaps.
        const columnStyle = { gridTemplateColumns: metrics.map(item => {
          const share = (1 / item.ratio) / weight;
          const adjustment = gapWeight * share - item.gaps / item.ratio;
          return `calc((100% - var(--photo-gap) * ${columns.length - 1}) * ${share} + var(--photo-gap) * ${adjustment})`;
        }).join(' ') };
        return <div key={batch} className={`album-batch ${complete ? 'is-complete' : 'is-partial'}`}>
          {complete && !tablet && <div className="album-lead">{renderPhoto(0)}</div>}
          <div className="album-columns" style={columnStyle}>
            {columns.map((column, i) => <div key={i} className="album-column">{column.map(renderPhoto)}</div>)}
          </div>
        </div>;
      })}
    </div>
    <p className="album-load-status" role="status">Đang hiển thị {photos.length} trên {wedding.album.length} ảnh</p>
    <div className="album-actions">
    {photos.length < wedding.album.length && <button className="album-load-more" type="button" aria-controls="album-photo-grid" onClick={() => {
      nextFocus.current = photos.length;
      setVisibleCount(count => Math.min(count + PAGE_SIZE, wedding.album.length));
    }}><span className="album-more-label">Xem thêm</span><svg className="album-more-arrow" width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true"><path d="M10 3v17m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
    {photos.length > PAGE_SIZE && <button className="album-load-more" type="button" aria-controls="album-photo-grid" onClick={() => {
      nextFocus.current = 0;
      setVisibleCount(PAGE_SIZE);
    }}><span className="album-more-label">Thu gọn</span><svg className="album-more-arrow" width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true"><path d="M10 21V4m-6 6 6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
    </div>
  </div>;
}
