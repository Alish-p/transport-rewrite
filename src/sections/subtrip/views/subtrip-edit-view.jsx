import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import SubtripEditForm from '../subtrip-edit-form';

export function SubtripEditView({ subtrip, routesList, customersList, pumpsList }) {
  return (
    <>
      <Helmet>
        <title>Subtrip: Edit Subtrip | Dashboard</title>
      </Helmet>

      <Container>
        <CustomBreadcrumbs
          heading="Edit Subtrip"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Subtrip List',
              href: paths.dashboard.subtrip.list,
            },
            { name: 'Edit Subtrip' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <SubtripEditForm
          currentSubtrip={subtrip}
          routesList={routesList}
          customersList={customersList}
          pumpsList={pumpsList}
        />
      </Container>
    </>
  );
}
