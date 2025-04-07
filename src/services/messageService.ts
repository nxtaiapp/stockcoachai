
/**
 * Message services - Main export file
 */

import { Message } from '../types/chat';

// Re-export from new service files
export { uploadImageAndGetUrl } from './imageService';
export { createUserMessage, createAIMessage } from './messageFactory';
export { getWelcomeMessageContent, getWelcomeMessage } from './welcomeMessageService';
export { saveMessageToSupabase, fetchMessagesFromSupabase } from './supabaseMessageService';
