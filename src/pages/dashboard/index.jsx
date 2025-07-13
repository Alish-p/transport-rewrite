import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import {
  useDashboardCounts,
  useSubtripMonthlyData,
  useSubtripStatusSummary,
  useInvoiceStatusSummary,
  useInvoiceAmountSummary,
} from 'src/query/use-dashboard';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function OverviewAppPage() {
  const { data: counts, isLoading: countsLoading, isError: countsError } = useDashboardCounts();

  const {
    data: subtripMonthlyData,
    isLoading: monthlyLoading,
    isError: monthlyError,
  } = useSubtripMonthlyData();

  const {
    data: subtripStatusSummary,
    isLoading: statusSummaryLoading,
    isError: statusSummaryError,
  } = useSubtripStatusSummary();

  const {
    data: invoiceStatusSummary,
    isLoading: invoiceStatusLoading,
    isError: invoiceStatusError,
  } = useInvoiceStatusSummary();

  const {
    data: invoiceAmountSummary,
    isLoading: invoiceAmountLoading,
    isError: invoiceAmountError,
  } = useInvoiceAmountSummary();

  if (
    countsLoading ||
    monthlyLoading ||
    statusSummaryLoading ||
    invoiceStatusLoading ||
    invoiceAmountLoading
  ) {
    return <LoadingScreen />;
  }

  if (
    countsError ||
    monthlyError ||
    statusSummaryError ||
    invoiceStatusError ||
    invoiceAmountError
  ) {
    return (
      <EmptyContent
        filled
        title="Something went wrong!"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <OverviewAppView
        counts={counts}
        subtripMonthlyData={subtripMonthlyData}
        subtripStatusSummary={subtripStatusSummary}
        invoiceStatusSummary={invoiceStatusSummary}
        invoiceAmountSummary={invoiceAmountSummary}
      />
    </>
  );
}
