import { lazy, Suspense } from 'react';
import WeddingPage from './components/WeddingPage';
import './wedding.scss';
const GuestBook = lazy(() => import('./components/guest_book/GuestBook'));
export default function App() {
  return <><WeddingPage /><Suspense fallback={null}><GuestBook /></Suspense></>;
}
