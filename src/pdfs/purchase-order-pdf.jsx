/* eslint-disable react/prop-types */
import { Page, Font, Document } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fNumber, fCurrency } from 'src/utils/format-number';

import { PDFTitle, PDFHeader, PDFStyles, NewPDFTable } from 'src/pdfs/common';

import PDFBillToSection from './common/PDFBillTo';

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

export default function PurchaseOrderPdf({ purchaseOrder, tenant }) {
  const {
    vendor,
    partLocation,
    orderDate,
    createdAt,
    lines = [],
    subtotal = 0,
    discount = 0,
    discountType,
    shipping = 0,
    tax = 0,
    taxType,
    total = 0,
    _id,
  } = purchaseOrder || {};

  const displayDate = orderDate || createdAt;

  const columns = [
    { header: 'S.No', accessor: 'sno', width: '8%' },
    { header: 'Part', accessor: 'part', width: '32%' },
    { header: 'Qty Ordered', accessor: 'qtyOrdered', width: '15%', align: 'right' },
    { header: 'Qty Received', accessor: 'qtyReceived', width: '15%', align: 'right' },
    {
      header: 'Unit Cost (₹)',
      accessor: 'unitCost',
      width: '15%',
      align: 'right',
      formatter: (v) => fCurrency(v || 0),
    },
    {
      header: 'Amount (₹)',
      accessor: 'amount',
      width: '15%',
      align: 'right',
      formatter: (v) => fCurrency(v || 0),
      showTotal: true,
    },
  ];

  const data = lines.map((line, index) => ({
    sno: index + 1,
    part: `${line.part?.name || '-'}${line.part?.partNumber ? ` (${line.part.partNumber})` : ''}`,
    qtyOrdered: fNumber(line.quantityOrdered || 0),
    qtyReceived: fNumber(line.quantityReceived || 0),
    unitCost: line.unitCost || 0,
    amount: line.amount || (line.quantityOrdered || 0) * (line.unitCost || 0),
  }));

  const extraRows = [];

  extraRows.push({
    cells: [
      { startIndex: 0, colspan: 4, value: '', align: 'left' },
      { startIndex: 4, colspan: 1, value: 'Subtotal', align: 'right' },
      { startIndex: 5, colspan: 1, value: fCurrency(subtotal), align: 'right' },
    ],
    highlight: false,
  });

  if (discount > 0) {
    extraRows.push({
      cells: [
        { startIndex: 0, colspan: 4, value: '', align: 'left' },
        {
          startIndex: 4,
          colspan: 1,
          value: `Discount${
            discountType === 'percentage' ? ` (${discount}%)` : ''
          }`,
          align: 'right',
        },
        { startIndex: 5, colspan: 1, value: `- ${fCurrency(discount)}`, align: 'right' },
      ],
      highlight: false,
    });
  }

  if (shipping > 0) {
    extraRows.push({
      cells: [
        { startIndex: 0, colspan: 4, value: '', align: 'left' },
        { startIndex: 4, colspan: 1, value: 'Shipping', align: 'right' },
        { startIndex: 5, colspan: 1, value: fCurrency(shipping), align: 'right' },
      ],
      highlight: false,
    });
  }

  if (tax > 0) {
    extraRows.push({
      cells: [
        { startIndex: 0, colspan: 4, value: '', align: 'left' },
        {
          startIndex: 4,
          colspan: 1,
          value: `Tax${taxType === 'percentage' ? ` (${tax}%)` : ''}`,
          align: 'right',
        },
        { startIndex: 5, colspan: 1, value: fCurrency(tax), align: 'right' },
      ],
      highlight: false,
    });
  }

  extraRows.push({
    cells: [
      { startIndex: 0, colspan: 4, value: '', align: 'left' },
      { startIndex: 4, colspan: 1, value: 'Total', align: 'right' },
      { startIndex: 5, colspan: 1, value: fCurrency(total), align: 'right' },
    ],
    highlight: true,
  });

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page}>
        <PDFTitle title="Purchase Order" />
        <PDFHeader company={tenant} />

        <PDFBillToSection
          title="Vendor"
          billToDetails={[
            vendor?.name,
            vendor?.address,
            vendor?.phone,
          ]}
          metaDetails={[
            ['PO No.', _id],
            ['Date', displayDate && fDate(displayDate)],
            ['Location', partLocation?.name],
          ]}
        />

        <NewPDFTable
          columns={columns}
          data={data}
          showTotals
          totalRowLabel="TOTAL"
          extraRows={extraRows}
        />
      </Page>
    </Document>
  );
}

