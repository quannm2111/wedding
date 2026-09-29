import { lazy, Suspense, useState } from 'react';
import WeddingPage from './components/WeddingPage';
import InvitationEnvelope from './components/InvitationEnvelope';
import './wedding.scss';
const GuestBook = lazy(() => import('./components/guest_book/GuestBook'));
export default function App() {
  const [opened, setOpened] = useState(false);
  return <>
    <InvitationEnvelope opened={opened} onOpen={() => setOpened(true)} />
    <div inert={!opened ? '' : undefined} aria-hidden={!opened ? true : undefined} className="invitation-page"><WeddingPage /><Suspense fallback={null}><GuestBook /></Suspense>
    </div>
  </>;
}
