/* eslint-disable react/prop-types */
import { Svg, Font, Page, Path, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';

import TenantLogo from 'src/pdfs/common/TenantLogo';

import { loadingWeightUnit } from 'src/sections/vehicle/vehicle-config';

const isBrowser = typeof window !== 'undefined';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: isBrowser ? '/fonts/Roboto-Regular.ttf' : 'public/fonts/Roboto-Regular.ttf' },
    {
      src: isBrowser ? '/fonts/Roboto-Bold.ttf' : 'public/fonts/Roboto-Bold.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontSize: 7,
    fontFamily: 'Roboto',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    padding: 12,
  },
  borderContainer: {
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 6px',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '38%',
  },
  headerAddress: {
    fontSize: 6.5,
    marginLeft: 6,
    lineHeight: 1.25,
    color: '#000000',
  },
  headerCenter: {
    width: '36%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'center',
    color: '#000000',
    letterSpacing: 0.5,
  },
  headerRight: {
    width: '26%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 2,
  },
  contactText: {
    fontSize: 6.5,
    marginLeft: 4,
    color: '#000000',
  },

  // Notice & Legal Bar
  noticeBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
  },
  noticeCol: {
    width: '42%',
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
  },
  noticeTitle: {
    fontSize: 7,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 2,
  },
  noticeText: {
    fontSize: 5.8,
    lineHeight: 1.25,
    textAlign: 'left',
  },
  carrierRiskCol: {
    width: '24%',
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
  },
  carrierRiskTitle: {
    fontSize: 6.8,
    fontWeight: 700,
    marginBottom: 2,
  },
  legalText: {
    fontSize: 6,
    lineHeight: 1.25,
  },
  lrMetaCol: {
    width: '34%',
    padding: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    lineHeight: 1.22,
    marginBottom: 1,
  },
  metaLabel: {
    fontSize: 6,
    color: '#000000',
  },
  metaValue: {
    fontSize: 6,
    fontWeight: 700,
    color: '#000000',
  },

  // Consignor / Consignee / Insurance Bar
  partyBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
  },
  partyCol: {
    width: '38%',
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
  },
  insuranceCol: {
    width: '24%',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyText: {
    fontSize: 6,
    lineHeight: 1.25,
  },
  partyTitle: {
    fontSize: 6.2,
    fontWeight: 700,
  },
  insuranceText: {
    fontSize: 6.2,
    textAlign: 'center',
    lineHeight: 1.25,
  },

  // Goods Table Section
  tableContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
  },
  tableLeftCol: {
    width: '78%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
  },
  tableHeaderRowLeft: {
    flexDirection: 'row',
    height: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    backgroundColor: '#FFFFFF',
  },
  tableBodyRowLeft: {
    flexDirection: 'row',
    height: 180,
  },
  tableTotalRowLeft: {
    flexDirection: 'row',
    height: 26,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderTopStyle: 'solid',
  },
  thCell: {
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2px 2px',
  },
  thText: {
    fontSize: 6.2,
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 1.15,
  },
  tdCol: {
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    paddingTop: 5,
    paddingHorizontal: 2,
  },
  tdText: {
    fontSize: 6.2,
    textAlign: 'center',
    lineHeight: 1.25,
  },
  remarkCell: {
    width: '62%',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    padding: '2px 4px',
    justifyContent: 'center',
  },
  remarkText: {
    fontSize: 6.2,
    fontWeight: 700,
  },
  totalCellBox: {
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1px 2px',
  },
  totalText: {
    fontSize: 6,
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 1.15,
  },

  // Freight & Signatory Column (Right side of table)
  tableRightCol: {
    width: '22%',
    flexDirection: 'column',
  },
  tableHeaderRight: {
    height: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2px 2px',
  },
  tableBodyRight: {
    height: 206, // 180 + 26 = 206
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 3px 6px 3px',
  },
  freightStatusText: {
    fontSize: 7,
    fontWeight: 700,
    textAlign: 'center',
  },
  signatoryContainer: {
    alignItems: 'center',
    marginBottom: 2,
  },
  signatoryCompany: {
    fontSize: 6,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 2,
  },
  signatoryText: {
    fontSize: 6,
    fontWeight: 700,
    textAlign: 'center',
  },

  // Bottom 3-box Grid
  bottomBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
  },
  bankCol: {
    width: '35%',
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
  },
  centerNoteCol: {
    width: '35%',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
  },
  demurrageCol: {
    width: '30%',
    padding: 4,
  },
  bankText: {
    fontSize: 6,
    lineHeight: 1.25,
  },
  centerNoteText: {
    fontSize: 6,
    textAlign: 'center',
    lineHeight: 1.25,
  },
  demurrageTitle: {
    fontSize: 6.2,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 2,
  },
  demurrageText: {
    fontSize: 5.8,
    lineHeight: 1.25,
  },

  // Footer text
  footerBar: {
    padding: '4px 6px',
    minHeight: 28,
  },
  footerText: {
    fontSize: 6,
    fontWeight: 700,
    lineHeight: 1.3,
  },

  // Page 2 styles
  page2Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    paddingBottom: 4,
  },
  page2Title: {
    fontSize: 8.5,
    fontWeight: 700,
  },
  clauseText: {
    fontSize: 6.2,
    lineHeight: 1.35,
    marginBottom: 6,
    textAlign: 'justify',
  },
});

