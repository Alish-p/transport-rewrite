import React from 'react';

import { getTemplateSnippet } from './template-registry';

export function parseWhatsAppMarkdown(text) {
  if (!text) return null;
  const parts = text.split(/(\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <strong key={i}>{part.slice(1, -1)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export function formatMessageSnippet(message) {
  if (!message) return '';
  switch (message.messageType) {
    case 'text':
      return message.textBody || '';
    case 'template':
      return getTemplateSnippet(message.templateName, message.templateComponents);
    case 'image':
      return '📷 Image';
    case 'document':
      return '📄 Document';
    case 'location':
      return '📍 Location';
    case 'audio':
    case 'voice':
      return '🎤 Audio';
    case 'video':
      return '🎥 Video';
    case 'button':
    case 'interactive':
      return '🔘 Interactive';
    default:
      return 'New message';
  }
}

export function isReplyWindowOpen(lastInboundAt) {
  if (!lastInboundAt) return false;
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return new Date(lastInboundAt) > twentyFourHoursAgo;
}

export function formatPhoneDisplay(phone) {
  if (!phone) return '';
  const p = phone.replace(/\D/g, '');
  if (p.length === 12 && p.startsWith('91')) {
    return `+91 ${p.slice(2, 7)} ${p.slice(7)}`;
  }
  return `+${p}`;
}

export function getStatusIcon(status) {
  switch (status) {
    case 'sent':
      return { icon: 'mdi:check', color: 'text.secondary' };
    case 'delivered':
      return { icon: 'mdi:check-all', color: 'text.secondary' };
    case 'read':
      return { icon: 'mdi:check-all', color: 'info.main' };
    case 'failed':
      return { icon: 'mdi:alert-circle-outline', color: 'error.main' };
    case 'queued':
      return { icon: 'mdi:clock-outline', color: 'text.secondary' };
    default:
      return { icon: 'mdi:clock-outline', color: 'text.disabled' };
  }
}
