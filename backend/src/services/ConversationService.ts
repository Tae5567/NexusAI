import { v4 as uuidv4 } from 'uuid';
import Database from '../config/database';
import { Conversation, Message } from '../types';

export class ConversationService {
  static async createConversation(userId?: string): Promise<Conversation> {
    const query = `
      INSERT INTO conversations (user_id, status, metadata)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await Database.query(query, [
      userId || null,
      'active',
      JSON.stringify({}),
    ]);

    return result.rows[0];
  }

  static async getConversation(conversationId: string): Promise<Conversation | null> {
    const query = 'SELECT * FROM conversations WHERE id = $1';
    const result = await Database.query(query, [conversationId]);
    
    return result.rows[0] || null;
  }

  static async getMessages(conversationId: string): Promise<Message[]> {
    const query = `
      SELECT * FROM messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
    `;
    
    const result = await Database.query(query, [conversationId]);
    return result.rows;
  }

  static async addMessage(
    conversationId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    agentType?: string,
    metadata?: Record<string, any>
  ): Promise<Message> {
    const query = `
      INSERT INTO messages (conversation_id, role, content, agent_type, metadata)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await Database.query(query, [
      conversationId,
      role,
      content,
      agentType || null,
      JSON.stringify(metadata || {}),
    ]);

    return result.rows[0];
  }

  static async updateConversationStatus(
    conversationId: string,
    status: 'active' | 'resolved' | 'escalated'
  ): Promise<void> {
    const query = 'UPDATE conversations SET status = $1 WHERE id = $2';
    await Database.query(query, [status, conversationId]);
  }

  static async recordAnalytics(
    conversationId: string,
    responseTimeMs: number,
    agentUsed: string,
    success: boolean = true,
    metadata?: Record<string, any>
  ): Promise<void> {
    const query = `
      INSERT INTO analytics (conversation_id, response_time_ms, agent_used, success, metadata)
      VALUES ($1, $2, $3, $4, $5)
    `;
    
    await Database.query(query, [
      conversationId,
      responseTimeMs,
      agentUsed,
      success,
      JSON.stringify(metadata || {}),
    ]);
  }

  static async getAnalyticsSummary(hours: number = 24) {
    const query = `
      SELECT 
        COUNT(*) as total_conversations,
        AVG(response_time_ms) as avg_response_time,
        agent_used,
        COUNT(CASE WHEN success = true THEN 1 END) as successful,
        COUNT(CASE WHEN success = false THEN 1 END) as failed
      FROM analytics
      WHERE recorded_at > NOW() - INTERVAL '${hours} hours'
      GROUP BY agent_used
    `;
    
    const result = await Database.query(query);
    return result.rows;
  }
}