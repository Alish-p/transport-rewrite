/* eslint-disable react/prop-types */
import { View, Text } from '@react-pdf/renderer';

import { CONFIG } from 'src/config-global';

import PDFStyles from './styles';

/**
 * PDFHeader Component
 *
 * A reusable header component for PDF documents that displays:
 * - Company logo
 * - Company information (name, tagline, address)
 * - Contact information (mobile, email, website)
 *
 * @param {Object} props - Component props
 * @param {string} props.logoPath - Path to the company logo (default: '/logo/company-logo.png')
 * @param {Object} props.company - Company information object (default: from CONFIG)
 * @param {boolean} props.showContactInfo - Whether to show contact information (default: true)
 * @param {number} props.logoSize - Size of the logo in pixels (default: 60)
 * @returns {JSX.Element} PDFHeader component
 */
export default function PDFHeader({
  logoPath = '/logo/company-logo.png',
  company = CONFIG.company,
  showContactInfo = true,
  logoSize = 60,
}) {
  const { name, tagline, address, email, website, contacts } = company;

  return (
    <View style={[PDFStyles.headerContainer, PDFStyles.p16]}>
      {/* Main header container */}
      <View style={[PDFStyles.gridContainer]}>
        {/* Logo and Company Info Column */}
        <View
          style={[
            PDFStyles.flexRow,
            PDFStyles.alignCenter,
            showContactInfo ? PDFStyles.col6 : PDFStyles.col12,
          ]}
        >
          {/* Logo */}
          {/* <View style={[PDFStyles.col2, PDFStyles.alignCenter]}>
            <Image source={logoPath} style={{ width: logoSize, height: logoSize }} />
          </View> */}

          {/* Company Info */}
          <View style={[PDFStyles.col12, PDFStyles.flexColumn]}>
            <Text style={[PDFStyles.companyName]}>{name}</Text>
            <Text style={[PDFStyles.companyTagline, PDFStyles.mb4]}>{tagline}</Text>
            <Text style={[PDFStyles.companyAddress]}>{address.line1}</Text>
            <Text style={[PDFStyles.companyAddress]}>{`${address.line2}, ${address.state}`}</Text>
          </View>
        </View>

        {/* Contact Info Column - Only shown if showContactInfo is true */}
        {showContactInfo && (
          <View style={[PDFStyles.col5, PDFStyles.contactSection]}>
            <View style={[PDFStyles.flexColumn, PDFStyles.p8]}>
              <ContactRow label="Mobile No" value={contacts[0]} />
              <ContactRow label="Email" value={email} />
              <ContactRow label="Website" value={website} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * ContactRow Component - Extracted to its own component for better organization
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label text for the contact information
 * @param {string} props.value - Value text for the contact information
 * @returns {JSX.Element} ContactRow component
 */
function ContactRow({ label, value }) {
  return (
    <View style={[PDFStyles.flexRow, PDFStyles.mb8]}>
      <View style={[PDFStyles.col5]}>
        <Text style={[PDFStyles.contactLabel]}>{label}</Text>
      </View>
      <View style={[PDFStyles.col7]}>
        <Text style={[PDFStyles.contactValue]}>{value}</Text>
      </View>
    </View>
  );
}
