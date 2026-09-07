import { useRef, useMemo, useState, useEffect, useCallback, useLayoutEffect } from 'react';

import { Box, Stack, Button, Typography, CircularProgress } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useWhatsAppInfiniteMessages } from 'src/query/use-whatsapp';

import { Lightbox } from 'src/components/lightbox';
import { Scrollbar } from 'src/components/scrollbar';

import { WhatsAppMessageItem } from './whatsapp-message-item';

// ----------------------------------------------------------------------

export function WhatsAppMessageList({
  conversationId,
  messages: externalMessages,
  isLoading: externalIsLoading,
  isFetchingNextPage: externalIsFetchingNextPage,
  hasNextPage: externalHasNextPage,
  fetchNextPage: externalFetchNextPage,
}) {
  const scrollRef = useRef(null);
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(null);
  const prevConversationIdRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const isFetchingRef = useRef(false);

  // Fallback to local infinite query if props are not passed from parent
  const localQuery = useWhatsAppInfiniteMessages(
    externalMessages !== undefined ? null : conversationId
  );

  const isControlled = externalMessages !== undefined;
  const isLoading = isControlled ? externalIsLoading : localQuery.isLoading;
  const isFetchingNextPage = isControlled
    ? externalIsFetchingNextPage
    : localQuery.isFetchingNextPage;
  const hasNextPage = isControlled ? externalHasNextPage : localQuery.hasNextPage;
  const fetchNextPage = isControlled ? externalFetchNextPage : localQuery.fetchNextPage;

  const messages = useMemo(() => {
    if (isControlled) return externalMessages || [];
    if (!localQuery.data?.pages) return [];
    return localQuery.data.pages
      .slice()
      .reverse()
      .flatMap((page) => page?.data || []);
  }, [isControlled, externalMessages, localQuery.data]);

  isFetchingRef.current = isFetchingNextPage;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [lightboxSlides, setLightboxSlides] = useState([]);

  const handleImageClick = (blobUrl) => {
    setLightboxSlides([{ src: blobUrl }]);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  // Group messages chronologically [oldest -> newest]
  const groupedMessages = useMemo(() => {
    const groups = {};
    messages.forEach((msg) => {
      const msgDate = msg.timestamp || msg.createdAt;
      const dateKey = fDate(msgDate);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    return groups;
  }, [messages]);

  // Reset scroll state on conversation change
  useEffect(() => {
    if (prevConversationIdRef.current !== conversationId) {
      prevConversationIdRef.current = conversationId;
      isInitialLoadRef.current = true;
      prevScrollHeightRef.current = 0;
      prevScrollTopRef.current = null;
    }
  }, [conversationId]);

  // Handle scroll position retention when older messages arrive, or scroll to bottom on new messages
  useLayoutEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || messages.length === 0) return;

    if (isInitialLoadRef.current) {
      scrollElement.scrollTop = scrollElement.scrollHeight;
      isInitialLoadRef.current = false;
      prevScrollHeightRef.current = scrollElement.scrollHeight;
      return;
    }

    const prevHeight = prevScrollHeightRef.current;
    const newHeight = scrollElement.scrollHeight;

    if (newHeight > prevHeight && prevScrollTopRef.current !== null) {
      // Older messages prepended at top: keep the viewport anchored
      const heightDiff = newHeight - prevHeight;
      if (heightDiff > 0 && scrollElement.scrollTop < 120) {
        scrollElement.scrollTop += heightDiff;
      }
    } else {
      // New incoming/sent messages at bottom: if user was near bottom, auto-scroll down
      const isNearBottom = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight < 200;
      if (isNearBottom) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }

    prevScrollHeightRef.current = scrollElement.scrollHeight;
  }, [messages]);

  // Listen for scroll near top to load older messages
  const handleScroll = useCallback(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    if (scrollElement.scrollTop < 60 && hasNextPage && !isFetchingRef.current) {
      prevScrollHeightRef.current = scrollElement.scrollHeight;
      prevScrollTopRef.current = scrollElement.scrollTop;
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return undefined;

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  if (isLoading && messages.length === 0) {
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
        {/* Top loader / Load more sentinel */}
        {isFetchingNextPage && (
          <Stack alignItems="center" sx={{ py: 1 }}>
            <CircularProgress size={20} />
          </Stack>
        )}

        {hasNextPage && !isFetchingNextPage && (
          <Stack alignItems="center" sx={{ py: 1 }}>
            <Button
              size="small"
              variant="text"
              color="inherit"
              onClick={() => {
                if (scrollRef.current) {
                  prevScrollHeightRef.current = scrollRef.current.scrollHeight;
                  prevScrollTopRef.current = scrollRef.current.scrollTop;
                }
                fetchNextPage();
              }}
              sx={{ typography: 'caption', color: 'text.secondary' }}
            >
              Load earlier messages
            </Button>
          </Stack>
        )}

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
