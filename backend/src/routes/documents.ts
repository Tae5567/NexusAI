import { Router, Request, Response } from 'express';
import { DocumentProcessor } from '../services/DocumentProcessor';

const router = Router();

// Ingest a single document
router.post('/ingest', async (req: Request, res: Response) => {
  try {
    const { title, content, source, contentType } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const documentId = await DocumentProcessor.ingestDocument(
      title,
      content,
      source || 'manual',
      contentType || 'text'
    );

    res.json({
      success: true,
      document_id: documentId,
      message: 'Document ingested successfully',
    });
  } catch (error) {
    console.error('Ingest error:', error);
    res.status(500).json({ error: 'Failed to ingest document' });
  }
});

// Ingest multiple documents
router.post('/ingest-batch', async (req: Request, res: Response) => {
  try {
    const { documents } = req.body;

    if (!Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ error: 'Documents array is required' });
    }

    const documentIds = await DocumentProcessor.ingestMultipleDocuments(documents);

    res.json({
      success: true,
      document_ids: documentIds,
      count: documentIds.length,
      message: `${documentIds.length} documents ingested successfully`,
    });
  } catch (error) {
    console.error('Batch ingest error:', error);
    res.status(500).json({ error: 'Failed to ingest documents' });
  }
});

// Get all documents
router.get('/', async (req: Request, res: Response) => {
  try {
    const documents = await DocumentProcessor.getAllDocuments();
    res.json({ documents });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to retrieve documents' });
  }
});

export default router;