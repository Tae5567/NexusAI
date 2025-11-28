import { BaseAgent } from './BaseAgent';
import { AgentResponse, AgentType, Message } from '../types';
import { BedrockClient } from '../config/bedrock';
import { PineconeClient } from '../config/pinecone';

export class KnowledgeAgent extends BaseAgent {
  constructor() {
    super(AgentType.KNOWLEDGE);
  }

  async process(userMessage: string, conversationHistory: Message[]): Promise<AgentResponse> {
    try {
      console.log('🔍 Knowledge agent: Generating query embedding...');
      
      // Generate embedding for the user's question
      const queryEmbedding = await BedrockClient.generateEmbedding(userMessage);
      
      console.log('🔍 Knowledge agent: Searching vector database...');
      
      // Search for relevant documents in Pinecone
      // Retrieve top 5 most relevant chunks for better context
      const relevantDocs = await PineconeClient.query(queryEmbedding, 5);
      
      console.log(`🔍 Knowledge agent: Found ${relevantDocs.length} relevant documents`);
      
      // Extract context from relevant documents
      const context = relevantDocs
        .map((match: any, idx: number) => {
          const metadata = match.metadata || {};
          const score = match.score || 0;
          return `[Source ${idx + 1}: ${metadata.title || 'Unknown'} (Relevance: ${(score * 100).toFixed(1)}%)]
${metadata.text || ''}`;
        })
        .join('\n\n---\n\n');

      const sources = relevantDocs
        .map((match: any) => match.metadata?.title || 'Unknown source')
        .filter((title, idx, arr) => arr.indexOf(title) === idx); // Remove duplicates

      const systemPrompt = `You are a knowledgeable customer support agent. Use the provided context from the knowledge base to answer the user's question accurately and helpfully.

Guidelines:
- Answer based on the provided context
- If the context doesn't contain relevant information, politely say you don't have that specific information
- Be concise but complete
- Use bullet points for lists
- Be friendly and professional
- If multiple sources say different things, acknowledge both perspectives

If you cannot answer from the context, suggest what the user could do (contact support, check their account, etc.)`;

      const history = this.formatConversationHistory(conversationHistory);
      const prompt = `Context from knowledge base:
${context}

Conversation history:
${history}

User question: ${userMessage}

Provide a helpful answer based on the context above:`;

      console.log('Knowledge agent: Generating response...');
      const response = await this.invokeLLM(prompt, systemPrompt, 1500);
      const confidence = this.calculateConfidence(response);

      console.log(`Knowledge agent: Response generated (confidence: ${(confidence * 100).toFixed(1)}%)`);

      return {
        response,
        agent: this.name,
        confidence,
        sources: sources.length > 0 ? sources : undefined,
      };
    } catch (error) {
      console.error('Knowledge agent error:', error);
      return {
        response: "I apologize, but I'm having trouble accessing our knowledge base right now. Could you please try again in a moment, or contact our support team directly?",
        agent: this.name,
        confidence: 0.3,
      };
    }
  }
}