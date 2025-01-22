import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export const CONFIG = {
  site: {
    name: 'Transport +',
    serverUrl: import.meta.env.VITE_SERVER_URL ?? '',
    assetURL: import.meta.env.VITE_ASSET_URL ?? '',
    basePath: import.meta.env.VITE_BASE_PATH ?? '',
    version: packageJson.version,
  },
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.dashboard.root,
  },

  company: {
    name: 'Shree Enterprises',
    tagline: 'Transport Contractor & Commission Agents',
    address: {
      line1: 'Plot No 16 & 17, Jamakhandi Road, Mudhol-587313.',
      line2: 'Dist: BagalKot',
      state: 'Karnataka',
    },
    email: 'shree.enterprises34064@gmail.com',
    website: 'www.shreeenterprises.biz',
    contacts: ['+91 9448134064', '+91 9448134064', '+91 9448134064'],

    transporterCommissionRate: 100,
  },

  customerInvoiceTax: 6,
};
