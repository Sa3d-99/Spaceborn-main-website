import type { Metadata } from 'next';
import HomePage from '../components/HomePage';

export const metadata: Metadata = {
  description: 'Spaceborn connects AI, software, simulation, and hardware to help teams build, test, and deploy autonomous machines with less repeated engineering.',
};

export default function Page() {
  return <HomePage />;
}
