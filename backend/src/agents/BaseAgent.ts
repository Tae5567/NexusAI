import { BedrockClient } from '../config/bedrock';
import { AgentResponse, Message } from '../types';

export abstract class BaseAgent {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract process(
    userMessage: string,
    conversationHistory: Message[]
  ): Promise<AgentResponse>;

  protected async invokeLLM(
    prompt: string,
    systemPrompt: string,
    maxTokens: number = 2000
  ): Promise<string> {
    return await BedrockClient.invokeClaude(prompt, systemPrompt, maxTokens);
  }

  protected formatConversationHistory(messages: Message[]): string {
    return messages
      .slice(-5) // Last 5 messages for context
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n');
  }

  protected calculateConfidence(response: string): number {
    // Simple confidence calculation based on response characteristics
    const hasSpecificInfo = response.length > 50;
    const hasStructure = response.includes('\n') || response.includes('•');
    const notUnsure = !response.toLowerCase().includes("i'm not sure") &&
                      !response.toLowerCase().includes("i don't know");
    
    let confidence = 0.5;
    if (hasSpecificInfo) confidence += 0.2;
    if (hasStructure) confidence += 0.15;
    if (notUnsure) confidence += 0.15;
    
    return Math.min(confidence, 1.0);
  }

  getName(): string {
    return this.name;
  }
}