import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard, PermissionBasedGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));

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
const ExpenseReportPage = lazy(() => import('src/pages/dashboard/expense/report'));
const VehicleExpenseCreatePage = lazy(
  () => import('src/pages/dashboard/expense/newVehicleExpense')
);

// Subtrip
const SubtripDetailsPage = lazy(() => import('src/pages/dashboard/subtrip/details'));
const SubtripListPage = lazy(() => import('src/pages/dashboard/subtrip/list'));
const SubtripReportsPage = lazy(() => import('src/pages/dashboard/subtrip/reports'));
const SubtripCreatePage = lazy(() => import('src/pages/dashboard/subtrip/new'));
const SubtripEditPage = lazy(() => import('src/pages/dashboard/subtrip/edit'));
const SubtripReceivePage = lazy(() => import('src/pages/dashboard/subtrip/receive-subtrip'));
const SubtripLoadPage = lazy(() => import('src/pages/dashboard/subtrip/load-subtrip'));

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
const UserDetailPage = lazy(() => import('src/pages/dashboard/user/details'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));

// Kanban
const KanbanPage = lazy(() => import('src/pages/dashboard/issue-tracker'));

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
        path: 'vehicle',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="vehicle" action="view" hasContent>
                <VehicleListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="vehicle" action="view" hasContent>
                <VehicleListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="vehicle" action="view" hasContent>
                <VehicleDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="vehicle" action="create" hasContent>
                <VehicleCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="vehicle" action="update" hasContent>
                <VehicleEditPage />
              </PermissionBasedGuard>
            ),
          },
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
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="driver" action="view" hasContent>
                <DriverListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="driver" action="view" hasContent>
                <DriverDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="driver" action="create" hasContent>
                <DriverCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="driver" action="update" hasContent>
                <DriverEditPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },

      {
        path: 'pump',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="pump" action="view" hasContent>
                <PumpListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="pump" action="view" hasContent>
                <PumpListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="pump" action="view" hasContent>
                <PumpDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="pump" action="create" hasContent>
                <PumpCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="pump" action="update" hasContent>
                <PumpEditPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },
      {
        path: 'diesel',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="diesel" action="view" hasContent>
                <DieselPriceListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="diesel" action="view" hasContent>
                <DieselPriceListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="diesel" action="view" hasContent>
                <DieselPriceDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="diesel" action="create" hasContent>
                <DieselPriceCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="diesel" action="update" hasContent>
                <DieselPriceEditPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },

      {
        path: 'customer',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="customer" action="view" hasContent>
                <CustomerListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="customer" action="view" hasContent>
                <CustomerListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="customer" action="view" hasContent>
                <CustomerDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="customer" action="create" hasContent>
                <CustomerCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="customer" action="update" hasContent>
                <CustomerEditPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },

      {
        path: 'transporter',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="transporter" action="view" hasContent>
                <TransporterListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="transporter" action="view" hasContent>
                <TransporterListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="transporter" action="view" hasContent>
                <TransporterDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="transporter" action="create" hasContent>
                <TransporterCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="transporter" action="update" hasContent>
                <TransporterEditPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },

      {
        path: 'route',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="route" action="view" hasContent>
                <RouteListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="route" action="view" hasContent>
                <RouteListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="route" action="view" hasContent>
                <RouteDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="route" action="create" hasContent>
                <RouteCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="route" action="update" hasContent>
                <RouteEditPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },
      {
        path: 'bank',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="bank" action="view" hasContent>
                <BankListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="bank" action="view" hasContent>
                <BankListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="bank" action="view" hasContent>
                <BankDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="bank" action="create" hasContent>
                <BankCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="bank" action="update" hasContent>
                <BankEditPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },
      {
        path: 'expense',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="expense" action="view" hasContent>
                <ExpenseListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="expense" action="view" hasContent>
                <ExpenseListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'reports',
            element: (
              <PermissionBasedGuard resource="expense" action="view" hasContent>
                <ExpenseReportPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="expense" action="view" hasContent>
                <ExpenseDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new-subtrip-expense',
            element: (
              <PermissionBasedGuard resource="expense" action="create" hasContent>
                <ExpenseCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new-vehicle-expense',
            element: (
              <PermissionBasedGuard resource="expense" action="create" hasContent>
                <VehicleExpenseCreatePage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },
      {
        path: 'subtrip',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="subtrip" action="view" hasContent>
                <SubtripListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="subtrip" action="view" hasContent>
                <SubtripListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="subtrip" action="view" hasContent>
                <SubtripDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="subtrip" action="create" hasContent>
                <SubtripCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="subtrip" action="update" hasContent>
                <SubtripEditPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'receive',
            element: (
              <PermissionBasedGuard resource="subtrip" action="update" hasContent>
                <SubtripReceivePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'load',
            element: (
              <PermissionBasedGuard resource="subtrip" action="update" hasContent>
                <SubtripLoadPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'reports',
            element: (
              <PermissionBasedGuard resource="subtrip" action="view" hasContent>
                <SubtripReportsPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },
      {
        path: 'trip',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="trip" action="view" hasContent>
                <TripListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="trip" action="view" hasContent>
                <TripListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="trip" action="view" hasContent>
                <TripDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="trip" action="create" hasContent>
                <TripCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="trip" action="update" hasContent>
                <TripEditPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },

      {
        path: 'invoice',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="invoice" action="view" hasContent>
                <InvoiceListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="invoice" action="view" hasContent>
                <InvoiceListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="invoice" action="view" hasContent>
                <InvoiceDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="invoice" action="create" hasContent>
                <InvoiceCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="invoice" action="update" hasContent>
                <InvoiceEditPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },
      {
        path: 'driverSalary',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="driverSalary" action="view" hasContent>
                <DriverPayrollListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="driverSalary" action="view" hasContent>
                <DriverPayrollListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="driverSalary" action="view" hasContent>
                <DriverPayrollDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="driverSalary" action="create" hasContent>
                <DriverPayrollCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="driverSalary" action="update" hasContent>
                <DriverPayrollEditPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },

      {
        path: 'loan',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="loan" action="view" hasContent>
                <LoansListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="loan" action="view" hasContent>
                <LoansListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="loan" action="view" hasContent>
                <LoansDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="loan" action="create" hasContent>
                <LoansCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="loan" action="update" hasContent>
                <LoansEditPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },
      {
        path: 'user',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="user" action="view" hasContent>
                <UserListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="user" action="view" hasContent>
                <UserDetailPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'cards',
            element: (
              <PermissionBasedGuard resource="user" action="view" hasContent>
                <UserCardsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="user" action="view" hasContent>
                <UserListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="user" action="create" hasContent>
                <UserCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="user" action="update" hasContent>
                <UserEditPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },

      {
        path: 'transporterPayment',
        children: [
          {
            element: (
              <PermissionBasedGuard resource="transporterPayment" action="view" hasContent>
                <TransporterPaymentListPage />
              </PermissionBasedGuard>
            ),
            index: true,
          },
          {
            path: 'list',
            element: (
              <PermissionBasedGuard resource="transporterPayment" action="view" hasContent>
                <TransporterPaymentListPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <PermissionBasedGuard resource="transporterPayment" action="view" hasContent>
                <TransporterPaymentDetailsPage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionBasedGuard resource="transporterPayment" action="create" hasContent>
                <TransporterPaymentCreatePage />
              </PermissionBasedGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionBasedGuard resource="transporterPayment" action="update" hasContent>
                <TransporterPaymentEditPage />
              </PermissionBasedGuard>
            ),
          },
        ],
      },

      { path: 'kanban', element: <KanbanPage /> },

      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'params', element: <ParamsPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
