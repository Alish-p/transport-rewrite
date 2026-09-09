import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import WhatsAppInboxView from 'src/sections/whatsapp/view/whatsapp-inbox-view';

// ----------------------------------------------------------------------

const metadata = { title: `WhatsApp | Dashboard - ${CONFIG.site.name}` };

export default function WhatsAppPage() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <WhatsAppInboxView />
    </>
  );
}
