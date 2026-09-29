import Reveal from './Reveal';
import useInView from '../hooks/useInView';
import { wedding } from '../wedding';

function StoryMoment({ event, index }) {
  const [ref, inView] = useInView({ threshold: 0.05 });
  const [lead, ...paragraphs] = event.text.split('\n');

  return <Reveal className={`story-item ${event.weddingDay ? 'story-finale' : ''}`} delay={index % 2 * 100} mobileFrom={index % 2 ? 'right' : 'left'}>
    <span className="story-dot" aria-hidden="true">♡</span>
    <article ref={ref} className={`story-card ${inView ? 'story-in-view' : ''}`} aria-labelledby={`story-title-${index}`}>
      <img className="story-photo" src={event.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className="story-photo-veil" aria-hidden="true" />
      <div className="story-content">
        <span className="story-number" aria-hidden="true">0{index + 1}<span>♡</span></span>
        <h3 id={`story-title-${index}`}>{event.title}</h3>
        <p className="story-lead">{lead}</p>
        {paragraphs.map((paragraph, i) => <p key={i} className={event.weddingDay && i === paragraphs.length - 2 ? 'story-signature' : event.weddingDay && i === paragraphs.length - 1 ? 'story-forever' : 'story-text'}>{paragraph}</p>)}
      </div>
    </article>
  </Reveal>;
}

export default function StoryTimeline() {
  return <div className="story-timeline">{wedding.timeline.map((event, index) => <StoryMoment key={event.title} event={event} index={index} />)}</div>;
}
