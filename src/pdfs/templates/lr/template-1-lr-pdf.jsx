/* eslint-disable react/prop-types */
import { Svg, Font, Page, Path, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

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

  // Header styles (outside borderContainer)
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    paddingHorizontal: 2,
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
    width: '39%',
    padding: 3,
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
    lineHeight: 1.2,
    textAlign: 'left',
  },
  carrierRiskCol: {
    width: '27%',
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
  },
  carrierRiskTitle: {
    fontSize: 6.8,
    fontWeight: 700,
    marginBottom: 2,
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    lineHeight: 1.2,
    marginBottom: 1,
  },
  legalLabel: {
    fontSize: 6,
    color: '#000000',
  },
  legalValue: {
    fontSize: 6,
    fontWeight: 700,
    color: '#000000',
  },
  lrMetaCol: {
    width: '34%',
    padding: 3,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    lineHeight: 1.2,
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
    textAlign: 'right',
  },

  // Consignor / Consignee / Insurance Bar
  partyBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
  },
  partyCol: {
    width: '33%',
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
  },
  insuranceCol: {
    width: '34%',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  partyLabel: {
    fontSize: 6,
    color: '#000000',
    width: '24%',
  },
  partyValue: {
    fontSize: 6,
    fontWeight: 700,
    color: '#000000',
    textAlign: 'right',
    width: '76%',
    lineHeight: 1.2,
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
    width: '66%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
  },
  tableHeaderRowLeft: {
    flexDirection: 'row',
    height: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    backgroundColor: '#FFFFFF',
  },
  tableBodyRowLeft: {
    flexDirection: 'row',
    height: 90,
  },
  tableTotalRowLeft: {
    flexDirection: 'row',
    height: 20,
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
    padding: '1px 2px',
  },
  thText: {
    fontSize: 6,
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 1.15,
  },
  tdCol: {
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    paddingTop: 3,
    paddingHorizontal: 2,
  },
  tdText: {
    fontSize: 6,
    textAlign: 'center',
    lineHeight: 1.2,
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
    fontSize: 5.8,
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 1.15,
  },

  // Freight Card (Right side of table)
  tableRightCol: {
    width: '34%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  freightCardText: {
    fontSize: 7.5,
    fontWeight: 700,
    textAlign: 'center',
  },

  // Middle 3-card Grid: Empty | Other Remark | Tenant Signature
  middleBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    minHeight: 46,
  },
  middleCol1: {
    width: '33%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    padding: 4,
  },
  middleCol2: {
    width: '33%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    padding: 4,
  },
  middleCol3: {
    width: '34%',
    padding: '3px 4px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remarkTitle: {
    fontSize: 6,
    fontWeight: 700,
  },
  remarkText: {
    fontSize: 6,
    lineHeight: 1.25,
  },
  signatoryCompany: {
    fontSize: 6,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 1,
  },
  signatoryText: {
    fontSize: 6,
    fontWeight: 700,
    textAlign: 'center',
    marginTop: 1,
  },

  // Bottom 3-box Grid
  bottomBar: {
    flexDirection: 'row',
  },
  bankCol: {
    width: '33%',
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
  },
  centerNoteCol: {
    width: '33%',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
  },
  demurrageCol: {
    width: '34%',
    padding: 3,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    lineHeight: 1.2,
    marginBottom: 1,
  },
  bankLabel: {
    fontSize: 6,
    color: '#000000',
  },
  bankValue: {
    fontSize: 6,
    fontWeight: 700,
    color: '#000000',
    textAlign: 'right',
  },
  centerNoteText: {
    fontSize: 6,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  demurrageTitle: {
    fontSize: 6.2,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 2,
  },
  demurrageText: {
    fontSize: 5.8,
    lineHeight: 1.2,
  },

  // Footer text (outside borderContainer)
  footerBar: {
    paddingTop: 3,
    paddingHorizontal: 1,
  },
  footerText: {
    fontSize: 6,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  footerUnderlineText: {
    fontSize: 6,
    fontWeight: 700,
    lineHeight: 1.3,
    textDecoration: 'underline',
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
  const consignorMobile = customerId?.cellNo || '-';
  const consignorAddress =
    customerId?.address || 'CHIRKUNDA, DHANBAD, JHARKHAND, DHANBAD - 828202, Chirkunda, Jharkhand, India - 828202';

  // Consignee
  const consigneeName = consignee || 'M/S MAA JWALA ENTERPRISES';
  const consigneeGst = subtrip?.consigneeGst || customerId?.consigneeGst || '-';
  const consigneeMobile = subtrip?.consigneeMobile || subtrip?.consigneePhone || '-';
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
        {/* Header (outside borderContainer) */}
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

        <View style={styles.borderContainer}>
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
              <View style={styles.legalRow}>
                <Text style={styles.legalLabel}>GST No.</Text>
                <Text style={styles.legalValue}>{gstNo}</Text>
              </View>
              <View style={styles.legalRow}>
                <Text style={styles.legalLabel}>PAN No.</Text>
                <Text style={styles.legalValue}>{panNo}</Text>
              </View>
              <View style={styles.legalRow}>
                <Text style={styles.legalLabel}>UDYAM Reg. No.</Text>
                <Text style={styles.legalValue}>{udyamNo}</Text>
              </View>
            </View>

            {/* Box 3: LR Meta */}
            <View style={styles.lrMetaCol}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>LR Date</Text>
                <Text style={styles.metaValue}>{fDate(startDate, 'DD-MM-YYYY') || '09-09-2026'}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>LR No</Text>
                <Text style={styles.metaValue}>{subtripNo}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Vehicle No</Text>
                <Text style={styles.metaValue}>{vehicleId?.vehicleNo || 'JH-10DD-1612'}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>From</Text>
                <Text style={styles.metaValue}>{fromDisplay}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>To</Text>
                <Text style={styles.metaValue}>{toDisplay}</Text>
              </View>
            </View>
          </View>

          {/* Consignor / Consignee / Insurance Bar */}
          <View style={styles.partyBar}>
            {/* Consignor */}
            <View style={styles.partyCol}>
              <View style={styles.partyRow}>
                <Text style={styles.partyLabel}>Consignor</Text>
                <Text style={styles.partyValue}>{consignorName}</Text>
              </View>
              <View style={styles.partyRow}>
                <Text style={styles.partyLabel}>GST No</Text>
                <Text style={styles.partyValue}>{consignorGst}</Text>
              </View>
              <View style={styles.partyRow}>
                <Text style={styles.partyLabel}>Mobile</Text>
                <Text style={styles.partyValue}>{consignorMobile}</Text>
              </View>
              <View style={styles.partyRow}>
                <Text style={styles.partyLabel}>Address</Text>
                <Text style={styles.partyValue}>{consignorAddress}</Text>
              </View>
            </View>

            {/* Consignee */}
            <View style={styles.partyCol}>
              <View style={styles.partyRow}>
                <Text style={styles.partyLabel}>Consignee</Text>
                <Text style={styles.partyValue}>{consigneeName}</Text>
              </View>
              <View style={styles.partyRow}>
                <Text style={styles.partyLabel}>GST No</Text>
                <Text style={styles.partyValue}>{consigneeGst}</Text>
              </View>
              <View style={styles.partyRow}>
                <Text style={styles.partyLabel}>Mobile</Text>
                <Text style={styles.partyValue}>{consigneeMobile}</Text>
              </View>
              <View style={styles.partyRow}>
                <Text style={styles.partyLabel}>Address</Text>
                <Text style={styles.partyValue}>{consigneeAddress}</Text>
              </View>
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
            {/* Left Section: Columns 1 to 8 */}
            <View style={styles.tableLeftCol}>
              {/* Header Row (Left) */}
              <View style={styles.tableHeaderRowLeft}>
                <View style={[styles.thCell, { width: '6%' }]}>
                  <Text style={styles.thText}>Sr no.</Text>
                </View>
                <View style={[styles.thCell, { width: '24%' }]}>
                  <Text style={styles.thText}>Product / Material</Text>
                </View>
                <View style={[styles.thCell, { width: '14%' }]}>
                  <Text style={styles.thText}>Packaging Type</Text>
                  <Text style={styles.thText}>(LxBxH)</Text>
                </View>
                <View style={[styles.thCell, { width: '10%' }]}>
                  <Text style={styles.thText}>HSN Code</Text>
                </View>
                <View style={[styles.thCell, { width: '11%' }]}>
                  <Text style={styles.thText}>Articles</Text>
                  <Text style={styles.thText}>Packages</Text>
                </View>
                <View style={[styles.thCell, { width: '11.5%' }]}>
                  <Text style={styles.thText}>Actual</Text>
                  <Text style={styles.thText}>Weight</Text>
                </View>
                <View style={[styles.thCell, { width: '11.5%' }]}>
                  <Text style={styles.thText}>Charge</Text>
                  <Text style={styles.thText}>Weight</Text>
                </View>
                <View style={[styles.thCell, { width: '12%', borderRightWidth: 0 }]}>
                  <Text style={styles.thText}>Freight Rate</Text>
                </View>
              </View>

              {/* Body Row (Left) */}
              <View style={styles.tableBodyRowLeft}>
                <View style={[styles.tdCol, { width: '6%' }]}>
                  <Text style={styles.tdText}>1</Text>
                </View>
                <View style={[styles.tdCol, { width: '24%', alignItems: 'flex-start' }]}>
                  <Text style={[styles.tdText, { textAlign: 'left' }]}>{displayMaterial}</Text>
                </View>
                <View style={[styles.tdCol, { width: '14%' }]}>
                  <Text style={styles.tdText}>{displayPackaging}</Text>
                </View>
                <View style={[styles.tdCol, { width: '10%' }]}>
                  <Text style={styles.tdText}>{hsnCode || ''}</Text>
                </View>
                <View style={[styles.tdCol, { width: '11%' }]}>
                  <Text style={styles.tdText}>{displayQuantity}</Text>
                </View>
                <View style={[styles.tdCol, { width: '11.5%' }]}>
                  <Text style={styles.tdText}>{formattedActualWeight}</Text>
                </View>
                <View style={[styles.tdCol, { width: '11.5%' }]}>
                  <Text style={styles.tdText}>{formattedChargeWeight}</Text>
                </View>
                <View style={[styles.tdCol, { width: '12%', borderRightWidth: 0 }]}>
                  <Text style={styles.tdText}>
                    {freightDetails?.rate ? `₹ ${freightDetails.rate}` : '-'}
                  </Text>
                </View>
              </View>

              {/* Total Row (Left) */}
              <View style={styles.tableTotalRowLeft}>
                <View style={[styles.totalCellBox, { width: '6%' }]} />
                <View style={[styles.totalCellBox, { width: '24%' }]} />
                <View style={[styles.totalCellBox, { width: '14%' }]} />
                <View style={[styles.totalCellBox, { width: '10%' }]} />
                <View style={[styles.totalCellBox, { width: '11%' }]}>
                  <Text style={styles.totalText}>Total: {totalQuantity}</Text>
                </View>
                <View style={[styles.totalCellBox, { width: '11.5%' }]}>
                  <Text style={styles.totalText}>Total:</Text>
                  <Text style={styles.totalText}>{formattedActualWeight}</Text>
                </View>
                <View style={[styles.totalCellBox, { width: '11.5%' }]}>
                  <Text style={styles.totalText}>Total:</Text>
                  <Text style={styles.totalText}>{formattedChargeWeight}</Text>
                </View>
                <View style={[styles.totalCellBox, { width: '12%', borderRightWidth: 0 }]} />
              </View>
            </View>

            {/* Right Section: Freight Card */}
            <View style={styles.tableRightCol}>
              <Text style={styles.freightCardText}>Freight: To be billed</Text>
            </View>
          </View>

          {/* Middle 3-box Grid: Empty | Other Remark | Tenant Signature */}
          <View style={styles.middleBar}>
            {/* Box 1: Empty */}
            <View style={styles.middleCol1} />

            {/* Box 2: Other Remark */}
            <View style={styles.middleCol2}>
              <Text style={styles.remarkText}>
                <Text style={styles.remarkTitle}>Other Remark: </Text>
                {remarks || (orderNo ? `Order No: ${orderNo}` : '')}
              </Text>
            </View>

            {/* Box 3: Tenant's Signature */}
            <View style={styles.middleCol3}>
              <Text style={styles.signatoryCompany}>For {companyName}</Text>
              <View style={{ height: 22 }} />
              <Text style={styles.signatoryText}>Authorized Signatory</Text>
            </View>
          </View>

          {/* Bottom 3-box Grid */}
          <View style={styles.bottomBar}>
            {/* Box 1: Bank Details */}
            <View style={styles.bankCol}>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Bank Name</Text>
                <Text style={styles.bankValue}>{bankName}</Text>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Bank A/C No.</Text>
                <Text style={styles.bankValue}>{bankAccNo}</Text>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>IFSC</Text>
                <Text style={styles.bankValue}>{bankIfsc}</Text>
              </View>
            </View>

            {/* Box 2: Computer generated note */}
            <View style={styles.centerNoteCol}>
              <Text style={styles.centerNoteText}>
                &ldquo;Total amount of goods as <Text style={{ fontWeight: 700 }}>per the invoice</Text>&rdquo;
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
        </View>

        {/* Footer Bar (outside borderContainer) */}
        <View style={styles.footerBar}>
          <Text style={styles.footerText}>Service Area: ALL INDIA</Text>
          <Text style={styles.footerUnderlineText}>Receiver&apos;s Comments:</Text>
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
