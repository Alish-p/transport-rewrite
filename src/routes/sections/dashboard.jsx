import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
const OverviewCoursePage = lazy(() => import('src/pages/dashboard/course'));

// Product
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));

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

// Order
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));

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

// User
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// Blog
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// Job
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// Tour
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// File manager
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// App
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
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
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      { path: 'course', element: <OverviewCoursePage /> },
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
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
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
          { element: <DriverListPage />, index: true },
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
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
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
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'params', element: <ParamsPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
