import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const IOS_STEPS = [
  {
    icon: 'solar:square-share-line-bold',
    text: 'Tap the Share button at the bottom of Safari',
  },
  {
    icon: 'solar:add-square-bold',
    text: 'Scroll down and tap "Add to Home Screen"',
  },
  {
    icon: 'solar:check-square-bold',
    text: 'Tap "Add" in the top-right corner',
  },
];

const MAC_SAFARI_STEPS = [
  {
    icon: 'solar:menu-dots-bold',
    text: 'Click "File" in the Safari menu bar',
  },
  {
    icon: 'solar:add-square-bold',
    text: 'Click "Add to Dock"',
  },
];

const CHROME_DESKTOP_STEPS = [
  {
    icon: 'solar:menu-dots-bold',
    text: 'Click the browser menu (⋮) in the top-right corner',
  },
  {
    icon: 'solar:download-minimalistic-bold',
    text: 'Click "Install Tranzit" or "Install app"',
  },
];

// ----------------------------------------------------------------------

function getStepsAndLabel(isIos, isMacSafari) {
  if (isIos) return { steps: IOS_STEPS, platformLabel: 'iPhone / iPad', target: 'home screen' };
  if (isMacSafari) return { steps: MAC_SAFARI_STEPS, platformLabel: 'Mac', target: 'dock' };
  return { steps: CHROME_DESKTOP_STEPS, platformLabel: 'your device', target: 'desktop' };
}

export function InstallAppDialog({ open, onClose, isIos, isMacSafari }) {
  const { steps, platformLabel, target } = getStepsAndLabel(isIos, isMacSafari);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Install Tranzit on {platformLabel}</DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Follow these steps to add Tranzit to your {target}:
        </Typography>

        <Stack spacing={2.5}>
          {steps.map((step, index) => (
            <Stack key={step.text} direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1.5,
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {index + 1}
                </Typography>
              </Box>

              <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                <Iconify icon={step.icon} width={24} sx={{ color: 'primary.main', flexShrink: 0 }} />
                <Typography variant="body2">{step.text}</Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="soft" color="inherit">
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}
