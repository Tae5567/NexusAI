import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export class PineconeClient {
  private static index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'customer-support-kb');

  static async upsertVectors(vectors: Array<{
    id: string;
    values: number[];
    metadata: Record<string, any>;
  }>) {
    try {
      await this.index.upsert(vectors);
      console.log(`Upserted ${vectors.length} vectors to Pinecone`);
    } catch (error) {
      console.error('Pinecone upsert error:', error);
      throw error;
    }
  }

  static async query(embedding: number[], topK: number = 5, filter?: Record<string, any>) {
    try {
      const queryResponse = await this.index.query({
        vector: embedding,
        topK,
        includeMetadata: true,
        ...(filter && { filter }),
      });

      return queryResponse.matches || [];
    } catch (error) {
      console.error('Pinecone query error:', error);
      throw error;
    }
  }

  static async deleteAll() {
    try {
      await this.index.deleteAll();
      console.log('Deleted all vectors from Pinecone');
    } catch (error) {
      console.error('Pinecone delete error:', error);
      throw error;
    }
  }
}

export default PineconeClient;