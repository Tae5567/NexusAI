import { BaseAgent } from './BaseAgent';
import { AgentResponse, AgentType, Message } from '../types';

export class EscalationAgent extends BaseAgent {
  constructor() {
    super(AgentType.ESCALATION);
  }

  async process(userMessage: string, conversationHistory: Message[]): Promise<AgentResponse> {
    const systemPrompt = `You are an escalation agent for customer support. Your role is to handle complaints, complex issues, and requests for human support with empathy and professionalism.

Your responsibilities:
1. Acknowledge the customer's concern with empathy
2. Apologize if appropriate
3. Explain that you're creating a ticket for human review
4. Provide a ticket number and timeline
5. Offer any immediate assistance you can provide

Be warm, understanding, and professional.`;

    const history = this.formatConversationHistory(conversationHistory);
    const prompt = `Conversation history:
${history}

User message: ${userMessage}

Provide an empathetic response and create an escalation ticket:`;

    const response = await this.invokeLLM(prompt, systemPrompt, 1000);
    
    // Generate a mock ticket ID
    const ticketId = `ESC-${Date.now().toString().slice(-6)}`;
    
    const finalResponse = `${response}

📋 Escalation Details:
• Ticket ID: ${ticketId}
• Priority: High
• Expected Response: Within 2-4 hours
• Status: Assigned to support team

A senior support specialist will review your case and contact you shortly.`;

    return {
      response: finalResponse,
      agent: this.name,
      confidence: 0.95,
      action: {
        type: 'ESCALATE',
        success: true,
        data: { ticketId, priority: 'high' },
      },
    };
  }
}