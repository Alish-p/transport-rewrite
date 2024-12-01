import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Markdown } from 'src/components/markdown';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Iconify } from '../../../components/iconify';
import { RouterLink } from '../../../routes/components';

export function TransporterDetailView({ transporter }) {
  const [tabValue, setTabValue] = useState('details');

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const {
    transportName,
    address,
    place,
    pinNo,
    cellNo,
    bankCd,
    ifscCode,
    accNo,
    paymentMode,
    panNo,
    ownerName,
    gstNo,
    bankBranch,
    emailId,
    phoneNo,
    transportType,
    agreementNo,
    tdsPercentage,
  } = transporter || {};

  const detailsMarkdown = `

**Transporter Name:** ${transportName}  
**Owner Name:** ${ownerName}  
**Transport Type:** ${transportType}  

---
[](/)
### Contact Information

| Attribute       | Details                  |
| :-------------- | :----------------------- |
| **Address**     | ${address}               |
| **Place**       | ${place}                 |
| **Pin Number**  | ${pinNo}                 |
| **Phone Number**| ${phoneNo}               |
| **Mobile Number**| ${cellNo}               |
| **Email ID**    | ${emailId}               |

---

### Financial Information

| Attribute           | Details                  |
| :------------------ | :----------------------- |
| **Bank Code**       | ${bankCd}                |
| **Bank Branch**     | ${bankBranch}            |
| **Account Number**  | ${accNo}                 |
| **IFSC Code**       | ${ifscCode}              |
| **Payment Mode**    | ${paymentMode}           |
| **TDS Percentage**  | ${tdsPercentage}%        |

---

### Tax Information

| Attribute           | Details                  |
| :------------------ | :----------------------- |
| **GST Number**      | ${gstNo}                 |
| **PAN Number**      | ${panNo}                 |

---

### Agreement Details

| Attribute           | Details                  |
| :------------------ | :----------------------- |
| **Agreement Number**| ${agreementNo}           |

`;

  const transactionsMarkdown = `
### Transactions
*Note: Example content. Replace with actual transaction details.*

| Date          | Invoice Number | Amount   | Status    |
| :------------ | :------------- | :------- | :-------- |
| 01-Feb-2024   | INV-001         | $1500    | Paid      |
| 15-Feb-2024   | INV-002         | $2000    | Pending   |
| 01-Mar-2024   | INV-003         | $2500    | Paid      |

---

For further details, please contact support.
`;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Transporter Info"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Transporters List', href: paths.dashboard.transporter.root },
          { name: `${transportName}` },
        ]}
        sx={{ my: { xs: 3, md: 5 } }}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.transporter.edit(transporter._id)}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Edit Transporter
          </Button>
        }
      />
      <Card>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.grey['500Channel']}`,
          }}
        >
          {[
            { value: 'details', label: 'Transporter Details' },
            { value: 'transactions', label: 'Transactions' },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabValue === 'details' && (
          <Box sx={{ p: 3 }}>
            <Markdown children={detailsMarkdown} />
          </Box>
        )}

        {tabValue === 'transactions' && (
          <Box sx={{ p: 3 }}>
            <Markdown children={transactionsMarkdown} />
          </Box>
        )}
      </Card>
    </DashboardContent>
  );
}
