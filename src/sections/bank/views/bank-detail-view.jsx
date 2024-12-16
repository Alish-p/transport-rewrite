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

export function BankDetailView({ bank }) {
  const [tabValue, setTabValue] = useState('details');

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const { _id, name, branch, place, ifsc } = bank || {};

  const detailsMarkdown = `
[](/)
**Bank Name:** ${name}  

---

### Bank Information

| Attribute          | Details                  |
| :----------------- | :----------------------- |
| **Bank Name**     | ${name}             |
| **Branch**       | ${branch}               |
| **Place** | ${place}              |
| **IFSC Code**    | ${ifsc}               |


`;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Bank Info"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Banks List', href: paths.dashboard.bank.root },
          { name: `${name}` },
        ]}
        sx={{ my: { xs: 3, md: 5 } }}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.bank.edit(_id)}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Edit Bank
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
          <Tab value="details" label="Bank Details" />
        </Tabs>

        {tabValue === 'details' && (
          <Box sx={{ p: 3 }}>
            <Markdown children={detailsMarkdown} />
          </Box>
        )}
      </Card>
    </DashboardContent>
  );
}
