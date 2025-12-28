import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 4000
  }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);