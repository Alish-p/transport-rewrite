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
  diesel: icon('ic_diesel'),
  loan: icon('ic_driver_deductions'),
  driverPayroll: icon('ic_driver_salary'),
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
        title: 'Create Trip',
        path: paths.dashboard.trip.new,
        icon: ICONS.trip,
        info: <Iconify icon="gravity-ui:star" />,
        resource: 'trip',
        action: 'create',
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
        resource: 'trip',
        children: [
          { title: 'List', path: paths.dashboard.trip.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.trip.new, action: 'create' },
        ],
      },
      {
        title: 'Subtrip',
        path: paths.dashboard.subtrip.root,
        icon: ICONS.subtrip,
        resource: 'subtrip',
        children: [
          { title: 'List', path: paths.dashboard.subtrip.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.subtrip.new, action: 'create' },
        ],
      },

      {
        title: 'Expense',
        path: paths.dashboard.expense.root,
        icon: ICONS.expense,
        resource: 'expense',
        children: [
          { title: 'List', path: paths.dashboard.expense.root, action: 'view' },
          { title: 'Add Expense to Subtrip', path: paths.dashboard.expense.new, action: 'create' },
          {
            title: 'Add Expense to Vehicle ',
            path: paths.dashboard.expense.newVehicleExpense,
            action: 'create',
          },
        ],
      },

      {
        title: 'Vehicle',
        path: paths.dashboard.vehicle.root,
        icon: ICONS.vehicle,
        resource: 'vehicle',
        children: [
          { title: 'List', path: paths.dashboard.vehicle.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.vehicle.new, action: 'create' },
        ],
      },

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

      {
        title: 'Diesel Prices',
        path: paths.dashboard.dieselPrice.root,
        icon: ICONS.diesel,
        resource: 'dieselPrice',
        children: [
          { title: 'List', path: paths.dashboard.dieselPrice.list, action: 'view' },
          { title: 'Create', path: paths.dashboard.dieselPrice.new, action: 'create' },
        ],
      },

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
          { title: 'Cards', path: paths.dashboard.user.cards },
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
        title: 'Invoice Creation',
        path: paths.dashboard.invoice.root,
        icon: ICONS.invoice,
        resource: 'invoice',
        children: [
          { title: 'List', path: paths.dashboard.invoice.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.invoice.new, action: 'create' },
        ],
      },

      {
        title: 'Driver Payroll',
        path: paths.dashboard.driverPayroll.root,
        icon: ICONS.driverPayroll,
        resource: 'driverPayroll',
        children: [
          { title: 'List', path: paths.dashboard.driverPayroll.root, action: 'view' },
          {
            title: 'Create',
            path: paths.dashboard.driverPayroll.new,
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

      {
        title: 'Transporter Payment',
        path: paths.dashboard.transporterPayment.root,
        icon: ICONS.transporterPayment,
        resource: 'transporterPayment',
        children: [
          { title: 'List', path: paths.dashboard.transporterPayment.root, action: 'view' },
          { title: 'Create', path: paths.dashboard.transporterPayment.new, action: 'create' },
        ],
      },
    ],
  },
];
