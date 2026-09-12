/* eslint-disable react/prop-types */
import StandardLRPDF from 'src/pdfs/templates/lr/standard-lr-pdf';
import Template1LRPDF from 'src/pdfs/templates/lr/template-1-lr-pdf';

export default function LRPDF({ subtrip, tenant, ...props }) {
  const template = tenant?.config?.subtrip?.lrTemplate || 'standard';

  if (template === 'template-1') {
    return <Template1LRPDF subtrip={subtrip} tenant={tenant} {...props} />;
  }

  return <StandardLRPDF subtrip={subtrip} tenant={tenant} {...props} />;
}
