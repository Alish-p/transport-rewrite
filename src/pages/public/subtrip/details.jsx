import { useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useSubtrip } from 'src/query/use-subtrip';

import LRPDF from 'src/sections/subtrip/pdfs/lorry-reciept-pdf';

export default function PublicSubtripDetailsPage() {
  const { id } = useParams();

  const { data: subtrip } = useSubtrip(id);

  useEffect(() => {
    const run = async () => {
      if (!subtrip) return;
      try {
        const doc = <LRPDF subtrip={subtrip} tenant={CONFIG.company} />;
        const blob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileBase = subtrip?.subtripNo || id || 'lorry_receipt';
        a.download = `${fileBase}_lr.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (e) {
        // silently fail
        // eslint-disable-next-line no-console
        console.error('Failed to download LR PDF', e);
      }
    };
    run();
  }, [id, subtrip]);

  return null;
}
