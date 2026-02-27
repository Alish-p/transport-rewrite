import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: '/',
  changelog: '/',
  zoneStore: '/',
  minimalStore: '/',
  freeUI: '/',
  figma: '',
  public: {
    root: `/public`,
    subtrip: (id) => `/public/subtrip/${id}`,
    transporterPayment: (id) => `/public/transporter-payment/${id}`,
  },
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: { details: `/post/${paramCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    tenant: `${ROOTS.DASHBOARD}/tenant`,
    paymentHistory: `${ROOTS.DASHBOARD}/payments`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
      course: `${ROOTS.DASHBOARD}/course`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      details: (id) => `${ROOTS.DASHBOARD}/user/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
    },
    vehicle: {
      root: `${ROOTS.DASHBOARD}/vehicle`,
      new: `${ROOTS.DASHBOARD}/vehicle/new`,
      list: `${ROOTS.DASHBOARD}/vehicle/list`,
      documents: `${ROOTS.DASHBOARD}/vehicle/documents`,
      documentsGrid: `${ROOTS.DASHBOARD}/vehicle/documents-grid`,
      edit: (id) => `${ROOTS.DASHBOARD}/vehicle/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/vehicle/${id}`,
    },
    driver: {
      root: `${ROOTS.DASHBOARD}/driver`,
      new: `${ROOTS.DASHBOARD}/driver/new`,
      list: `${ROOTS.DASHBOARD}/driver/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/driver/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/driver/${id}`,
    },
    pump: {
      root: `${ROOTS.DASHBOARD}/pump`,
      new: `${ROOTS.DASHBOARD}/pump/new`,
      list: `${ROOTS.DASHBOARD}/pump/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/pump/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/pump/${id}`,
    },
    customer: {
      root: `${ROOTS.DASHBOARD}/customer`,
      new: `${ROOTS.DASHBOARD}/customer/new`,
      list: `${ROOTS.DASHBOARD}/customer/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/customer/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/customer/${id}`,
    },

    transporter: {
      root: `${ROOTS.DASHBOARD}/transporter`,
      new: `${ROOTS.DASHBOARD}/transporter/new`,
      list: `${ROOTS.DASHBOARD}/transporter/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/transporter/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/transporter/${id}`,
    },

    expense: {
      root: `${ROOTS.DASHBOARD}/expense`,
      new: `${ROOTS.DASHBOARD}/expense/new-subtrip-expense`,
      newVehicleExpense: `${ROOTS.DASHBOARD}/expense/new-vehicle-expense`,
      list: `${ROOTS.DASHBOARD}/expense/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/expense/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/expense/${id}`,
    },
    subtrip: {
      root: `${ROOTS.DASHBOARD}/subtrip`,
      jobCreate: `${ROOTS.DASHBOARD}/subtrip/job/create`,
      list: `${ROOTS.DASHBOARD}/subtrip/list`,
      receive: `${ROOTS.DASHBOARD}/subtrip/receive`,
      edit: (id) => `${ROOTS.DASHBOARD}/subtrip/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/subtrip/${id}`,
    },

    trip: {
      root: `${ROOTS.DASHBOARD}/trip`,
      new: `${ROOTS.DASHBOARD}/trip/new`,
      list: `${ROOTS.DASHBOARD}/trip/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/trip/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/trip/${id}`,
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      list: `${ROOTS.DASHBOARD}/invoice/list`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
    },
    driverSalary: {
      root: `${ROOTS.DASHBOARD}/driverSalary`,
      new: `${ROOTS.DASHBOARD}/driverSalary/new`,
      details: (id) => `${ROOTS.DASHBOARD}/driverSalary/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/driverSalary/${id}/edit`,
    },
    loan: {
      root: `${ROOTS.DASHBOARD}/loan`,
      new: `${ROOTS.DASHBOARD}/loan/new`,
      details: (id) => `${ROOTS.DASHBOARD}/loan/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/loan/${id}/edit`,
    },
    transporterPayment: {
      root: `${ROOTS.DASHBOARD}/transporterPayment`,
      new: `${ROOTS.DASHBOARD}/transporterPayment/new`,
      list: `${ROOTS.DASHBOARD}/transporterPayment/list`,
      details: (id) => `${ROOTS.DASHBOARD}/transporterPayment/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/transporterPayment/${id}/edit`,
      bulkCreate: `${ROOTS.DASHBOARD}/transporterPayment/bulk-create`,
    },
    // Superuser: Tenants management
    tenants: {
      root: `${ROOTS.DASHBOARD}/tenants`,
      new: `${ROOTS.DASHBOARD}/tenants/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tenants/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tenants/${id}/edit`,
    },
    part: {
      root: `${ROOTS.DASHBOARD}/part`,
      new: `${ROOTS.DASHBOARD}/part/new`,
      list: `${ROOTS.DASHBOARD}/part/list`,
      bulkImport: `${ROOTS.DASHBOARD}/part/bulk-import`,
      details: (id) => `${ROOTS.DASHBOARD}/part/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/part/${id}/edit`,
    },
    partLocation: {
      root: `${ROOTS.DASHBOARD}/part-location`,
      new: `${ROOTS.DASHBOARD}/part-location/new`,
      list: `${ROOTS.DASHBOARD}/part-location/list`,
      details: (id) => `${ROOTS.DASHBOARD}/part-location/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/part-location/${id}/edit`,
    },
    vendor: {
      root: `${ROOTS.DASHBOARD}/vendor`,
      new: `${ROOTS.DASHBOARD}/vendor/new`,
      list: `${ROOTS.DASHBOARD}/vendor/list`,
      details: (id) => `${ROOTS.DASHBOARD}/vendor/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/vendor/${id}/edit`,
    },
    purchaseOrder: {
      root: `${ROOTS.DASHBOARD}/purchaseOrder`,
      new: `${ROOTS.DASHBOARD}/purchaseOrder/new`,
      list: `${ROOTS.DASHBOARD}/purchaseOrder/list`,
      details: (id) => `${ROOTS.DASHBOARD}/purchaseOrder/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/purchaseOrder/${id}/edit`,
    },
    workOrder: {
      root: `${ROOTS.DASHBOARD}/workOrder`,
      new: `${ROOTS.DASHBOARD}/workOrder/new`,
      list: `${ROOTS.DASHBOARD}/workOrder/list`,
      details: (id) => `${ROOTS.DASHBOARD}/workOrder/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/workOrder/${id}/edit`,
    },
    tyre: {
      root: `${ROOTS.DASHBOARD}/tyre`,
      new: `${ROOTS.DASHBOARD}/tyre/new`,
      list: `${ROOTS.DASHBOARD}/tyre/list`,
      bulkImport: `${ROOTS.DASHBOARD}/tyre/bulk-import`,
      details: (id) => `${ROOTS.DASHBOARD}/tyre/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tyre/${id}/edit`,
    },
  },
};
