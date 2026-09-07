import { useMemo, useState, useEffect, useCallback } from 'react';

import { Box } from '@mui/material';

import { useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import {
  useWhatsAppInfiniteMessages,
  useWhatsAppConversations,
  useMarkConversationAsRead,
} from 'src/query/use-whatsapp';

import { WhatsAppNav } from './whatsapp-nav';
import { WhatsAppHeader } from './whatsapp-header';
import { WhatsAppLayout } from './whatsapp-layout';
import { WhatsAppDetails } from './whatsapp-details';
import { WhatsAppMessageList } from './whatsapp-message-list';
import { isReplyWindowOpen } from '../utils/whatsapp-formatter';
import { WhatsAppMessageInput } from './whatsapp-message-input';
import { WhatsAppEmptyConversation } from './whatsapp-empty-conversation';

// ----------------------------------------------------------------------

export default function WhatsAppInboxView() {
  const searchParams = useSearchParams();

  const navCollapsed = useBoolean(false);
  const detailsOpen = useBoolean(false);

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  const markAsRead = useMarkConversationAsRead();

  // Fetch conversations
  const conversationsQuery = useWhatsAppConversations({
    q: searchQuery || undefined,
    entityType: entityFilter || undefined,
  });

  const conversations = useMemo(
    () => conversationsQuery.data?.data || [],
    [conversationsQuery.data]
  );

  // Find the selected conversation object
  const selectedConversation = conversations.find((c) => c._id === selectedConversationId) || null;

  // Fetch messages with infinite scrolling for selected conversation
  const infiniteMessagesQuery = useWhatsAppInfiniteMessages(selectedConversationId);
  const messages = useMemo(() => {
    if (!infiniteMessagesQuery.data?.pages) return [];
    return infiniteMessagesQuery.data.pages
      .slice()
      .reverse()
      .flatMap((page) => page?.data || []);
  }, [infiniteMessagesQuery.data]);

  // Deep-link: auto-select conversation by ?phone= query param on mount
  useEffect(() => {
    const phoneParam = searchParams.get('phone');
    if (phoneParam && conversations.length > 0 && !selectedConversationId) {
      const digits = phoneParam.replace(/\D/g, '').slice(-10);
      const match = conversations.find((c) => {
        const contactDigits = c.contactPhone?.replace(/\D/g, '').slice(-10);
        return contactDigits === digits;
      });
      if (match) {
        setSelectedConversationId(match._id);
      }
    }
  }, [searchParams, conversations, selectedConversationId]);

  // Handle conversation selection
  const handleSelectConversation = useCallback(
    (conversationId) => {
      setSelectedConversationId(conversationId);
      // Mark conversation as read
      markAsRead(conversationId).catch(() => {
        // Silently ignore — toast is handled by the mutation
      });
    },
    [markAsRead]
  );

  // Determine if reply window is open for the selected conversation
  const replyWindowOpen = selectedConversation
    ? isReplyWindowOpen(selectedConversation.lastInboundAt)
    : false;

  return (
    <Box
      sx={{
        height: 'calc(100vh - 140px)',
        display: 'flex',
        overflow: 'hidden',
        borderRadius: 2,
        border: (theme) => `solid 1px ${theme.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      <WhatsAppLayout
        navCollapsed={navCollapsed.value}
        detailsOpen={detailsOpen.value}
        nav={
          <WhatsAppNav
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelect={handleSelectConversation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            entityFilter={entityFilter}
            onEntityFilterChange={setEntityFilter}
            collapsed={navCollapsed.value}
            onToggleCollapse={navCollapsed.onToggle}
            isLoading={conversationsQuery.isLoading}
          />
        }
        header={
          selectedConversation ? (
            <WhatsAppHeader
              conversation={selectedConversation}
              onToggleDetails={detailsOpen.onToggle}
              detailsOpen={detailsOpen.value}
            />
          ) : null
        }
        messages={
          selectedConversation ? (
            <WhatsAppMessageList
              conversationId={selectedConversationId}
              messages={messages}
              isLoading={infiniteMessagesQuery.isLoading}
              isFetchingNextPage={infiniteMessagesQuery.isFetchingNextPage}
              hasNextPage={infiniteMessagesQuery.hasNextPage}
              fetchNextPage={infiniteMessagesQuery.fetchNextPage}
            />
          ) : (
            <WhatsAppEmptyConversation />
          )
        }
        input={
          selectedConversation ? (
            <WhatsAppMessageInput
              conversationId={selectedConversationId}
              lastInboundAt={selectedConversation.lastInboundAt}
              disabled={!replyWindowOpen}
            />
          ) : null
        }
        details={
          selectedConversation ? (
            <WhatsAppDetails
              conversation={selectedConversation}
              messages={messages}
              open={detailsOpen.value}
            />
          ) : null
        }
      />
    </Box>
  );
}
