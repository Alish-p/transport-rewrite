import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function CustomerDetailView({ customer }) {
  const [tabValue, setTabValue] = useState('details');

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const { _id, customerName, GSTNo, PANNo, address, place, state, pinCode, cellNo, consignees } =
    customer || {};

  const detailsMarkdown = `

**Customer Name:** ${customerName}  
**GST Number:** ${GSTNo}  
**PAN Number:** ${PANNo}  

---

[](/)

### Contact Information

| Attribute       | Details                  |
| :-------------- | :----------------------- |
| **Address**     | ${address || 'N/A'}      |
| **Place**       | ${place || 'N/A'}        |
| **State**       | ${state}                 |
| **Pin Code**    | ${pinCode}               |
| **Mobile Number**| ${cellNo}               |

---

### Consignee Details

| Name              | Address                  | State         | Pin Code      |
| :---------------- | :----------------------- | :------------ | :------------ |
${consignees
  .map(
    (consignee) =>
      `| ${consignee.name} | ${consignee.address} | ${consignee.state} | ${consignee.pinCode} |`
  )
  .join('\n')}
`;

  const transactionMarkdown = `
### Transactions
*Note: Example content. Replace with actual transaction details.*

| Date          | Invoice Number | Amount   | Status    |
| :------------ | :------------- | :------- | :-------- |
| 01-Feb-2024   | INV-001         | $1500    | Paid      |
| 15-Feb-2024   | INV-002         | $2000    | Pending   |
| 01-Mar-2024   | INV-003         | $2500    | Paid      |

---
[](/)
For further details, please contact support.
`;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Customer Info"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Customers List', href: paths.dashboard.customer.root },
          { name: `${customerName}` },
        ]}
        sx={{ my: { xs: 3, md: 5 } }}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.customer.edit(_id)}
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
          >
            Edit Customer
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
            { value: 'details', label: 'Customer Details' },
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
            <Markdown children={transactionMarkdown} />
          </Box>
        )}
      </Card>
    </DashboardContent>
  );
}
