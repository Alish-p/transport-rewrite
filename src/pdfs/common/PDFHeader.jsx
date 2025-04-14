import { View, Text, Image } from '@react-pdf/renderer';

import { CONFIG } from 'src/config-global';

import PDFStyles from './styles';

const { name, tagline, address, email, website, contacts } = CONFIG.company;

const CompanyLogo = () => (
  <View style={[PDFStyles.col4, PDFStyles.alignCenter, PDFStyles.logoContainer]}>
    <Image source="/logo/company-logo.png" style={{ width: 60, height: 60 }} />
  </View>
);

const CompanyInfo = () => (
  <View style={[PDFStyles.col8, PDFStyles.alignCenter, PDFStyles.headerSection]}>
    <Text style={[PDFStyles.companyName, PDFStyles.textCenter]}>{name}</Text>
    <Text style={[PDFStyles.companyTagline, PDFStyles.textCenter]}>{tagline}</Text>
    <Text style={[PDFStyles.companyAddress, PDFStyles.textCenter]}>{address.line1}</Text>
    <Text style={[PDFStyles.companyAddress, PDFStyles.textCenter]}>
      {`${address.line2}, ${address.state}`}
    </Text>
  </View>
);

const ContactInfo = () => (
  <View style={[PDFStyles.col5, PDFStyles.contactSection]}>
    <View style={[PDFStyles.flexColumn, PDFStyles.p8]}>
      <View style={[PDFStyles.flexRow, PDFStyles.mb8]}>
        <View style={[PDFStyles.col5]}>
          <Text style={[PDFStyles.contactLabel]}>Mobile No</Text>
        </View>
        <View style={[PDFStyles.col7]}>
          <Text style={[PDFStyles.contactValue]}>{contacts[0]}</Text>
        </View>
      </View>

      <View style={[PDFStyles.flexRow, PDFStyles.mb8]}>
        <View style={[PDFStyles.col5]}>
          <Text style={[PDFStyles.contactLabel]}>Email</Text>
        </View>
        <View style={[PDFStyles.col7]}>
          <Text style={[PDFStyles.contactValue]}>{email}</Text>
        </View>
      </View>

      <View style={[PDFStyles.flexRow]}>
        <View style={[PDFStyles.col5]}>
          <Text style={[PDFStyles.contactLabel]}>Website</Text>
        </View>
        <View style={[PDFStyles.col7]}>
          <Text style={[PDFStyles.contactValue]}>{website}</Text>
        </View>
      </View>
    </View>
  </View>
);

export default function PDFHeader() {
  return (
    <View style={[PDFStyles.gridContainer, PDFStyles.headerContainer, PDFStyles.p8]}>
      {/* Left section with logo and company info */}
      <View
        style={[PDFStyles.gridContainer, PDFStyles.col7, PDFStyles.headerDivider, PDFStyles.pr8]}
      >
        <CompanyLogo />
        <CompanyInfo />
      </View>

      {/* Right section with contact information */}
      <ContactInfo />
    </View>
  );
}
