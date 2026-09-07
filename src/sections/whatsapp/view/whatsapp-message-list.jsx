import { useRef, useMemo, useState, useEffect } from 'react';

import { Box, Stack, Typography, CircularProgress } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useWhatsAppMessages } from 'src/query/use-whatsapp';

import { Lightbox } from 'src/components/lightbox';
import { Scrollbar } from 'src/components/scrollbar';

import { WhatsAppMessageItem } from './whatsapp-message-item';

// ----------------------------------------------------------------------

export function WhatsAppMessageList({ conversationId }) {
  const scrollRef = useRef(null);
  const { data: messagesResponse, isLoading } = useWhatsAppMessages(conversationId, { limit: 100 });

  const messages = useMemo(
    () => messagesResponse?.data || [],
    [messagesResponse]
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [lightboxSlides, setLightboxSlides] = useState([]);

  const handleImageClick = (blobUrl) => {
    setLightboxSlides([{ src: blobUrl }]);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  const groupedMessages = useMemo(() => {
    const groups = {};
    [...messages].reverse().forEach((msg) => {
      const dateKey = fDate(msg.createdAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    return groups;
  }, [messages]);

  if (isLoading) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Scrollbar
        sx={{
          height: '100%',
          p: 3,
        }}
        scrollableNodeProps={{ ref: scrollRef }}
      >
        {Object.keys(groupedMessages).map((date) => (
          <Box key={date}>
            <Stack alignItems="center" sx={{ my: 3 }}>
              <Typography
                variant="caption"
                sx={{
                  bgcolor: 'background.neutral',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  color: 'text.secondary',
                }}
              >
                {date}
              </Typography>
            </Stack>

            {groupedMessages[date].map((msg) => (
              <WhatsAppMessageItem
                key={msg._id}
                message={msg}
                onImageClick={handleImageClick}
              />
            ))}
          </Box>
        ))}
      </Scrollbar>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
      />
    </>
  );
}
