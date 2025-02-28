import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard, PermissionBasedGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));

// Vehicle
const VehicleDetailsPage = lazy(() => import('src/pages/dashboard/vehicle/details'));
const VehicleListPage = lazy(() => import('src/pages/dashboard/vehicle/list'));
const VehicleCreatePage = lazy(() => import('src/pages/dashboard/vehicle/new'));
const VehicleEditPage = lazy(() => import('src/pages/dashboard/vehicle/edit'));

// Driver
const DriverDetailsPage = lazy(() => import('src/pages/dashboard/driver/details'));
const DriverListPage = lazy(() => import('src/pages/dashboard/driver/list'));
const DriverCreatePage = lazy(() => import('src/pages/dashboard/driver/new'));
const DriverEditPage = lazy(() => import('src/pages/dashboard/driver/edit'));

// Pump
const PumpDetailsPage = lazy(() => import('src/pages/dashboard/pump/details'));
const PumpListPage = lazy(() => import('src/pages/dashboard/pump/list'));
const PumpCreatePage = lazy(() => import('src/pages/dashboard/pump/new'));
const PumpEditPage = lazy(() => import('src/pages/dashboard/pump/edit'));

// DieselPrice
const DieselPriceDetailsPage = lazy(() => import('src/pages/dashboard/diesel-prices/details'));
const DieselPriceListPage = lazy(() => import('src/pages/dashboard/diesel-prices/list'));
const DieselPriceCreatePage = lazy(() => import('src/pages/dashboard/diesel-prices/new'));
const DieselPriceEditPage = lazy(() => import('src/pages/dashboard/diesel-prices/edit'));

// Customer
const CustomerDetailsPage = lazy(() => import('src/pages/dashboard/customer/details'));
const CustomerListPage = lazy(() => import('src/pages/dashboard/customer/list'));
const CustomerCreatePage = lazy(() => import('src/pages/dashboard/customer/new'));
const CustomerEditPage = lazy(() => import('src/pages/dashboard/customer/edit'));

// Transporter
const TransporterDetailsPage = lazy(() => import('src/pages/dashboard/transporter/details'));
const TransporterListPage = lazy(() => import('src/pages/dashboard/transporter/list'));
const TransporterCreatePage = lazy(() => import('src/pages/dashboard/transporter/new'));
const TransporterEditPage = lazy(() => import('src/pages/dashboard/transporter/edit'));

// Route
const RouteDetailsPage = lazy(() => import('src/pages/dashboard/route/details'));
const RouteListPage = lazy(() => import('src/pages/dashboard/route/list'));
const RouteCreatePage = lazy(() => import('src/pages/dashboard/route/new'));
const RouteEditPage = lazy(() => import('src/pages/dashboard/route/edit'));

// Bank
const BankDetailsPage = lazy(() => import('src/pages/dashboard/bank/details'));
const BankListPage = lazy(() => import('src/pages/dashboard/bank/list'));
const BankCreatePage = lazy(() => import('src/pages/dashboard/bank/new'));
const BankEditPage = lazy(() => import('src/pages/dashboard/bank/edit'));

// Expense
const ExpenseDetailsPage = lazy(() => import('src/pages/dashboard/expense/details'));
const ExpenseListPage = lazy(() => import('src/pages/dashboard/expense/list'));
const ExpenseCreatePage = lazy(() => import('src/pages/dashboard/expense/new'));
const VehicleExpenseCreatePage = lazy(
  () => import('src/pages/dashboard/expense/newVehicleExpense')
);
const ExpenseEditPage = lazy(() => import('src/pages/dashboard/expense/edit'));

// Subtrip
const SubtripDetailsPage = lazy(() => import('src/pages/dashboard/subtrip/details'));
const SubtripListPage = lazy(() => import('src/pages/dashboard/subtrip/list'));
const SubtripCreatePage = lazy(() => import('src/pages/dashboard/subtrip/new'));
const SubtripEditPage = lazy(() => import('src/pages/dashboard/subtrip/edit'));

// Trip
const TripDetailsPage = lazy(() => import('src/pages/dashboard/trip/details'));
const TripListPage = lazy(() => import('src/pages/dashboard/trip/list'));
const TripCreatePage = lazy(() => import('src/pages/dashboard/trip/new'));
const TripEditPage = lazy(() => import('src/pages/dashboard/trip/edit'));

// Invoice
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));

// DriverPayroll
const DriverPayrollListPage = lazy(() => import('src/pages/dashboard/driver-payroll/list'));
const DriverPayrollDetailsPage = lazy(() => import('src/pages/dashboard/driver-payroll/details'));
const DriverPayrollCreatePage = lazy(() => import('src/pages/dashboard/driver-payroll/new'));
const DriverPayrollEditPage = lazy(() => import('src/pages/dashboard/driver-payroll/edit'));

// Loans
const LoansListPage = lazy(() => import('src/pages/dashboard/loans/list'));
const LoansDetailsPage = lazy(() => import('src/pages/dashboard/loans/details'));
const LoansCreatePage = lazy(() => import('src/pages/dashboard/loans/new'));
const LoansEditPage = lazy(() => import('src/pages/dashboard/loans/edit'));

// DriverPayroll
const TransporterPaymentListPage = lazy(
  () => import('src/pages/dashboard/transporter-payment/list')
);
const TransporterPaymentDetailsPage = lazy(
  () => import('src/pages/dashboard/transporter-payment/details')
);
const TransporterPaymentCreatePage = lazy(
  () => import('src/pages/dashboard/transporter-payment/new')
);
const TransporterPaymentEditPage = lazy(
  () => import('src/pages/dashboard/transporter-payment/edit')
);

