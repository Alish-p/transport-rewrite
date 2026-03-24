import { Helmet } from 'react-helmet-async';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

const metadata = {
  title: 'Tranzit : Streamline Your Logistics Management',
  description:
    'Tranzit is your ultimate solution for efficient logistics management, featuring customizable tools and real-time insights to elevate your operations.',
  keywords: 'logistics management software, transport management system, TMS, transport operations, fleet management, Tranzit',
  author: 'Tranzit',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:site_name" content="Tranzit" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />

      </Helmet>

      <HomeView />
    </>
  );
}
