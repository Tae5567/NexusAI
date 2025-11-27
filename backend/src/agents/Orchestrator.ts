import { RouterAgent } from './RouterAgent';
import { KnowledgeAgent } from './KnowledgeAgent';
import { ActionAgent } from './ActionAgent';
import { EscalationAgent } from './EscalationAgent';
import { AgentResponse, AgentType, Message } from '../types';

export class AgentOrchestrator {
  private routerAgent: RouterAgent;
  private knowledgeAgent: KnowledgeAgent;
  private actionAgent: ActionAgent;
  private escalationAgent: EscalationAgent;

  constructor() {
    this.routerAgent = new RouterAgent();
    this.knowledgeAgent = new KnowledgeAgent();
    this.actionAgent = new ActionAgent();
    this.escalationAgent = new EscalationAgent();
  }

  async processMessage(
    userMessage: string,
    conversationHistory: Message[]
  ): Promise<AgentResponse> {
    const startTime = Date.now();

    try {
      // Step 1: Route the message
      console.log('🔀 Routing message...');
      const routingResult = await this.routerAgent.process(userMessage, conversationHistory);
      const selectedAgentType = this.routerAgent.getSelectedAgent(routingResult.response);
      
      console.log(`✓ Routed to: ${selectedAgentType}`);

      // Step 2: Process with the selected agent
      let agentResponse: AgentResponse;

      switch (selectedAgentType) {
        case AgentType.KNOWLEDGE:
          agentResponse = await this.knowledgeAgent.process(userMessage, conversationHistory);
          break;

        case AgentType.ACTION:
          agentResponse = await this.actionAgent.process(userMessage, conversationHistory);
          break;

        case AgentType.ESCALATION:
          agentResponse = await this.escalationAgent.process(userMessage, conversationHistory);
          break;

        default:
          agentResponse = await this.knowledgeAgent.process(userMessage, conversationHistory);
      }

      const processingTime = Date.now() - startTime;
      console.log(`⏱️  Total processing time: ${processingTime}ms`);

      return {
        ...agentResponse,
        agent: selectedAgentType,
      };
    } catch (error) {
      console.error('Orchestrator error:', error);
      
      return {
        response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        agent: 'error',
        confidence: 0,
      };
    }
  }

  async handleFallback(userMessage: string): Promise<AgentResponse> {
    // Simple fallback for when all else fails
    return {
      response: `I understand you're asking about "${userMessage}". While I process that, could you provide more details or rephrase your question?`,
      agent: 'fallback',
      confidence: 0.3,
    };
  }
}