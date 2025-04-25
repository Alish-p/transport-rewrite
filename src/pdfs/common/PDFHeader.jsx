/* eslint-disable react/prop-types */
import { View, Text, Image } from '@react-pdf/renderer';

import { CONFIG } from 'src/config-global';

import PDFStyles from './styles';

export default function PDFHeader({
  logoPath = '/logo/company-logo-1.png',
  company = CONFIG.company,
  showContactInfo = true,
  logoSize = 50,
}) {
  const { name, tagline, address, email, website, contacts } = company;

  return (
    <View style={[PDFStyles.border, PDFStyles.p16, PDFStyles.mb16]}>
      {/* Grid Container */}
      <View style={[PDFStyles.gridContainer, PDFStyles.alignStart]}>
        {/* Logo Section */}
        <View style={[showContactInfo ? PDFStyles.col1 : PDFStyles.col2, PDFStyles.alignCenter]}>
          {/* Uncomment logo if needed */}
          <Image
            src={logoPath}
            style={{ width: logoSize, height: logoSize, objectFit: 'contain' }}
          />
        </View>

        {/* Company Info */}
        <View style={[showContactInfo ? PDFStyles.col6 : PDFStyles.col10]}>
          <Text style={[PDFStyles.companyName]}>{name}</Text>
          <Text style={[PDFStyles.companyTagline, PDFStyles.mb4]}>{tagline}</Text>
          <Text style={[PDFStyles.companyAddress]}>{address.line1}</Text>
          <Text style={[PDFStyles.companyAddress]}>
            {address.line2}, {address.state}
          </Text>
        </View>

        {/* Contact Info */}
        {showContactInfo && (
          <View style={[PDFStyles.col3, PDFStyles.contactSection, PDFStyles.borderLeft]}>
            <View style={[PDFStyles.flexColumn, PDFStyles.p8]}>
              <ContactRow label="Mobile" value={contacts?.[0]} />
              <ContactRow label="Email" value={email} />
              <ContactRow label="Website" value={website} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function ContactRow({ label, value }) {
  return (
    <View style={[PDFStyles.flexRow, PDFStyles.mb4]}>
      <Text style={[PDFStyles.contactLabel, PDFStyles.col5]}>{label}</Text>
      <Text style={[PDFStyles.contactValue, PDFStyles.col7]}>{value}</Text>
    </View>
  );
}
