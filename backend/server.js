import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/chat', chatRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke on server!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});