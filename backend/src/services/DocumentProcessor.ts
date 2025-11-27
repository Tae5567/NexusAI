import { v4 as uuidv4 } from 'uuid';
import { BedrockClient } from '../config/bedrock';
import { PineconeClient } from '../config/pinecone';
import Database from '../config/database';

export class DocumentProcessor {
  private static readonly CHUNK_SIZE = 1000;
  private static readonly CHUNK_OVERLAP = 200;

  static async ingestDocument(
    title: string,
    content: string,
    source: string,
    contentType: string = 'text'
  ): Promise<string> {
    console.log(`📄 Processing document: ${title}`);

    // Step 1: Split document into chunks
    const chunks = this.splitIntoChunks(content);
    console.log(`✂️  Split into ${chunks.length} chunks`);

    // Step 2: Generate embeddings and prepare vectors
    const vectors = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`🔢 Generating embedding for chunk ${i + 1}/${chunks.length}`);
      
      const embedding = await BedrockClient.generateEmbedding(chunk);
      
      vectors.push({
        id: `${uuidv4()}`,
        values: embedding,
        metadata: {
          title,
          source,
          contentType,
          text: chunk,
          chunkIndex: i,
          totalChunks: chunks.length,
        },
      });
    }

    // Step 3: Upsert to Pinecone
    console.log('📤 Uploading to Pinecone...');
    await PineconeClient.upsertVectors(vectors);

    // Step 4: Record in database
    const query = `
      INSERT INTO documents (title, source, content_type, chunk_count, metadata)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    
    const result = await Database.query(query, [
      title,
      source,
      contentType,
      chunks.length,
      JSON.stringify({ originalLength: content.length }),
    ]);

    console.log(`✅ Document ingested successfully: ${result.rows[0].id}`);
    return result.rows[0].id;
  }

  private static splitIntoChunks(text: string): string[] {
    const chunks: string[] = [];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= this.CHUNK_SIZE) {
        currentChunk += sentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  static async ingestMultipleDocuments(
    documents: Array<{ title: string; content: string; source: string }>
  ): Promise<string[]> {
    const documentIds: string[] = [];

    for (const doc of documents) {
      try {
        const id = await this.ingestDocument(doc.title, doc.content, doc.source);
        documentIds.push(id);
      } catch (error) {
        console.error(`Error ingesting document ${doc.title}:`, error);
      }
    }

    return documentIds;
  }

  static async getAllDocuments() {
    const query = 'SELECT * FROM documents ORDER BY ingested_at DESC';
    const result = await Database.query(query);
    return result.rows;
  }
}