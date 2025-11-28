import { BaseAgent } from './BaseAgent';
import { AgentResponse, AgentType, Message } from '../types';

export class RouterAgent extends BaseAgent {
  constructor() {
    super(AgentType.ROUTER);
  }

  async process(userMessage: string, conversationHistory: Message[]): Promise<AgentResponse> {
    const systemPrompt = `You are a routing agent for a customer support system. Your job is to analyze the user's message and determine which specialized agent should handle it.

Available agents:
1. KNOWLEDGE - For questions about products, services, policies, documentation, FAQs, how-to questions
2. ACTION - For requests to perform actions like checking order status, updating account, canceling orders, making changes
3. ESCALATION - For complaints, angry customers, complex issues, requests to speak with human support

Analyze the message and respond with ONLY the agent name (KNOWLEDGE, ACTION, or ESCALATION) and a brief reason.

Format your response EXACTLY as:
AGENT: [agent_name]
REASON: [brief reason]`;

    const history = this.formatConversationHistory(conversationHistory);
    const prompt = `Conversation history:
${history}

Current user message: ${userMessage}

Which agent should handle this? Respond in the exact format specified.`;

    try {
      const response = await this.invokeLLM(prompt, systemPrompt, 500);
      
      // Parse the response
      const agentMatch = response.match(/AGENT:\s*(\w+)/i);
      const reasonMatch = response.match(/REASON:\s*(.+)/i);
      
      const selectedAgent = agentMatch ? agentMatch[1].toUpperCase() : 'KNOWLEDGE';
      const reason = reasonMatch ? reasonMatch[1].trim() : 'Default routing';

      console.log(`🔀 Router selected: ${selectedAgent} - ${reason}`);

      return {
        response: selectedAgent,
        agent: this.name,
        confidence: 0.9,
        sources: [reason],
      };
    } catch (error) {
      console.error('Router agent error:', error);
      // Default to knowledge agent on error
      return {
        response: 'KNOWLEDGE',
        agent: this.name,
        confidence: 0.5,
        sources: ['Error in routing, defaulting to knowledge agent'],
      };
    }
  }

  getSelectedAgent(routerResponse: string): AgentType {
    const normalized = routerResponse.toUpperCase();
    
    if (normalized.includes('ACTION')) {
      return AgentType.ACTION;
    } else if (normalized.includes('ESCALATION')) {
      return AgentType.ESCALATION;
    } else {
      return AgentType.KNOWLEDGE;
    }
  }
}