import { BaseAgent } from './BaseAgent';
import { AgentResponse, AgentType, Message, ActionResult } from '../types';

export class ActionAgent extends BaseAgent {
  constructor() {
    super(AgentType.ACTION);
  }

  async process(userMessage: string, conversationHistory: Message[]): Promise<AgentResponse> {
    try {
      const systemPrompt = `You are an action-execution agent for customer support. Analyze the user's request and determine what action needs to be taken.

Available actions:
1. CHECK_ORDER_STATUS - Check the status of an order (requires order ID or email)
2. UPDATE_ACCOUNT - Update account information (email, address, phone)
3. CANCEL_ORDER - Cancel an order (requires order ID)
4. REFUND_REQUEST - Process a refund request (requires order ID)
5. RESET_PASSWORD - Initiate password reset (requires email)
6. UPDATE_SHIPPING - Update shipping address (requires order ID)
7. TRACK_PACKAGE - Track package location (requires tracking number)

Respond with:
ACTION: [action_name]
PARAMETERS: [any parameters found in the message, or "NEED_MORE_INFO"]
EXPLANATION: [what you're going to do in one sentence]

If you cannot determine the required parameters, set PARAMETERS to "NEED_MORE_INFO" and ask the user for them.`;

      const history = this.formatConversationHistory(conversationHistory);
      const prompt = `Conversation history:
${history}

User request: ${userMessage}

What action should be taken? Respond in the exact format specified.`;

      console.log('🎬 Action agent: Analyzing request...');
      const llmResponse = await this.invokeLLM(prompt, systemPrompt, 800);
      
      // Parse the action
      const actionMatch = llmResponse.match(/ACTION:\s*(.+)/i);
      const paramsMatch = llmResponse.match(/PARAMETERS:\s*(.+)/i);
      const explanationMatch = llmResponse.match(/EXPLANATION:\s*(.+)/i);

      if (!actionMatch) {
        return {
          response: "I'd be happy to help! Could you provide more details about what you'd like me to do?",
          agent: this.name,
          confidence: 0.4,
        };
      }

      const actionType = actionMatch[1].trim();
      const parameters = paramsMatch ? paramsMatch[1].trim() : '';
      const explanation = explanationMatch ? explanationMatch[1].trim() : '';

      // Check if we need more information
      if (parameters.toUpperCase().includes('NEED_MORE_INFO')) {
        return {
          response: `${explanation}\n\nTo help you with this, I'll need some additional information. Could you please provide the necessary details?`,
          agent: this.name,
          confidence: 0.6,
        };
      }

      console.log(`🎬 Action agent: Executing ${actionType}...`);

      // Execute the action
      const actionResult = await this.executeAction(actionType, parameters, userMessage);

      let response = explanation;
      if (actionResult.success) {
        response += `\n\n✓ ${actionResult.data || 'Action completed successfully.'}`;
      } else {
        response += `\n\n✗ ${actionResult.error || 'Unable to complete the action. Please contact support.'}`;
      }

      console.log(`✅ Action agent: ${actionResult.success ? 'Success' : 'Failed'}`);

      return {
        response,
        agent: this.name,
        confidence: 0.85,
        action: actionResult,
      };
    } catch (error) {
      console.error('Action agent error:', error);
      return {
        response: "I apologize, but I'm having trouble processing that action right now. Please try again or contact our support team.",
        agent: this.name,
        confidence: 0.3,
      };
    }
  }

  private async executeAction(actionType: string, parameters: string, originalMessage: string): Promise<ActionResult> {
    //Mock implementations of action executions. In production, these would connect to databases or external services/APIs
    
    const normalizedAction = actionType.toUpperCase().replace(/\s+/g, '_');

    try {
      // Extract common parameters
      const orderIdMatch = originalMessage.match(/#?(\d{5,})/);
      const emailMatch = originalMessage.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
      const trackingMatch = originalMessage.match(/([A-Z0-9]{10,})/);

      switch (normalizedAction) {
        case 'CHECK_ORDER_STATUS':
          const orderId = orderIdMatch ? orderIdMatch[1] : '12345';
          return {
            type: 'CHECK_ORDER_STATUS',
            success: true,
            data: `Order #${orderId} Status:
• Status: In Transit
• Shipped: Nov 25, 2024
• Expected Delivery: Nov 28, 2024
• Carrier: FedEx
• Tracking: Track at fedex.com with tracking number FDX${orderId}`,
          };

        case 'UPDATE_ACCOUNT':
          return {
            type: 'UPDATE_ACCOUNT',
            success: true,
            data: 'Account information has been updated successfully. You will receive a confirmation email shortly.',
          };

        case 'CANCEL_ORDER':
          const cancelOrderId = orderIdMatch ? orderIdMatch[1] : '12345';
          return {
            type: 'CANCEL_ORDER',
            success: true,
            data: `Order #${cancelOrderId} has been cancelled successfully. 
• Cancellation confirmed
• Refund will be processed within 3-5 business days
• You'll receive an email confirmation`,
          };

        case 'REFUND_REQUEST':
          const refundOrderId = orderIdMatch ? orderIdMatch[1] : '12345';
          return {
            type: 'REFUND_REQUEST',
            success: true,
            data: `Refund request submitted successfully.
• Reference Number: RF-${Date.now().toString().slice(-6)}
• Order #${refundOrderId}
• Refund Amount: Will be calculated based on return
• Processing Time: 5-7 business days after item received`,
          };

        case 'RESET_PASSWORD':
          const email = emailMatch ? emailMatch[1] : 'your registered email';
          return {
            type: 'RESET_PASSWORD',
            success: true,
            data: `Password reset email has been sent to ${email}.
• Check your inbox (and spam folder)
• Link expires in 24 hours
• Follow the link to create a new password`,
          };

        case 'UPDATE_SHIPPING':
          const updateOrderId = orderIdMatch ? orderIdMatch[1] : '12345';
          return {
            type: 'UPDATE_SHIPPING',
            success: true,
            data: `Shipping address update processed for Order #${updateOrderId}.
• Change will be reflected in 15-30 minutes
• You'll receive a confirmation email
• If order already shipped, please contact carrier`,
          };

        case 'TRACK_PACKAGE':
          const tracking = trackingMatch ? trackingMatch[0] : 'FDX1234567890';
          return {
            type: 'TRACK_PACKAGE',
            success: true,
            data: `Package Tracking - ${tracking}:
• Current Location: Distribution Center, Chicago, IL
• Last Update: Today at 8:45 AM
• Status: Out for Delivery
• Expected Delivery: Today by 8:00 PM
• Track live: fedex.com/tracking`,
          };

        default:
          return {
            type: actionType,
            success: false,
            error: 'Action type not recognized. Please contact support for assistance with this request.',
          };
      }
    } catch (error) {
      console.error('Action execution error:', error);
      return {
        type: actionType,
        success: false,
        error: 'An error occurred while executing the action. Please try again or contact support.',
      };
    }
  }
}