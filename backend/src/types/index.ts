export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agent_type?: string;
  created_at: Date;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  user_id?: string;
  status: 'active' | 'resolved' | 'escalated';
  created_at: Date;
  updated_at: Date;
  metadata?: Record<string, any>;
}

export interface Document {
  id: string;
  title: string;
  source: string;
  content_type: string;
  chunk_count: number;
  ingested_at: Date;
  metadata?: Record<string, any>;
}

export interface AgentResponse {
  response: string;
  agent: string;
  confidence: number;
  sources?: string[];
  action?: ActionResult;
}

export interface ActionResult {
  type: string;
  success: boolean;
  data?: any;
  error?: string;
}

export enum AgentType {
  ROUTER = 'router',
  KNOWLEDGE = 'knowledge',
  ACTION = 'action',
  ESCALATION = 'escalation'
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  user_id?: string;
}

export interface ChatResponse {
  message: string;
  conversation_id: string;
  agent_used: string;
  response_time_ms: number;
  sources?: string[];
}