import { useMemo, useState } from 'react';

import {
  Box,
  Link,
  Stack,
  Avatar,
  Divider,
  ImageList,
  Typography,
  ImageListItem,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { getMediaProxyUrl } from 'src/query/use-whatsapp';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Lightbox } from 'src/components/lightbox';
import { Scrollbar } from 'src/components/scrollbar';

import { formatPhoneDisplay } from '../utils/whatsapp-formatter';

// ----------------------------------------------------------------------

const ENTITY_PATH_MAP = {
  Driver: (id) => paths.dashboard.driver.details(id),
  Transporter: (id) => paths.dashboard.transporter.details(id),
  Customer: (id) => paths.dashboard.customer.details(id),
};

// ----------------------------------------------------------------------

export function WhatsAppDetails({ conversation, messages, open }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Collect media images from messages
  const mediaImages = useMemo(
    () =>
      (messages || [])
        .filter((m) => m.messageType === 'image' && m.content?.media?.id)
        .map((m) => ({
          id: m.content.media.id,
          src: getMediaProxyUrl(m.content.media.id),
          caption: m.content.media.caption || '',
        })),
    [messages]
  );

  const lightboxSlides = useMemo(
    () => mediaImages.map((img) => ({ src: img.src })),
    [mediaImages]
  );

  if (!open || !conversation) return null;

  const {
    displayName,
    contactPhone,
    senderEntity,
    tenant,
  } = conversation;

  const contactName = displayName || senderEntity?.entityName;
  const entityType = senderEntity?.entityType;
  const entityId = senderEntity?.entityId;

  const entityColors = {
    Customer: 'info',
    Driver: 'warning',
    Transporter: 'success',
  };
  const color = entityColors[entityType] || 'default';

  // Build entity detail link
  const entityPathFn = ENTITY_PATH_MAP[entityType];
  const entityLink = entityPathFn && entityId ? entityPathFn(entityId) : null;

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <Scrollbar sx={{ flex: 1, p: 2.5 }}>
        {/* Contact Info */}
        <Stack alignItems="center" spacing={2} sx={{ pb: 3 }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: (theme) =>
                theme.palette[color === 'default' ? 'grey' : color].main,
              color: (theme) =>
                theme.palette[color === 'default' ? 'grey' : color].contrastText,
              fontSize: 28,
            }}
          >
            {contactName ? contactName.charAt(0).toUpperCase() : '?'}
          </Avatar>

          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="subtitle1">
              {contactName || formatPhoneDisplay(contactPhone)}
            </Typography>

            <Link href={`tel:${contactPhone}`} variant="body2" color="text.secondary">
              {formatPhoneDisplay(contactPhone)}
            </Link>

            {entityType && entityType !== 'Unknown' && (
              <Label color={color} sx={{ textTransform: 'capitalize' }}>
                {entityType}
              </Label>
            )}
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Entity Details */}
        <Stack spacing={1.5} sx={{ pb: 2 }}>
          {senderEntity?.entityName && (
            <DetailRow label="Name" value={senderEntity.entityName} />
          )}

          {tenant?.companyName && (
            <DetailRow label="Company" value={tenant.companyName} />
          )}

          {entityLink && (
            <Link
              href={entityLink}
              variant="body2"
              color="primary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Iconify icon="eva:external-link-fill" width={16} />
              View {entityType} Profile
            </Link>
          )}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Media Gallery */}
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Media ({mediaImages.length})
        </Typography>

        {mediaImages.length > 0 ? (
          <ImageList cols={3} gap={4} sx={{ m: 0 }}>
            {mediaImages.map((img, index) => (
              <ImageListItem
                key={img.id}
                sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.85 },
                }}
                onClick={() => handleImageClick(index)}
              >
                <Box
                  component="img"
                  src={img.src}
                  alt={img.caption || 'Media'}
                  sx={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.disabled', textAlign: 'center', py: 4 }}>
            No media shared yet
          </Typography>
        )}
      </Scrollbar>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        disableThumbnails
      />
    </>
  );
}

// ----------------------------------------------------------------------

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Stack>
  );
}
