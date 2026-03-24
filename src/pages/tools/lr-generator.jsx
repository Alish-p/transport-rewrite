import { Helmet } from 'react-helmet-async';

import { HomeLRGenerator } from 'src/sections/home/home-lr-generator';

// ----------------------------------------------------------------------

const metadata = {
  title: 'Free LR Generator - Create Lorry Receipts Online | Tranzit',
  description:
    'Generate professional lorry receipts (LR) for free. Fill in company, consignor, consignee, vehicle, and goods details to download a ready-to-use PDF.',
};

export default function LRGeneratorPage() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <HomeLRGenerator />
    </>
  );
}
