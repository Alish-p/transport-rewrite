import { Box } from '@mui/material';

export function WhatsAppLayout({ nav, header, messages, input, details, navCollapsed, detailsOpen }) {
  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* Nav */}
      <Box
        sx={{
          width: navCollapsed ? 72 : 320,
          flexShrink: 0,
          borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
          transition: (theme) =>
            theme.transitions.create('width', {
              duration: theme.transitions.duration.standard,
            }),
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
        }}
      >
        {nav}
      </Box>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, bgcolor: 'background.paper' }}>
        <Box sx={{ flexShrink: 0 }}>{header}</Box>
        <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>{messages}</Box>
        <Box sx={{ flexShrink: 0 }}>{input}</Box>
      </Box>

      {/* Details */}
      <Box
        sx={{
          width: detailsOpen ? 320 : 0,
          flexShrink: 0,
          borderLeft: (theme) => (detailsOpen ? `solid 1px ${theme.palette.divider}` : 'none'),
          transition: (theme) =>
            theme.transitions.create('width', {
              duration: theme.transitions.duration.standard,
            }),
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {details}
        </Box>
      </Box>
    </Box>
  );
}
