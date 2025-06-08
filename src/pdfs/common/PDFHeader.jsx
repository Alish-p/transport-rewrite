/* eslint-disable react/prop-types */
import { View, Text, Image } from '@react-pdf/renderer';

import { CONFIG } from 'src/config-global';

import PDFStyles from './styles';

export default function PDFHeader({
  logoPath = '/logo/company-logo-main.png',
  company = CONFIG.company,
  logoSize = 55,
  styles = PDFStyles,
}) {
  const { name, tagline, address, email, website, contacts } = company;

  return (
    <View style={[styles.border, styles.p8, styles.mb8]}>
      {/* Grid Container */}
      <View style={[styles.gridContainer, styles.alignStart]}>
        {/* Logo Section */}
        <View style={[styles.col2, styles.alignCenter]}>
          <Image
            src={logoPath}
            style={{ width: logoSize, height: logoSize, objectFit: 'contain' }}
          />
        </View>

        {/* Company Info */}
        <View style={[styles.col6]}>
          <Text style={[styles.companyName]}>{name}</Text>
          <Text style={[styles.companyTagline, styles.mb4]}>{tagline}</Text>
          <Text style={[styles.companyAddress]}>{address.line1}</Text>
          <Text style={[styles.companyAddress]}>
            {address.line2}, {address.state}
          </Text>
        </View>

        {/* Contact Info */}
        <View style={[styles.col4, styles.contactSection, styles.borderLeft]}>
          <View style={[styles.flexColumn]}>
            <ContactRow styles={styles} label="Mobile" value={contacts?.[0]} />
            <ContactRow styles={styles} label="Email" value={email} />
            <ContactRow styles={styles} label="Website" value={website} />
          </View>
        </View>
      </View>
    </View>
  );
}

function ContactRow({ styles = PDFStyles, label, value }) {
  return (
    <View style={[styles.flexRow, styles.mb4]}>
      <Text style={[styles.contactLabel, styles.col5]}>{label}</Text>
      <Text style={[styles.contactValue, styles.col7]}>{value}</Text>
    </View>
  );
}
