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
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    vehicle: {
      root: `${ROOTS.DASHBOARD}/vehicle`,
      new: `${ROOTS.DASHBOARD}/vehicle/new`,
      list: `${ROOTS.DASHBOARD}/vehicle/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/vehicle/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/vehicle/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/vehicle/674aeb4e174badde33145f16`,
        edit: `${ROOTS.DASHBOARD}/vehicle/674aeb4e174badde33145f16/edit`,
      },
    },
    driver: {
      root: `${ROOTS.DASHBOARD}/driver`,
      new: `${ROOTS.DASHBOARD}/driver/new`,
      list: `${ROOTS.DASHBOARD}/driver/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/driver/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/driver/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/driver/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/driver/${MOCK_ID}/edit`,
      },
    },
    pump: {
      root: `${ROOTS.DASHBOARD}/pump`,
      new: `${ROOTS.DASHBOARD}/pump/new`,
      list: `${ROOTS.DASHBOARD}/pump/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/pump/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/pump/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/pump/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/pump/${MOCK_ID}/edit`,
      },
    },
    customer: {
      root: `${ROOTS.DASHBOARD}/customer`,
      new: `${ROOTS.DASHBOARD}/customer/new`,
      list: `${ROOTS.DASHBOARD}/customer/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/customer/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/customer/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/customer/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/customer/${MOCK_ID}/edit`,
      },
    },

    bank: {
      root: `${ROOTS.DASHBOARD}/bank`,
      new: `${ROOTS.DASHBOARD}/bank/new`,
      list: `${ROOTS.DASHBOARD}/bank/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/bank/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/bank/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/bank/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/bank/${MOCK_ID}/edit`,
      },
    },
    transporter: {
      root: `${ROOTS.DASHBOARD}/transporter`,
      new: `${ROOTS.DASHBOARD}/transporter/new`,
      list: `${ROOTS.DASHBOARD}/transporter/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/transporter/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/transporter/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/transporter/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/transporter/${MOCK_ID}/edit`,
      },
    },
    route: {
      root: `${ROOTS.DASHBOARD}/route`,
      new: `${ROOTS.DASHBOARD}/route/new`,
      list: `${ROOTS.DASHBOARD}/route/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/route/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/route/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/route/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/route/${MOCK_ID}/edit`,
      },
    },
    expense: {
      root: `${ROOTS.DASHBOARD}/expense`,
      new: `${ROOTS.DASHBOARD}/expense/new-subtrip-expense`,
      newVehicleExpense: `${ROOTS.DASHBOARD}/expense/new-vehicle-expense`,
      list: `${ROOTS.DASHBOARD}/expense/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/expense/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/expense/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/expense/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/expense/${MOCK_ID}/edit`,
      },
    },
    subtrip: {
      root: `${ROOTS.DASHBOARD}/subtrip`,
      new: `${ROOTS.DASHBOARD}/subtrip/new`,
      list: `${ROOTS.DASHBOARD}/subtrip/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/subtrip/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/subtrip/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/subtrip/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/subtrip/${MOCK_ID}/edit`,
      },
    },

    trip: {
      root: `${ROOTS.DASHBOARD}/trip`,
      new: `${ROOTS.DASHBOARD}/trip/new`,
      list: `${ROOTS.DASHBOARD}/trip/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/trip/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/trip/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/trip/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/trip/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    driverPayroll: {
      root: `${ROOTS.DASHBOARD}/driverPayroll`,
      new: `${ROOTS.DASHBOARD}/driverPayroll/new`,
      details: (id) => `${ROOTS.DASHBOARD}/driverPayroll/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/driverPayroll/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/driverPayroll/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/driverPayroll/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
};