// User
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));

// Test render page by role
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// Blank page
const ParamsPage = lazy(() => import('src/pages/dashboard/params'));
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },

      {
        path: 'vehicle',
        children: [
          { element: <VehicleListPage />, index: true },
          { path: 'list', element: <VehicleListPage /> },
          { path: ':id', element: <VehicleDetailsPage /> },
          { path: 'new', element: <VehicleCreatePage /> },
          { path: ':id/edit', element: <VehicleEditPage /> },
        ],
      },

      {
        path: 'driver',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="driver" action="view" hasContent>
                <DriverListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          { path: 'list', element: <DriverListPage /> },
          { path: ':id', element: <DriverDetailsPage /> },
          { path: 'new', element: <DriverCreatePage /> },
          { path: ':id/edit', element: <DriverEditPage /> },
        ],
      },

      {
        path: 'pump',
        children: [
          { element: <PumpListPage />, index: true },
          { path: 'list', element: <PumpListPage /> },
          { path: ':id', element: <PumpDetailsPage /> },
          { path: 'new', element: <PumpCreatePage /> },
          { path: ':id/edit', element: <PumpEditPage /> },
        ],
      },
      {
        path: 'dieselPrice',
        children: [
          { element: <DieselPriceListPage />, index: true },
          { path: 'list', element: <DieselPriceListPage /> },
          { path: ':id', element: <DieselPriceDetailsPage /> },
          { path: 'new', element: <DieselPriceCreatePage /> },
          { path: ':id/edit', element: <DieselPriceEditPage /> },
        ],
      },

      {
        path: 'customer',
        children: [
          { element: <CustomerListPage />, index: true },
          { path: 'list', element: <CustomerListPage /> },
          { path: ':id', element: <CustomerDetailsPage /> },
          { path: 'new', element: <CustomerCreatePage /> },
          { path: ':id/edit', element: <CustomerEditPage /> },
        ],
      },

      {
        path: 'transporter',
        children: [
          { element: <TransporterListPage />, index: true },
          { path: 'list', element: <TransporterListPage /> },
          { path: ':id', element: <TransporterDetailsPage /> },
          { path: 'new', element: <TransporterCreatePage /> },
          { path: ':id/edit', element: <TransporterEditPage /> },
        ],
      },

      {
        path: 'route',
        children: [
          { element: <RouteListPage />, index: true },
          { path: 'list', element: <RouteListPage /> },
          { path: ':id', element: <RouteDetailsPage /> },
          { path: 'new', element: <RouteCreatePage /> },
          { path: ':id/edit', element: <RouteEditPage /> },
        ],
      },
      {
        path: 'bank',
        children: [
          { element: <BankListPage />, index: true },
          { path: 'list', element: <BankListPage /> },
          { path: ':id', element: <BankDetailsPage /> },
          { path: 'new', element: <BankCreatePage /> },
          { path: ':id/edit', element: <BankEditPage /> },
        ],
      },
      {
        path: 'expense',
        children: [
          { element: <ExpenseListPage />, index: true },
          { path: 'list', element: <ExpenseListPage /> },
          { path: ':id', element: <ExpenseDetailsPage /> },
          { path: 'new-subtrip-expense', element: <ExpenseCreatePage /> },
          { path: 'new-vehicle-expense', element: <VehicleExpenseCreatePage /> },
          { path: ':id/edit', element: <ExpenseEditPage /> },
        ],
      },
      {
        path: 'subtrip',
        children: [
          { element: <SubtripListPage />, index: true },
          { path: 'list', element: <SubtripListPage /> },
          { path: ':id', element: <SubtripDetailsPage /> },
          { path: 'new', element: <SubtripCreatePage /> },
          { path: ':id/edit', element: <SubtripEditPage /> },
        ],
      },
      {
        path: 'trip',
        children: [
          { element: <TripListPage />, index: true },
          { path: 'list', element: <TripListPage /> },
          { path: ':id', element: <TripDetailsPage /> },
          { path: 'new', element: <TripCreatePage /> },
          { path: ':id/edit', element: <TripEditPage /> },
        ],
      },

      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'driverPayroll',
        children: [
          { element: <DriverPayrollListPage />, index: true },
          { path: 'list', element: <DriverPayrollListPage /> },
          { path: ':id', element: <DriverPayrollDetailsPage /> },
          { path: ':id/edit', element: <DriverPayrollEditPage /> },
          { path: 'new', element: <DriverPayrollCreatePage /> },
        ],
      },

      {
        path: 'loan',
        children: [
          { element: <LoansListPage />, index: true },
          { path: 'list', element: <LoansListPage /> },
          { path: ':id', element: <LoansDetailsPage /> },
          { path: ':id/edit', element: <LoansEditPage /> },
          { path: 'new', element: <LoansCreatePage /> },
        ],
      },

      {
        path: 'transporterPayment',
        children: [
          { element: <TransporterPaymentListPage />, index: true },
          { path: 'list', element: <TransporterPaymentListPage /> },
          { path: ':id', element: <TransporterPaymentDetailsPage /> },
          { path: ':id/edit', element: <TransporterPaymentEditPage /> },
          { path: 'new', element: <TransporterPaymentCreatePage /> },
        ],
      },

      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'params', element: <ParamsPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