const TERMS_AND_CONDITIONS = [
  '1) The transport operator hereby agrees to hold itself liable directly to the bank concerned, as if the Bank was a party, of the contract contained with right of recourse against the Operator, the full value goods handed over for carriage, storage and Delivery, should a Bank accept this lorry Receipt as a consignee / endorsee or in any other capacity for the purpose of providing advances and / or collection or discounting of bills of its customer, before or after the Transport Operator has been entrusted the goods.',
  '2) The transport Operator undertakes to deliver the goods in the same order and condition as received. The lorry receipt being surrendered to the bank, to its order, or to its assigns, has accepted it for lending and to the collection or discounting of bills of its customers or for collection or to its agents. Only the bank and the holder of the receipt entitled to the delivery as afore said shall have the right of recourse against the operator for any and all claims arising thereon.',
  '3) The right to entrust goods to any other lorry or service for transport of goods shall be with the Transport Operator. If the goods are entrusted by the transport operator to another entity, the other entity shall be considered the transport operator’s agent, and the transport operator, notwithstanding the delivery of goods, the operator will be responsible for the safety of the goods and for their delivery at the destination by the hands of the other carrier referred to as the Transport Operator’s agent.',
  '4) The consignor is the primary payer of all transport and incidental charges, if any, payable to the Transport Operator at their agreed location.',
  '5) Perishable goods lying undelivered after 48 hours of arrival can be disposed of by the Transport Operator’s discretion without prior notice of thereof.',
  '6) Goods lying undelivered can be disposed off by the Transport Operator after 30 days of arrival after delivery to the consignor, bank, and the holder interested with a 15-day notice of such disposal of goods.',
  '7) In either of the case mentioned above, the bank or the relevant authority shall be entitled to the proceeds and the Transport Operator is to render full accounts immediately after sale deducting freight and demurrage',
  '8) The Consignee Bank accepting Lorry Receipt under clause 1 above will not be liable for payment of any charges arising out of any lien of the transport Operator against the consignor or the buyer. the Transport Operator shall deliver the goods unconditionally to the Bank on Payment of the normal freight and storage charges only in connection with the consignment in question, without claiming any lien on the goods in respect of any monies due by the consignor or the consignee to the Transport Operator on any other account whatsoever.',
  '9) Any Statement made in this lorry receipt or at any time in a circumstance regarding this receipt, the Transport Operator shall observe its obligation to the Consignee bank mentioned and will be responsible for safe and due delivery, and for any loss or damage to the goods or consignment, that arises as a result of negligence, default, failure to take reasonable precautions, maladies or criminal or fraudulent actions of the Transport Operator or any of his Managers, Agents, Employees, Partners, Directors, Business Associates, Branches etc.',
  '10) The consignor is responsible for all consequence of any incorrect or false declaration.',
  '11) If the goods have been lost, destroyed, damaged or have deteriorated the compensation payable by the Transport operator shall not exceed the value declared.',
  '12) The consignment shall be detained, re-routed, re-booked without the consignee’s written and explicit permission. Will be delivered at the destination.',
  '13) In case any dispute or difference arises between the parties with regard to the terms and conditions of this agreement or relating to the interpretation thereof and which could not be solved with mutual understanding then both parties require to approach the local jurisdiction selected by transporter to resolve the same with legal procedure.',
];

