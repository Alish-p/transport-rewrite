import { toast } from 'sonner';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import LinearProgress from '@mui/material/LinearProgress';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import {
  evaluateTenantOnboarding,
  exportTenantOnboardingToExcel,
} from './utils/tenant-onboarding-tracker';

// ----------------------------------------------------------------------

export function TenantOnboardingWidget({ tenant, users = [], stats = {}, sx, ...other }) {
  const [downloading, setDownloading] = useState(false);

  const evaluation = evaluateTenantOnboarding(tenant, users, stats);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await exportTenantOnboardingToExcel(tenant, users, stats);
      toast.success('Onboarding Progress Tracker downloaded successfully');
    } catch (error) {
      console.error('Failed to export onboarding tracker:', error);
      toast.error('Failed to download onboarding tracker');
    } finally {
      setDownloading(false);
    }
  };

  const getProgressColor = (pct) => {
    if (pct >= 90) return 'success';
    if (pct >= 60) return 'primary';
    if (pct >= 40) return 'warning';
    return 'error';
  };

  const progressColor = getProgressColor(evaluation.overallPercentage);

  return (
    <Card
      sx={{
        p: 2.5,
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...other}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => `${theme.palette[progressColor].main}1A`,
              color: `${progressColor}.main`,
            }}
          >
            <Iconify icon="solar:clipboard-check-bold" width={26} />
          </Box>
          <div>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6">Onboarding Progress Tracker</Typography>
              <Label color={progressColor} variant="soft">
                {evaluation.overallPercentage}% Complete
              </Label>
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {evaluation.completedItems} of {evaluation.totalItems} configuration & profile parameters fulfilled
            </Typography>
          </div>
        </Stack>

        <LoadingButton
          size="small"
          variant="contained"
          color="primary"
          loading={downloading}
          startIcon={<Iconify icon="solar:file-download-bold" />}
          onClick={handleDownload}
        >
          Download Tracker (.xlsx)
        </LoadingButton>
      </Stack>

      <Box sx={{ my: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            Overall Readiness
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: `${progressColor}.main` }}>
            {evaluation.overallPercentage}%
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={evaluation.overallPercentage}
          color={progressColor}
          sx={{ height: 8, borderRadius: 1 }}
        />
      </Box>

      <Stack
        direction="row"
        flexWrap="wrap"
        gap={1.5}
        sx={{ mt: 2, pt: 1.5, borderTop: (theme) => `1px dashed ${theme.palette.divider}` }}
      >
        <Tooltip title="Critical business fields required for core operations">
          <Box
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 1,
              bgcolor: 'background.neutral',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Iconify
              icon={evaluation.requiredPercentage === 100 ? 'solar:check-circle-bold' : 'solar:danger-triangle-bold'}
              sx={{ color: evaluation.requiredPercentage === 100 ? 'success.main' : 'error.main' }}
              width={18}
            />
            <Typography variant="body2">
              <strong>Required:</strong> {evaluation.requiredCompleted}/{evaluation.requiredTotal}
            </Typography>
          </Box>
        </Tooltip>

        <Tooltip title="Recommended fields for complete branding, tax, and invoicing">
          <Box
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 1,
              bgcolor: 'background.neutral',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Iconify icon="solar:star-bold" sx={{ color: 'warning.main' }} width={18} />
            <Typography variant="body2">
              <strong>Recommended:</strong> {evaluation.recommendedCompleted}/{evaluation.recommendedTotal}
            </Typography>
          </Box>
        </Tooltip>

        <Tooltip title="Registered users with portal access">
          <Box
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 1,
              bgcolor: 'background.neutral',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Iconify icon="solar:users-group-rounded-bold" sx={{ color: 'info.main' }} width={18} />
            <Typography variant="body2">
              <strong>Users:</strong> {users.length} Active
            </Typography>
          </Box>
        </Tooltip>

        <Tooltip title="Master data setup readiness">
          <Box
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 1,
              bgcolor: 'background.neutral',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Iconify icon="solar:box-bold" sx={{ color: 'secondary.main' }} width={18} />
            <Typography variant="body2">
              <strong>Master Data:</strong> {stats?.counts?.vehicles ?? 0} Vehicles, {stats?.counts?.customers ?? 0} Customers
            </Typography>
          </Box>
        </Tooltip>
      </Stack>
    </Card>
  );
}
