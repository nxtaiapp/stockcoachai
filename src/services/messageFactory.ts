
/**
 * Factory functions for creating message objects
 */

import { Message } from '../types/chat';

// Generate a proper UUID for database compatibility
function generateUUID(): string {
  return crypto.randomUUID();
}

export function createUserMessage(userId: string, content: string, imageUrl?: string): Message {
  return {
    id: generateUUID(),
    senderId: userId,
    content,
    timestamp: new Date(),
    isAI: false,
    imageUrl
  };
}

export function createAIMessage(content: string): Message {
  return {
    id: generateUUID(),
    senderId: 'ai',
    content,
    timestamp: new Date(),
    isAI: true
  };
}