export default function Template1LRPDF({ subtrip = {}, tenant = {} }) {
  const {
    subtripNo = '197',
    customerId = {},
    consignee = '',
    loadingPoint = '',
    loadingWeight,
    orderNo = '',
    startDate = new Date(),
    unloadingPoint = '',
    materialType = '',
    packagingType = '',
    packaging = '',
    hsnCode = '',
    quantity,
    vehicleId = {},
    freightDetails = {},
    podSignature = '',
    remarks = '',
  } = subtrip;

  const vehicleType = vehicleId?.vehicleType;
  const weightUnit =
    subtrip?.loadingWeightUnit || (vehicleType && loadingWeightUnit[vehicleType]) || 'MTS';

  // Company Details
  const companyName = tenant?.name || 'C & S LOGISTICS';
  const companyPhone = tenant?.contactDetails?.phone || tenant?.phone || '9304791192';
  const companyEmail = tenant?.contactDetails?.email || tenant?.email || 'cslogistics913@gmail.com';

  const addressLine1 =
    typeof tenant?.address === 'string'
      ? tenant.address
      : tenant?.address?.line1 || 'FLAT NO. - 102, SITA TOWER';
  const addressLine2 =
    tenant?.address?.line2 ||
    (typeof tenant?.address === 'string' ? '' : 'PANCHET ROAD, CHIRKUNDA, DHANBAD');
  const cityStatePin =
    tenant?.address?.city || tenant?.address?.state
      ? [
          tenant?.address?.city,
          tenant?.address?.state
            ? `${tenant.address.state}${tenant?.address?.pincode ? ` - ${tenant.address.pincode}` : ''}`
            : tenant?.address?.pincode,
        ]
          .filter(Boolean)
          .join(', ')
      : 'Jharkhand - 828202';

  // Legal Numbers
  const gstNo = tenant?.legalInfo?.gstNumber || tenant?.gstNumber || '20EADPS5035Q1ZE';
  const panNo = tenant?.legalInfo?.panNumber || tenant?.panNumber || 'EADPS5035Q';
  const udyamNo = tenant?.legalInfo?.udyamNumber || tenant?.udyamNo || 'JH-040025552';

  // Consignor
  const consignorName = customerId?.customerName || 'MAA KALYANESHWARI ENTERPRISES';
  const consignorGst = customerId?.GSTNo || '20AAXFM7326C1ZC';
  const consignorMobile = customerId?.cellNo || '';
  const consignorAddress =
    customerId?.address || 'CHIRKUNDA, DHANBAD, JHARKHAND, DHANBAD - 828202, Chirkunda, Jharkhand, India - 828202';

  // Consignee
  const consigneeName = consignee || 'M/S MAA JWALA ENTERPRISES';
  const consigneeAddress =
    unloadingPoint || 'SHAKTINAGAR, SONEBHADRA, UTTAR PRADESH - 231222, SONEBHADRA, UTTAR PRADESH, India - 231222';

  // Bank Details
  const bankName = tenant?.bankDetails?.name || 'ICICI BANK';
  const bankAccNo = tenant?.bankDetails?.accNo || '141005002128';
  const bankIfsc = tenant?.bankDetails?.ifsc || 'ICIC0001410';

  // Weights & Formats
  const formattedActualWeight = loadingWeight ? `${Number(loadingWeight).toFixed(3)} ${weightUnit}` : '35.000 MTS';
  const formattedChargeWeight = loadingWeight ? `${Number(loadingWeight).toFixed(3)} ${weightUnit}` : '35.000 MTS';
  const displayMaterial = materialType || 'AS PER TAX INVOICE';
  const displayPackaging = packagingType || packaging || 'BAGS';
  const displayQuantity = quantity !== undefined && quantity !== null ? quantity : '-';
  const totalQuantity = quantity !== undefined && quantity !== null ? quantity : '0';

  // Locations (extract clean names for From / To to prevent overflow)
  const fromDisplay = loadingPoint
    ? (loadingPoint.split(',')[0] || loadingPoint).trim().toUpperCase()
    : 'CHIRKUNDA';
  const toDisplay = unloadingPoint
    ? (unloadingPoint.split(',')[0] || unloadingPoint).trim().toUpperCase()
    : 'SONEBHADRA';

  return (
    <Document>
      {/* PAGE 1: LORRY RECEIPT DETAILS */}
      <Page size="A4" style={styles.page} orientation="portrait">
        <View style={styles.borderContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TenantLogo tenant={tenant} size={40} />
              <View style={styles.headerAddress}>
                {addressLine1 ? <Text>{addressLine1}</Text> : null}
                {addressLine2 ? <Text>{addressLine2}</Text> : null}
                {cityStatePin ? <Text>{cityStatePin}</Text> : null}
              </View>
            </View>

            <View style={styles.headerCenter}>
              <Text style={styles.companyName}>{companyName}</Text>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.contactItem}>
                <Svg width={7} height={7} viewBox="0 0 24 24">
                  <Path
                    fill="#000000"
                    d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                  />
                </Svg>
                <Text style={styles.contactText}>{companyPhone}</Text>
              </View>
              <View style={styles.contactItem}>
                <Svg width={7} height={7} viewBox="0 0 24 24">
                  <Path
                    fill="#000000"
                    d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  />
                </Svg>
                <Text style={styles.contactText}>{companyEmail}</Text>
              </View>
            </View>
          </View>

          {/* Notice & Meta Bar */}
          <View style={styles.noticeBar}>
            {/* Box 1: Notice */}
            <View style={styles.noticeCol}>
              <Text style={styles.noticeTitle}>Notice</Text>
              <Text style={styles.noticeText}>
                Without the consignee&apos;s written permission this consignment will not be
                diverted, re-routed, or rebooked and it should be delivered at the destination.
                Lorry Receipt will be delivered to the only consignee. Without prior approval, Lorry
                Receipt can not be handover to anyone.
              </Text>
            </View>

            {/* Box 2: AT CARRIER'S RISK */}
            <View style={styles.carrierRiskCol}>
              <Text style={styles.carrierRiskTitle}>AT CARRIER&apos;S RISK</Text>
              <Text style={styles.legalText}>GST No.: {gstNo}</Text>
              <Text style={styles.legalText}>PAN No.: {panNo}</Text>
              <Text style={styles.legalText}>UDYAM Reg. No. : {udyamNo}</Text>
            </View>

            {/* Box 3: LR Meta */}
            <View style={styles.lrMetaCol}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>
                  LR Date: <Text style={styles.metaValue}>{fDate(startDate, 'DD-MM-YYYY') || '09-09-2026'}</Text>
                </Text>
                <Text style={styles.metaLabel}>
                  LR No: <Text style={styles.metaValue}>{subtripNo}</Text>
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>
                  Truck/Vehicle No.:{' '}
                  <Text style={styles.metaValue}>{vehicleId?.vehicleNo || 'JH-10DD-1612'}</Text>
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Transport Mode: By Road</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, { maxWidth: '50%' }]} numberOfLines={1}>
                  From: &ldquo;{fromDisplay}&rdquo;
                </Text>
                <Text style={[styles.metaLabel, { maxWidth: '50%', textAlign: 'right' }]} numberOfLines={1}>
                  To: &ldquo;{toDisplay}&rdquo;
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Delivery Type: Warehouse</Text>
                <Text style={styles.metaLabel}>Payment Status: To be billed</Text>
              </View>
            </View>
          </View>

          {/* Consignor / Consignee / Insurance Bar */}
          <View style={styles.partyBar}>
            {/* Consignor */}
            <View style={styles.partyCol}>
              <Text style={styles.partyText}>
                <Text style={styles.partyTitle}>Consignor: </Text>
                {consignorName}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.partyText}>GST No: {consignorGst}</Text>
                <Text style={styles.partyText}>Mobile: {consignorMobile}</Text>
              </View>
              <Text style={styles.partyText}>
                Address: {consignorAddress}
              </Text>
            </View>

            {/* Consignee */}
            <View style={styles.partyCol}>
              <Text style={styles.partyText}>
                <Text style={styles.partyTitle}>Consignee: </Text>
                {consigneeName}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.partyText}>GST No: -</Text>
                <Text style={styles.partyText}>Mobile: </Text>
              </View>
              <Text style={styles.partyText}>
                Address: {consigneeAddress}
              </Text>
            </View>

            {/* Insurance */}
            <View style={styles.insuranceCol}>
              <Text style={styles.insuranceText}>
                Insurance details is not available or not insured.
              </Text>
            </View>
          </View>

          {/* Goods Table & Freight Box Section */}
          <View style={styles.tableContainer}>
            {/* Left Section: Columns 1 to 7 */}
            <View style={styles.tableLeftCol}>
              {/* Header Row (Left) */}
              <View style={styles.tableHeaderRowLeft}>
                <View style={[styles.thCell, { width: '6.5%' }]}>
                  <Text style={styles.thText}>Sr no.</Text>
                </View>
                <View style={[styles.thCell, { width: '28.5%' }]}>
                  <Text style={styles.thText}>Product / Material</Text>
                </View>
                <View style={[styles.thCell, { width: '16%' }]}>
                  <Text style={styles.thText}>Packaging Type</Text>
                  <Text style={styles.thText}>(LxBxH)</Text>
                </View>
                <View style={[styles.thCell, { width: '11%' }]}>
                  <Text style={styles.thText}>HSN Code</Text>
                </View>
                <View style={[styles.thCell, { width: '12.5%' }]}>
                  <Text style={styles.thText}>Articles</Text>
                  <Text style={styles.thText}>Packages</Text>
                </View>
                <View style={[styles.thCell, { width: '12.75%' }]}>
                  <Text style={styles.thText}>Actual</Text>
                  <Text style={styles.thText}>Weight</Text>
                </View>
                <View style={[styles.thCell, { width: '12.75%', borderRightWidth: 0 }]}>
                  <Text style={styles.thText}>Charge</Text>
                  <Text style={styles.thText}>Weight</Text>
                </View>
              </View>

              {/* Body Row (Left) */}
              <View style={styles.tableBodyRowLeft}>
                <View style={[styles.tdCol, { width: '6.5%' }]}>
                  <Text style={styles.tdText}>1</Text>
                </View>
                <View style={[styles.tdCol, { width: '28.5%', alignItems: 'flex-start' }]}>
                  <Text style={[styles.tdText, { textAlign: 'left' }]}>{displayMaterial}</Text>
                </View>
                <View style={[styles.tdCol, { width: '16%' }]}>
                  <Text style={styles.tdText}>{displayPackaging}</Text>
                </View>
                <View style={[styles.tdCol, { width: '11%' }]}>
                  <Text style={styles.tdText}>{hsnCode || '-'}</Text>
                </View>
                <View style={[styles.tdCol, { width: '12.5%' }]}>
                  <Text style={styles.tdText}>{displayQuantity}</Text>
                </View>
                <View style={[styles.tdCol, { width: '12.75%' }]}>
                  <Text style={styles.tdText}>{formattedActualWeight}</Text>
                </View>
                <View style={[styles.tdCol, { width: '12.75%', borderRightWidth: 0 }]}>
                  <Text style={styles.tdText}>{formattedChargeWeight}</Text>
                </View>
              </View>

              {/* Total & Remarks Row (Left) */}
              <View style={styles.tableTotalRowLeft}>
                <View style={styles.remarkCell}>
                  <Text style={styles.remarkText}>
                    Other Remark: {remarks || (orderNo ? `Order No: ${orderNo}` : '')}
                  </Text>
                </View>
                <View style={[styles.totalCellBox, { width: '12.5%' }]}>
                  <Text style={styles.totalText}>Total: {totalQuantity}</Text>
                </View>
                <View style={[styles.totalCellBox, { width: '12.75%' }]}>
                  <Text style={styles.totalText}>Total:</Text>
                  <Text style={styles.totalText}>{formattedActualWeight}</Text>
                </View>
                <View style={[styles.totalCellBox, { width: '12.75%', borderRightWidth: 0 }]}>
                  <Text style={styles.totalText}>Total:</Text>
                  <Text style={styles.totalText}>{formattedChargeWeight}</Text>
                </View>
              </View>
            </View>

            {/* Right Section: Column 8 (Freight Rate & Authorized Signatory) */}
            <View style={styles.tableRightCol}>
              <View style={styles.tableHeaderRight}>
                <Text style={styles.thText}>Freight Rate</Text>
              </View>

              <View style={styles.tableBodyRight}>
                <Text style={styles.tdText}>
                  {freightDetails?.rate ? `₹ ${freightDetails.rate}` : '-'}
                </Text>

                <Text style={styles.freightStatusText}>Freight: To be billed</Text>

                <View style={styles.signatoryContainer}>
                  <Text style={styles.signatoryCompany}>For {companyName}</Text>
                  {podSignature ? (
                    <Image
                      src={podSignature}
                      style={{ width: 65, height: 26, objectFit: 'contain', marginVertical: 2 }}
                    />
                  ) : (
                    <View style={{ height: 26 }} />
                  )}
                  <Text style={styles.signatoryText}>Authorized Signatory</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom 3-box Grid */}
          <View style={styles.bottomBar}>
            {/* Box 1: Bank Details */}
            <View style={styles.bankCol}>
              <Text style={styles.bankText}>Bank Name: {bankName}</Text>
              <Text style={styles.bankText}>Bank A/C No.: {bankAccNo}</Text>
              <Text style={styles.bankText}>IFSC: {bankIfsc}</Text>
            </View>

            {/* Box 2: Computer generated note */}
            <View style={styles.centerNoteCol}>
              <Text style={styles.centerNoteText}>
                &ldquo;Total amount of goods as per the invoice&rdquo;
              </Text>
              <Text style={styles.centerNoteText}>This is computer generated LR/ Bilty.</Text>
            </View>

            {/* Box 3: Demurrage */}
            <View style={styles.demurrageCol}>
              <Text style={styles.demurrageTitle}>Schedule of demurrage charges</Text>
              <Text style={styles.demurrageText}>
                Demurrage charges applicable from reporting time after: 1 hour
              </Text>
              <Text style={styles.demurrageText}>Applicable Charge : ₹ 0 Per Hour</Text>
            </View>
          </View>

          {/* Footer Bar */}
          <View style={styles.footerBar}>
            <Text style={styles.footerText}>Service Area: ALL INDIA</Text>
            <Text style={styles.footerText}>Receiver&apos;s Comments:</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 2: TERMS AND CONDITIONS */}
      <Page size="A4" style={styles.page} orientation="portrait">
        <View style={styles.page2Header}>
          <Text style={styles.page2Title}>Terms and Conditions</Text>
          <Text style={styles.page2Title}>Other Information</Text>
        </View>

        <View>
          {TERMS_AND_CONDITIONS.map((clause, idx) => (
            <Text key={idx} style={styles.clauseText}>
              {clause}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
