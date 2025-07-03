import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function DriverDetailView({ driver }) {
  const [tabValue, setTabValue] = useState('details');

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const {
    driverName,
    driverLicenceNo,
    driverPresentAddress,
    driverCellNo,
    licenseFrom,
    licenseTo,
    aadharNo,
    guarantorName,
    guarantorCellNo,
    experience,
    dob,
    permanentAddress,
    bankCd,
    accNo,
  } = driver || {};

  const detailsMarkdown = `

**Driver Name:** ${driverName}  
**Date of Birth:** ${fDate(dob)}  
**Experience:** ${experience} years  

[](/)

---

###### Contact Information:
- **Mobile Number:** ${driverCellNo}
- **Present Address:** ${driverPresentAddress}
- **Permanent Address:** ${permanentAddress}

---

###### License Details:
- **License Number:** ${driverLicenceNo}
- **Valid From:** ${fDate(licenseFrom)}
- **Valid Until:** ${fDate(licenseTo)}

---


### Identification Details

| Attribute            | Details                  |
| :------------------- | :----------------------- |
| **Aadhar Number**    | ${aadharNo}              |
| **Guarantor Name**   | ${guarantorName}         |
| **Guarantor Contact**| ${guarantorCellNo}       |

---

### Bank Details

| Attribute            | Details                  |
| :------------------- | :----------------------- |
| **Bank Code**        | ${bankCd}                |
| **Account Number**   | ${accNo}                 |

`;

  const payslipMarkdown = `
### Payslip Information
*Note: Example content. Replace with actual payslip details.*

[](/)

| Month         | Amount Paid | Payment Date |
| :------------ | :---------- | :----------- |
| January 2024  | $2000       | 01-Feb-2024  |
| February 2024 | $2200       | 01-Mar-2024  |
| March 2024    | $2500       | 01-Apr-2024  |

---

For further details, please contact HR.
`;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Driver Info"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Drivers List', href: paths.dashboard.driver.root },
          { name: `${driverName}` },
        ]}
        sx={{ my: { xs: 3, md: 5 } }}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.driver.edit(driver._id)}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Edit Driver
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
            { value: 'details', label: 'Driver Details' },
            { value: 'payslip', label: 'Payslip' },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabValue === 'details' && (
          <Box sx={{ p: 3 }}>
            <Markdown children={detailsMarkdown} />
          </Box>
        )}

        {tabValue === 'payslip' && (
          <Box sx={{ p: 3 }}>
            <Markdown children={payslipMarkdown} />
          </Box>
        )}
      </Card>
    </DashboardContent>
  );
}
