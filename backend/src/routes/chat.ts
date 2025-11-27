import { Router, Request, Response } from 'express';
import { AgentOrchestrator } from '../agents/Orchestrator';
import { ConversationService } from '../services/ConversationService';
import { ChatRequest, ChatResponse } from '../types';

const router = Router();
const orchestrator = new AgentOrchestrator();

// Send a message
router.post('/message', async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const { message, conversation_id, user_id }: ChatRequest = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create or get conversation
    let conversationId = conversation_id;
    if (!conversationId) {
      const conversation = await ConversationService.createConversation(user_id);
      conversationId = conversation.id;
    }

    // Get conversation history
    const history = await ConversationService.getMessages(conversationId);

    // Add user message
    await ConversationService.addMessage(conversationId, 'user', message);

    // Process with orchestrator
    const agentResponse = await orchestrator.processMessage(message, history);

    // Add assistant response
    await ConversationService.addMessage(
      conversationId,
      'assistant',
      agentResponse.response,
      agentResponse.agent,
      {
        confidence: agentResponse.confidence,
        sources: agentResponse.sources,
        action: agentResponse.action,
      }
    );

    // Record analytics
    const responseTime = Date.now() - startTime;
    await ConversationService.recordAnalytics(
      conversationId,
      responseTime,
      agentResponse.agent,
      true,
      { confidence: agentResponse.confidence }
    );

    const response: ChatResponse = {
      message: agentResponse.response,
      conversation_id: conversationId,
      agent_used: agentResponse.agent,
      response_time_ms: responseTime,
      sources: agentResponse.sources,
    };

    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get conversation history
router.get('/conversation/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const conversation = await ConversationService.getConversation(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await ConversationService.getMessages(id);

    res.json({
      conversation,
      messages,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get analytics
router.get('/analytics', async (req: Request, res: Response) => {
  try {
    const hours = parseInt(req.query.hours as string) || 24;
    const summary = await ConversationService.getAnalyticsSummary(hours);
    
    res.json({
      period_hours: hours,
      summary,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;