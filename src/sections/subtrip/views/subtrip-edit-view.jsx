import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { paramCase } from 'src/utils/change-case';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import SubtripForm from '../subtrip-edit-form';

export function SubtripEditView() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const currentSubtrip = useSelector((state) =>
    state.subtrip.subtrips.find((subtrip) => paramCase(subtrip._id) === id)
  );

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

        <SubtripForm isEdit currentSubtrip={currentSubtrip} />
      </Container>
    </>
  );
}
