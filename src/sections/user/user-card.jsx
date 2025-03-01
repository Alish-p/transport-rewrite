import { useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';

import { _mock } from 'src/_mock';
import { varAlpha } from 'src/theme/styles';
import { AvatarShape } from 'src/assets/illustrations';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function UserCard({ user, idx }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <AvatarShape
          sx={{
            left: 0,
            right: 0,
            zIndex: 10,
            mx: 'auto',
            bottom: -26,
            position: 'absolute',
          }}
        />

        <Avatar
          alt={user.name}
          src={user.avatarUrl}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />

        <Image
          src={_mock.image.cover(idx + 1)}
          alt={_mock.image.cover(idx + 1)}
          ratio="16/9"
          slotProps={{
            overlay: {
              background: (theme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.48),
            },
          }}
        />
      </Box>

      <ListItemText
        sx={{ mt: 7, mb: 1 }}
        primary={user.name}
        secondary={user.email}
        primaryTypographyProps={{ typography: 'subtitle1' }}
        secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
      />

      <Stack spacing={1} sx={{ px: 3, mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          📱 {user.mobile}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          📍 {user.address}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 2.5 }}>
        <IconButton onClick={() => navigate(paths.dashboard.user.details(user._id))}>
          <Iconify icon="mingcute:eye-line" />
        </IconButton>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        sx={{ py: 3, typography: 'subtitle1' }}
      >
        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.5, color: 'text.secondary' }}>
            Created
          </Typography>
          {new Date(user.createdAt).toLocaleDateString()}
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.5, color: 'text.secondary' }}>
            Updated
          </Typography>
          {new Date(user.updatedAt).toLocaleDateString()}
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.5, color: 'text.secondary' }}>
            Designation
          </Typography>
          {user.designation || 'User'}
        </div>
      </Box>
    </Card>
  );
}
