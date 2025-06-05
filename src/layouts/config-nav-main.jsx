import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navData = [
  { title: 'Home', path: '/', icon: <Iconify width={22} icon="solar:home-2-bold-duotone" /> },
  {
    title: 'Contact Us',
    path: paths.contact,
    icon: <Iconify width={22} icon="solar:atom-bold-duotone" />,
  },
  
];
