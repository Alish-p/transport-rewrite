/* eslint-disable react/prop-types */
import StandardESignedLRPDF from 'src/pdfs/templates/lr/standard-esigned-lr-pdf';
import Template1ESignedLRPDF from 'src/pdfs/templates/lr/template-1-esigned-lr-pdf';

export default function ESignedLRPDF({ subtrip, tenant, mapImageUrl, ...props }) {
  const template = tenant?.config?.subtrip?.lrTemplate || 'standard';

  if (template === 'template-1') {
    return (
      <Template1ESignedLRPDF
        subtrip={subtrip}
        tenant={tenant}
        mapImageUrl={mapImageUrl}
        {...props}
      />
    );
  }

  return (
    <StandardESignedLRPDF
      subtrip={subtrip}
      tenant={tenant}
      mapImageUrl={mapImageUrl}
      {...props}
    />
  );
}
