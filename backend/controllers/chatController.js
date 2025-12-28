import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { generateReply } from '../services/llmService.js';

export const sendMessage = async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  let cleanMessage = message.trim().substring(0, 2000);

  try {
    let conversation;

    if (sessionId) {
      conversation = await Conversation.findById(sessionId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      conversation = new Conversation();
      await conversation.save();
    }

    // Save user message
    await Message.create({
      conversationId: conversation._id,
      sender: 'user',
      content: cleanMessage
    });

    // Get recent history (max 10 messages)
    const history = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .limit(10);

    const aiReply = await generateReply(history, cleanMessage);

    // Save bot reply
    await Message.create({
      conversationId: conversation._id,
      sender: 'bot',
      content: aiReply
    });

    res.json({
      reply: aiReply,
      sessionId: conversation._id.toString()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.sessionId
    }).sort({ createdAt: 1 });

    res.json(messages.map(m => ({
      sender: m.sender,
      content: m.content,
      createdAt: m.createdAt
    })));
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch conversation' });
  }
};