import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);