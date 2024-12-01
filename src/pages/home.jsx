import { Helmet } from 'react-helmet-async';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

const metadata = {
  title: 'Transport Plus: Streamline Your Logistics Management',
  description:
    'Transport Plus is your ultimate solution for efficient logistics management, featuring customizable tools and real-time insights to elevate your operations.',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <HomeView />
    </>
  );
}
