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
  driverDeductions: icon('ic_driver_deductions'),
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
        ],
      },
      {
        title: 'Subtrip',
        path: paths.dashboard.subtrip.root,
        icon: ICONS.subtrip,
        children: [
          { title: 'List', path: paths.dashboard.subtrip.root },
          { title: 'Create', path: paths.dashboard.subtrip.new },
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
        ],
      },

      {
        title: 'Vehicle',
        path: paths.dashboard.vehicle.root,
        icon: ICONS.vehicle,
        children: [
          { title: 'List', path: paths.dashboard.vehicle.root },
          { title: 'Create', path: paths.dashboard.vehicle.new },
        ],
      },

      {
        title: 'Driver',
        path: paths.dashboard.driver.root,
        icon: ICONS.driver,
        children: [
          { title: 'List', path: paths.dashboard.driver.root },
          { title: 'Create', path: paths.dashboard.driver.new },
        ],
      },

      {
        title: 'Customer',
        path: paths.dashboard.customer.root,
        icon: ICONS.customer,
        children: [
          { title: 'List', path: paths.dashboard.customer.root },
          { title: 'Create', path: paths.dashboard.customer.new },
        ],
      },

      {
        title: 'Transporter',
        path: paths.dashboard.transporter.root,
        icon: ICONS.transporter,
        children: [
          { title: 'List', path: paths.dashboard.transporter.root },
          { title: 'Create', path: paths.dashboard.transporter.new },
        ],
      },

      {
        title: 'Pump',
        path: paths.dashboard.pump.root,
        icon: ICONS.pump,
        children: [
          { title: 'List', path: paths.dashboard.pump.root },
          { title: 'Create', path: paths.dashboard.pump.new },
        ],
      },

      {
        title: 'Diesel Prices',
        path: paths.dashboard.dieselPrice.root,
        icon: ICONS.diesel,
        children: [
          { title: 'List', path: paths.dashboard.dieselPrice.list },
          { title: 'Create', path: paths.dashboard.dieselPrice.new },
        ],
      },

      {
        title: 'Route',
        path: paths.dashboard.route.root,
        icon: ICONS.route,
        children: [
          { title: 'List', path: paths.dashboard.route.root },
          { title: 'Create', path: paths.dashboard.route.new },
        ],
      },

      {
        title: 'Bank',
        path: paths.dashboard.bank.root,
        icon: ICONS.bank,
        children: [
          { title: 'List', path: paths.dashboard.bank.root },
          { title: 'Create', path: paths.dashboard.bank.new },
        ],
      },
    ],
  },
  {
    subheader: 'Billing',
    roles: ['admin', 'manager'],
    items: [
      {
        title: 'Invoice Creation',
        path: paths.dashboard.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'List', path: paths.dashboard.invoice.root },
          { title: 'Create', path: paths.dashboard.invoice.new },
        ],
      },
      {
        title: 'Driver Finance',
        icon: ICONS.driverFinance,
        path: paths.dashboard.driverPayroll.root,
        children: [
          {
            title: 'Driver Payroll',
            path: paths.dashboard.driverPayroll.root,
            icon: ICONS.driverPayroll,
            children: [
              { title: 'List', path: paths.dashboard.driverPayroll.root },
              { title: 'Create', path: paths.dashboard.driverPayroll.new },
            ],
          },
          {
            title: 'Driver Deductions',
            path: paths.dashboard.driverDeductions.root,
            icon: ICONS.driverDeductions,
            children: [
              { title: 'List', path: paths.dashboard.driverDeductions.root },
              { title: 'Create', path: paths.dashboard.driverDeductions.new },
            ],
          },
        ],
      },

      {
        title: 'Transporter Payment',
        path: paths.dashboard.transporterPayment.root,
        icon: ICONS.transporterPayment,
        children: [
          { title: 'List', path: paths.dashboard.transporterPayment.root },
          { title: 'Create', path: paths.dashboard.transporterPayment.new },
        ],
      },
    ],
  },
];
