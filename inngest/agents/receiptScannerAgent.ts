import { createAgent, createTool, openai, gemini } from "@inngest/agent-kit";
import { anthropic } from "inngest";
import { z } from "zod";


const geminiApiKey = process.env.Gimini_API_Key;

const parsePdfTool = createTool({
  name: "parse-pdf",
  description: "Analyzes the given PDF",
  parameters: z.object({
    pdfUrl: z.string().url(),
  }),
  handler: async ({ pdfUrl }, { step }) => {
    try {
      return await step?.ai.infer("parse-pdf", {
        model: gemini({
            apiKey: geminiApiKey,
            model: "gemini-1.5-pro", 
        }),
        body: {
          contents: [
            {
              role: "user",
              parts: [
                {
                  type: "document",
                  source: {
                    type: "url",
                    url: pdfUrl,
                  },
                },
                {
                  type: "text",
                  text: `Extract the data from the receipt and return the structured output as follows:
                  {
                    "merchant": {
                      "name": "Store Name",
                      "address": "123 Main St, City, Country",
                      "Contact": "+123456789"
                    },
                    "transaction": {
                      "date": "YYYY-MM-DD",
                      "receipt_number": "ABC123456",
                      "payment_method": "Credit Card"
                    },
                    "items": {
                      "name": "Item 1",
                      "quantity": 2,
                      "unit_price": 10.00,
                      "total_price": 20.00,
                      "currency": "USD"
                    }
                  }`,
                },
              ],
            },
          ],
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const receiptScanningAgent = createAgent({
    name: "Receipt Scanning Agent",
    description: "Processes receipt images and PDFs to extract key information such as vendor names, dates, amounts, and line items.",
    system: `you are an AI-Powered receipt scanning assistant.Your primary goal is to accurately extract and structure the relevant information from the scanned receipts. Your task includes recognizing and passing details such as:
    * Merchant Information:Store name,address,contact details
    * Transaction details: Date, time receipt number, payment method
    * Itemized Purchases:Product names,quantities, individual prices, discounts
    * Total Amounts: Subtotal, taxes, total paid, and any applied discounts
    * Ensure high accuracy by detecting OCR errors and correcting misread text when possible.
    * Normalize dates, currrency values, and formatting for consistency.
    * If any key details are missing and unclear, return a structured response indicating incomplete data.
    * Handle multiple formats, languages, and varying receipt layouts efficiently.
    * Maintain a structued JSON output for easy integration with database or expense tracing systems.
    `,
    model: gemini({
        apiKey: geminiApiKey,
        model: 'gemini-2.5-flash',
    }),
    tools: [parsePdfTool]
});