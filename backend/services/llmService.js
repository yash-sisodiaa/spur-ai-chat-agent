
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are a professional, friendly customer support agent for an e-commerce store "TrendyCart".
Answer clearly, concisely and helpfully in the language user is using.

Store Information:
- Shipping: Free on orders > ₹999 in India | International: ₹799+
- Delivery: 3-6 business days India | 7-15 days international
- Returns: 15 days | Unused items with original packaging
- Refund: 5-7 business days after return received
- Payment: UPI, Cards, Netbanking, COD (India only)
- Support: 10 AM - 8 PM IST, all 7 days

Rules:
- Never guess prices/policies
- If unsure → "I'll check with the team and get back to you"
- Use Hindi only when user asks in Hindi
`;

export const generateReply = async (history, userMessage) => {
  try {
    console.log("Calling Groq API...");

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",  
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "Sorry, couldn't generate a reply.";

    console.log("Groq reply received:", reply.substring(0, 100) + "...");

    return reply;

  } catch (error) {
    console.error("Groq API Error:", error.message);
    console.error("Full error:", error);

    return "Sorry, I'm having some trouble connecting right now. Please try again in a moment.";
  }
};