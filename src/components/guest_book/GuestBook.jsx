import { useCallback, useEffect, useRef, useState } from 'react';
import { addGuestCommentFireBase, getGuestCommentFireBase } from '../../api';
import { isFirebaseConfigured } from '../../firebase/firebaseConfig';
import { AVATAR_COLORS, validateWish, WISH_SUGGESTIONS } from '../../guestbook';
import { wedding } from '../../wedding';

const formatDate = value => {
  const date = value?.toDate?.();
  return date ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short', timeZone: wedding.timeZone }).format(date) : 'Vừa gửi';
};

export default function GuestBook() {
  const dialog = useRef(null);
  const launcher = useRef(null);
  const messageRef = useRef(null);
  const sendingRef = useRef(false);
  const requestRef = useRef(0);
  const retryCursor = useRef(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');
  const [sendError, setSendError] = useState('');
  const invalidateRequests = useCallback(() => { requestRef.current += 1; }, []);

  const fetchPage = useCallback(async (after = null) => {
    if (!isFirebaseConfigured) return;
    const request = ++requestRef.current;
    retryCursor.current = after;
    setLoading(true); setLoadError('');
    try {
      const page = await getGuestCommentFireBase(after);
      if (request !== requestRef.current) return;
      setItems(previous => after ? [...new Map([...previous, ...page.items].map(item => [item.id, item])).values()] : page.items);
      setCursor(page.cursor); setHasMore(page.hasMore);
    } catch {
      if (request === requestRef.current) setLoadError('Chưa tải được lời chúc. Bạn thử lại nhé.');
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const node = dialog.current;
    const trigger = launcher.current;
    node.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    fetchPage();
    return () => {
      invalidateRequests();
      node.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open, fetchPage, invalidateRequests]);

  const submit = async event => {
    event.preventDefault();
    if (sendingRef.current || !isFirebaseConfigured) return;
    setNotice(''); setSendError('');
    let payload;
    try { payload = validateWish(name, message); } catch (error) { setSendError(error.message); return; }
    if (!navigator.onLine) { setSendError('Bạn đang mất kết nối mạng. Lời chúc vẫn được giữ để gửi lại.'); return; }
    sendingRef.current = true; setSending(true);
    try {
      await addGuestCommentFireBase(payload);
      setMessage(''); setNotice('Đã gửi lời chúc. Cảm ơn tình cảm của bạn!');
      await fetchPage();
    } catch { setSendError('Chưa gửi được lời chúc. Nội dung vẫn được giữ, bạn hãy thử lại.'); }
    finally { sendingRef.current = false; setSending(false); }
  };
  const trapFocus = event => {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(dialog.current.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex="0"]'));
    const first = focusable[0]; const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };
  return <>
    <button ref={launcher} className="button wish-launcher" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog"><span aria-hidden="true">♡</span> Gửi lời chúc</button>
    <dialog ref={dialog} className="wish-dialog" aria-labelledby="wish-title" onCancel={event => { event.preventDefault(); setOpen(false); }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setOpen(false); } }} onKeyDown={trapFocus}>
      <div className="wish-shell"><header className="wish-header"><h2 id="wish-title">Lời chúc yêu thương</h2><button type="button" aria-label="Đóng lời chúc" onClick={() => setOpen(false)}>×</button></header><div className="wish-content">
        {!isFirebaseConfigured && <p className="wish-notice" role="status">Sổ lời chúc chưa được kết nối. Bạn ghé lại sau để gửi lời chúc nhé!</p>}
        <div className="wish-list" aria-label="Các lời chúc" tabIndex="0" aria-busy={loading}>
          {!loading && !loadError && isFirebaseConfigured && !items.length && <p className="wish-notice">Hãy là người đầu tiên gửi lời chúc tới chúng mình!</p>}
          {items.map(item => <article className="wish-item" key={item.id}><span className="avatar" aria-hidden="true" style={{ backgroundColor: AVATAR_COLORS.includes(item.avatar_color) ? item.avatar_color : AVATAR_COLORS[0] }}>{Array.from(item.guest_name.trim())[0]?.toLocaleUpperCase('vi-VN')}</span><div><h3>{item.guest_name}</h3><time dateTime={item.create_date?.toDate?.().toISOString()}>{formatDate(item.create_date)}</time><p>{item.message}</p></div></article>)}
        </div>
        {loading && <p className="wish-notice" role="status">Đang tải lời chúc…</p>}
        {loadError && <div className="wish-notice wish-error" role="alert">{loadError}<button className="wish-more" type="button" disabled={loading} onClick={() => fetchPage(retryCursor.current)}>Thử tải lại</button></div>}
        {hasMore && !loadError && <button className="wish-more" type="button" disabled={loading} onClick={() => fetchPage(cursor)}>Xem thêm</button>}
        <form className="wish-form" onSubmit={submit}>
          <label htmlFor="wish-name">Tên của bạn</label><input id="wish-name" autoComplete="name" value={name} onChange={event => setName(event.target.value)} required maxLength={80} disabled={sending} />
          <div className="wish-message-label"><label htmlFor="wish-message">Lời chúc của bạn</label><button type="button" aria-expanded={suggestions} aria-controls="wish-suggestions" onClick={() => setSuggestions(value => !value)} disabled={sending}>💡 Gợi ý lời chúc</button></div>
          {suggestions && <div className="wish-suggestions" id="wish-suggestions">{WISH_SUGGESTIONS.map(text => <button type="button" key={text} onClick={() => { setMessage(text); setSuggestions(false); messageRef.current?.focus(); }}>{text}</button>)}</div>}
          <textarea ref={messageRef} id="wish-message" value={message} onChange={event => setMessage(event.target.value)} required maxLength={1000} disabled={sending} placeholder="Gửi một chút yêu thương đến chúng mình…" />
          {notice && <p className="wish-notice" role="status">{notice}</p>}{sendError && <p className="wish-notice wish-error" role="alert">{sendError}</p>}
          <button className="button" type="submit" disabled={!isFirebaseConfigured || sending}>{sending ? 'Đang gửi…' : 'Gửi lời chúc ♡'}</button>
        </form>
      </div></div>
    </dialog>
  </>;
}
