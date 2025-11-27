import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import dotenv from 'dotenv';

dotenv.config();

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export class BedrockClient {
  /**
   * Invoke AWS Bedrock Nova model for text generation
   * Nova Lite: amazon.nova-lite-v1:0 (Fastest, cheapest)
   * Nova Pro: amazon.nova-pro-v1:0 (More capable)
   */
  static async invokeClaude(prompt: string, systemPrompt?: string, maxTokens: number = 2000): Promise<string> {
    const messages = [
      {
        role: 'user',
        content: [
          {
            text: prompt
          }
        ]
      }
    ];

    const payload = {
      messages,
      inferenceConfig: {
        maxTokens: maxTokens,
        temperature: 0.7,
        topP: 0.9,
      },
      ...(systemPrompt && { 
        system: [
          {
            text: systemPrompt
          }
        ] 
      }),
    };

    // Default to Nova Lite (cheapest, fastest)
    const modelId = process.env.BEDROCK_MODEL_ID || 'amazon.nova-lite-v1:0';

    const command = new InvokeModelCommand({
      modelId: modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    try {
      console.log(`🤖 Invoking ${modelId}...`);
      const response = await client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      return responseBody.output.message.content[0].text;
    } catch (error: any) {
      console.error('Bedrock Nova invocation error:', error);
      if (error.name === 'AccessDeniedException') {
        throw new Error('Access denied to Bedrock Nova. Please enable model access in AWS Console.');
      }
      throw error;
    }
  }

  /**
   * Generate embeddings using Amazon Titan Embeddings
   * Model: amazon.titan-embed-text-v1
   * Dimensions: 1536
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    const payload = {
      inputText: text,
    };

    const command = new InvokeModelCommand({
      modelId: process.env.EMBEDDING_MODEL_ID || 'amazon.titan-embed-text-v1',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    try {
      const response = await client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      return responseBody.embedding;
    } catch (error: any) {
      console.error('Embedding generation error:', error);
      if (error.name === 'AccessDeniedException') {
        throw new Error('Access denied to Titan Embeddings. Please enable model access in AWS Console.');
      }
      throw error;
    }
  }

  /**
   * Test Bedrock connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing Bedrock Nova connection...');
      const response = await this.invokeClaude('Say "Hello" in one word.', undefined, 10);
      console.log('✓ Bedrock Nova test successful:', response);
      return true;
    } catch (error) {
      console.error('✗ Bedrock Nova test failed:', error);
      return false;
    }
  }
}

export default BedrockClient;