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
  bank: icon('ic_bank'),
  expense: icon('ic_expense'),
  subtrip: icon('ic_subtrip'),
  trip: icon('ic_trip'),
  loan: icon('ic_driver_deductions'),
  driverSalary: icon('ic_driver_salary'),
  driverFinance: <Iconify icon="healthicons:truck-driver" />,
  transporterPayment: <Iconify icon="ri:money-rupee-circle-line" />,
};
// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Main',
    items: [{ title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard }],
  },

  {
    subheader: 'Quick Links',
    items: [
      {
        title: 'Create Job',
        path: paths.dashboard.subtrip.jobCreate,
        icon: ICONS.job,
        info: <Iconify icon="gravity-ui:star" />,
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
      // Trip Management Group
      {
        title: 'Trip',
        path: paths.dashboard.trip.root,
        icon: ICONS.trip,
        resource: 'trip',
        children: [{ title: 'List', path: paths.dashboard.trip.root, action: 'view' }],
      },
      {
        title: 'Jobs',
        path: paths.dashboard.subtrip.root,
        icon: ICONS.subtrip,
        resource: 'subtrip',
        children: [
          {
            title: 'Create Job',
            path: paths.dashboard.subtrip.jobCreate,
            action: 'create',
            info: <Iconify icon="mdi:briefcase-plus" />,
          },
          {
            title: 'Receive',
            path: paths.dashboard.subtrip.receive,
            action: 'update',
            info: <Iconify icon="material-symbols:call-received" />,
          },

          { title: 'List', path: paths.dashboard.subtrip.root, action: 'view' },
        ],
      },
      {
        title: 'Expense',
        path: paths.dashboard.expense.root,
        icon: ICONS.expense,
        resource: 'expense',
        children: [
          { title: 'List', path: paths.dashboard.expense.root, action: 'view' },
          {
            title: 'Add Expense to Job',
            path: paths.dashboard.expense.new,
            action: 'create',
          },
          {
            title: 'Add Expense to Vehicle ',
            path: paths.dashboard.expense.newVehicleExpense,
            action: 'create',
          },
        ],
      },

      // Asset Management Group
      {
        title: 'Vehicle',
        path: paths.dashboard.vehicle.root,
        icon: ICONS.vehicle,
        resource: 'vehicle',
        children: [
          { title: 'List', path: paths.dashboard.vehicle.root, action: 'view' },
          { title: 'Documents', path: paths.dashboard.vehicle.documents, action: 'view' },
          { title: 'Create', path: paths.dashboard.vehicle.new, action: 'create' },
        ],
      },
      {
        title: 'Pump',
        path: paths.dashboard.pump.root,
        icon: ICONS.pump,
        resource: 'pump',
        children: [
          { title: 'List', path: paths.dashboard.pump.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.pump.new, action: 'create' },
        ],
      },

      // People Management Group
      {
        title: 'Driver',
        path: paths.dashboard.driver.root,
        icon: ICONS.driver,
        resource: 'driver',
        children: [
          { title: 'List', path: paths.dashboard.driver.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.driver.new, action: 'create' },
        ],
      },
      {
        title: 'Customer',
        path: paths.dashboard.customer.root,
        icon: ICONS.customer,
        resource: 'customer',
        children: [
          { title: 'List', path: paths.dashboard.customer.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.customer.new, action: 'create' },
        ],
      },
      {
        title: 'Transporter',
        path: paths.dashboard.transporter.root,
        icon: ICONS.transporter,
        resource: 'transporter',
        children: [
          { title: 'List', path: paths.dashboard.transporter.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.transporter.new, action: 'create' },
        ],
      },

      // Other Management Items
      {
        title: 'Route',
        path: paths.dashboard.route.root,
        icon: ICONS.route,
        resource: 'route',
        children: [
          { title: 'List', path: paths.dashboard.route.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.route.new, action: 'create' },
        ],
      },
      {
        title: 'Bank',
        path: paths.dashboard.bank.root,
        icon: ICONS.bank,
        resource: 'bank',
        children: [
          { title: 'List', path: paths.dashboard.bank.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.bank.new, action: 'create' },
        ],
      },
      {
        title: 'User',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        resource: 'user',
        children: [
          { title: 'List', path: paths.dashboard.user.list },
          { title: 'Create', path: paths.dashboard.user.new },
        ],
      },
      { title: 'Issue Tracker', path: paths.dashboard.kanban, icon: ICONS.kanban },
    ],
  },

  {
    subheader: 'Billing',
    items: [
      {
        title: 'Customer Invoice',
        path: paths.dashboard.invoice.root,
        icon: ICONS.invoice,
        resource: 'invoice',
        children: [
          { title: 'List', path: paths.dashboard.invoice.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.invoice.new, action: 'create' },
        ],
      },
      {
        title: 'Transporter Payment',
        path: paths.dashboard.transporterPayment.root,
        icon: ICONS.transporterPayment,
        resource: 'transporterPayment',
        children: [
          { title: 'List', path: paths.dashboard.transporterPayment.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.transporterPayment.new, action: 'create' },
          {
            title: 'Bulk Create',
            path: paths.dashboard.transporterPayment.bulkCreate,
            action: 'create',
          },
        ],
      },

      {
        title: 'Driver Payroll',
        path: paths.dashboard.driverSalary.root,
        icon: ICONS.driverSalary,
        resource: 'driverSalary',
        children: [
          { title: 'List', path: paths.dashboard.driverSalary.root, action: 'view' },
          {
            title: 'Create',
            path: paths.dashboard.driverSalary.new,
            action: 'create',
          },
        ],
      },

      {
        title: 'Loans',
        path: paths.dashboard.loan.root,
        icon: ICONS.loan,
        resource: 'loan',
        children: [
          { title: 'List', path: paths.dashboard.loan.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.loan.new, action: 'create' },
        ],
      },
    ],
  },
];
