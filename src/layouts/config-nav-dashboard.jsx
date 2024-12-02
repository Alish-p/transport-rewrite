import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

import { Iconify } from '../components/iconify';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  vehicle: icon('ic_vehicle'),
  driver: icon('ic-user'),
  pump: icon('ic_pump'),
  customer: icon('ic_customer'),
  transporter: icon('ic_transporter'),
  route: icon('ic_map'),
  expense: icon('ic_expense'),
  subtrip: icon('ic_subtrip'),
  trip: icon('ic_trip'),
  driverPayroll: <Iconify icon="healthicons:truck-driver" />,
  transporterPayment: <Iconify icon="ri:money-rupee-circle-line" />,
};
// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Main',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      // { title: 'Ecommerce', path: paths.dashboard.general.ecommerce, icon: ICONS.ecommerce },
      // { title: 'Analytics', path: paths.dashboard.general.analytics, icon: ICONS.analytics },
      // { title: 'Banking', path: paths.dashboard.general.banking, icon: ICONS.banking },
      // { title: 'Booking', path: paths.dashboard.general.booking, icon: ICONS.booking },
      // { title: 'File', path: paths.dashboard.general.file, icon: ICONS.file },
      // { title: 'Course', path: paths.dashboard.general.course, icon: ICONS.course },
    ],
  },

  {
    subheader: 'Quick Links',
    items: [
      {
        title: 'Create Trip',
        path: paths.dashboard.trip.new,
        icon: ICONS.trip,
        info: <Iconify icon="gravity-ui:star" />,
      },
      {
        title: 'Create Subtrip',
        path: paths.dashboard.subtrip.new,
        icon: ICONS.subtrip,
      },
      {
        title: 'Add Expense',
        path: paths.dashboard.expense.new,
        icon: ICONS.expense,
      },
    ],
  },

  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Trip',
        path: paths.dashboard.trip.root,
        icon: ICONS.trip,
        children: [
          { title: 'List', path: paths.dashboard.trip.root },
          { title: 'Create', path: paths.dashboard.trip.new },
          // { title: 'Details', path: paths.dashboard.trip.demo.details },
          // { title: 'Edit', path: paths.dashboard.trip.demo.edit },
        ],
      },
      {
        title: 'Subtrip',
        path: paths.dashboard.subtrip.root,
        icon: ICONS.subtrip,
        children: [
          { title: 'List', path: paths.dashboard.subtrip.root },
          { title: 'Create', path: paths.dashboard.subtrip.new },

          // { title: 'Details', path: paths.dashboard.subtrip.demo.details },
          // { title: 'Edit', path: paths.dashboard.subtrip.demo.edit },
        ],
      },

      {
        title: 'Expense',
        path: paths.dashboard.expense.root,
        icon: ICONS.expense,
        children: [
          { title: 'List', path: paths.dashboard.expense.root },
          { title: 'Add Expense to Subtrip', path: paths.dashboard.expense.new },
          { title: 'Add Expense to Vehicle ', path: paths.dashboard.expense.newVehicleExpense },

          // { title: 'Details', path: paths.dashboard.expense.demo.details },
          // { title: 'Edit', path: paths.dashboard.expense.demo.edit },
        ],
      },

      {
        title: 'Vehicle',
        path: paths.dashboard.vehicle.root,
        icon: ICONS.vehicle,
        children: [
          { title: 'List', path: paths.dashboard.vehicle.root },
          { title: 'Create', path: paths.dashboard.vehicle.new },

          // { title: 'Details', path: paths.dashboard.vehicle.demo.details },
          // { title: 'Edit', path: paths.dashboard.vehicle.demo.edit },
        ],
      },

      {
        title: 'Driver',
        path: paths.dashboard.driver.root,
        icon: ICONS.driver,
        children: [
          { title: 'List', path: paths.dashboard.driver.root },
          { title: 'Create', path: paths.dashboard.driver.new },

          // { title: 'Details', path: paths.dashboard.driver.demo.details },
          // { title: 'Edit', path: paths.dashboard.driver.demo.edit },
        ],
      },

      {
        title: 'Customer',
        path: paths.dashboard.customer.root,
        icon: ICONS.customer,
        children: [
          { title: 'List', path: paths.dashboard.customer.root },
          { title: 'Create', path: paths.dashboard.customer.new },
          // { title: 'Details', path: paths.dashboard.customer.demo.details },
          // { title: 'Edit', path: paths.dashboard.customer.demo.edit },
        ],
      },

      {
        title: 'Transporter',
        path: paths.dashboard.transporter.root,
        icon: ICONS.transporter,
        children: [
          { title: 'List', path: paths.dashboard.transporter.root },
          { title: 'Create', path: paths.dashboard.transporter.new },
          // { title: 'Details', path: paths.dashboard.transporter.demo.details },
          // { title: 'Edit', path: paths.dashboard.transporter.demo.edit },
        ],
      },

      {
        title: 'Pump',
        path: paths.dashboard.pump.root,
        icon: ICONS.pump,
        children: [
          { title: 'List', path: paths.dashboard.pump.root },
          { title: 'Create', path: paths.dashboard.pump.new },
          // { title: 'Details', path: paths.dashboard.pump.demo.details },
          // { title: 'Edit', path: paths.dashboard.pump.demo.edit },
        ],
      },

      {
        title: 'Route',
        path: paths.dashboard.route.root,
        icon: ICONS.route,
        children: [
          { title: 'List', path: paths.dashboard.route.root },
          { title: 'Create', path: paths.dashboard.route.new },
          // { title: 'Details', path: paths.dashboard.route.demo.details },
          // { title: 'Edit', path: paths.dashboard.route.demo.edit },
        ],
      },

      // {
      //   title: 'Order',
      //   path: paths.dashboard.order.root,
      //   icon: ICONS.order,
      //   children: [
      //     { title: 'List', path: paths.dashboard.order.root },
      //     { title: 'Details', path: paths.dashboard.order.demo.details },
      //   ],
      // },
      // {
      //   title: 'Blog',
      //   path: paths.dashboard.post.root,
      //   icon: ICONS.blog,
      //   children: [
      //     { title: 'List', path: paths.dashboard.post.root },
      //     { title: 'Details', path: paths.dashboard.post.demo.details },
      //     { title: 'Create', path: paths.dashboard.post.new },
      //     { title: 'Edit', path: paths.dashboard.post.demo.edit },
      //   ],
      // },
      // {
      //   title: 'User',
      //   path: paths.dashboard.user.root,
      //   icon: ICONS.user,
      //   children: [
      //     { title: 'Profile', path: paths.dashboard.user.root },
      //     { title: 'Cards', path: paths.dashboard.user.cards },
      //     { title: 'List', path: paths.dashboard.user.list },
      //     { title: 'Create', path: paths.dashboard.user.new },
      //     { title: 'Edit', path: paths.dashboard.user.demo.edit },
      //     { title: 'Account', path: paths.dashboard.user.account },
      //   ],
      // },
      // {
      //   title: 'Product',
      //   path: paths.dashboard.product.root,
      //   icon: ICONS.product,
      //   children: [
      //     { title: 'List', path: paths.dashboard.product.root },
      //     { title: 'Details', path: paths.dashboard.product.demo.details },
      //     { title: 'Create', path: paths.dashboard.product.new },
      //     { title: 'Edit', path: paths.dashboard.product.demo.edit },
      //   ],
      // },
      // {
      //   title: 'Job',
      //   path: paths.dashboard.job.root,
      //   icon: ICONS.job,
      //   children: [
      //     { title: 'List', path: paths.dashboard.job.root },
      //     { title: 'Details', path: paths.dashboard.job.demo.details },
      //     { title: 'Create', path: paths.dashboard.job.new },
      //     { title: 'Edit', path: paths.dashboard.job.demo.edit },
      //   ],
      // },
      // {
      //   title: 'Tour',
      //   path: paths.dashboard.tour.root,
      //   icon: ICONS.tour,
      //   children: [
      //     { title: 'List', path: paths.dashboard.tour.root },
      //     { title: 'Details', path: paths.dashboard.tour.demo.details },
      //     { title: 'Create', path: paths.dashboard.tour.new },
      //     { title: 'Edit', path: paths.dashboard.tour.demo.edit },
      //   ],
      // },
      // { title: 'File manager', path: paths.dashboard.fileManager, icon: ICONS.folder },
      // {
      //   title: 'Mail',
      //   path: paths.dashboard.mail,
      //   icon: ICONS.mail,
      //   info: (
      //     <Label color="error" variant="inverted">
      //       +32
      //     </Label>
      //   ),
      // },
      // { title: 'Chat', path: paths.dashboard.chat, icon: ICONS.chat },
      // { title: 'Calendar', path: paths.dashboard.calendar, icon: ICONS.calendar },
      // { title: 'Kanban', path: paths.dashboard.kanban, icon: ICONS.kanban },
    ],
  },
  {
    subheader: 'Billing',
    items: [
      {
        title: 'Invoice Creation',
        path: paths.dashboard.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'List', path: paths.dashboard.invoice.root },
          { title: 'Create', path: paths.dashboard.invoice.new },
          // { title: 'Details', path: paths.dashboard.invoice.demo.details },
          // { title: 'Edit', path: paths.dashboard.invoice.demo.edit },
        ],
      },
      {
        title: 'Driver Payroll',
        path: paths.dashboard.driverPayroll.root,
        icon: ICONS.driverPayroll,
        children: [
          { title: 'List', path: paths.dashboard.driverPayroll.root },
          { title: 'Create', path: paths.dashboard.driverPayroll.new },
          // { title: 'Details', path: paths.dashboard.driverPayroll.demo.details },
          // { title: 'Edit', path: paths.dashboard.driverPayroll.demo.edit },
        ],
      },
      // {
      //   title: 'Transporter Payment',
      //   path: paths.dashboard.invoice.root,
      //   icon: ICONS.transporterPayment,
      //   children: [
      //     { title: 'List', path: paths.dashboard.invoice.root },
      //     { title: 'Create', path: paths.dashboard.invoice.new },
      //     { title: 'Details', path: paths.dashboard.invoice.demo.details },
      //     { title: 'Edit', path: paths.dashboard.invoice.demo.edit },
      //   ],
      // },
    ],
  },
  /**
   * Item State
   */
  // {
  //   subheader: 'Misc',
  //   items: [
  //     {
  //       // default roles : All roles can see this entry.
  //       // roles: ['user'] Only users can see this item.
  //       // roles: ['admin'] Only admin can see this item.
  //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
  //       // Reference from 'src/guards/RoleBasedGuard'.
  //       title: 'Permission',
  //       path: paths.dashboard.permission,
  //       icon: ICONS.lock,
  //       roles: ['admin', 'manager'],
  //       caption: 'Only admin can see this item',
  //     },
  //     {
  //       title: 'Level',
  //       path: '#/dashboard/menu_level',
  //       icon: ICONS.menuItem,
  //       children: [
  //         {
  //           title: 'Level 1a',
  //           path: '#/dashboard/menu_level/menu_level_1a',
  //           children: [
  //             {
  //               title: 'Level 2a',
  //               path: '#/dashboard/menu_level/menu_level_1a/menu_level_2a',
  //             },
  //             {
  //               title: 'Level 2b',
  //               path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b',
  //               children: [
  //                 {
  //                   title: 'Level 3a',
  //                   path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b/menu_level_3a',
  //                 },
  //                 {
  //                   title: 'Level 3b',
  //                   path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b/menu_level_3b',
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         { title: 'Level 1b', path: '#/dashboard/menu_level/menu_level_1b' },
  //       ],
  //     },
  //     {
  //       title: 'Disabled',
  //       path: '#disabled',
  //       icon: ICONS.disabled,
  //       disabled: true,
  //     },
  //     {
  //       title: 'Label',
  //       path: '#label',
  //       icon: ICONS.label,
  //       info: (
  //         <Label
  //           color="info"
  //           variant="inverted"
  //           startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}
  //         >
  //           NEW
  //         </Label>
  //       ),
  //     },
  //     {
  //       title: 'Caption',
  //       path: '#caption',
  //       icon: ICONS.menuItem,
  //       caption:
  //         'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
  //     },
  //     {
  //       title: 'Params',
  //       path: '/dashboard/params?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
  //       icon: ICONS.parameter,
  //     },
  //     {
  //       title: 'External link',
  //       path: 'https://www.google.com/',
  //       icon: ICONS.external,
  //       info: <Iconify width={18} icon="prime:external-link" />,
  //     },
  //     { title: 'Blank', path: paths.dashboard.blank, icon: ICONS.blank },
  //   ],
  // },
];
