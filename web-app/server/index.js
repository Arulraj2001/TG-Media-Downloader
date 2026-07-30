import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'TG Media Downloader Web Backend', time: new Date().toISOString() });
});

// Telegram Fetch Channel Route
app.post('/api/telegram/fetch-channel', async (req, res) => {
  const { channel_input, topic_id } = req.body;
  if (!channel_input) {
    return res.status(400).json({ error: 'channel_input is required' });
  }

  // Simulated MTProto channel fetch response
  res.json({
    success: true,
    channel: channel_input,
    topic_id: topic_id || null,
    total_found: 8,
    messages: [
      { id: 101, title: 'Python_Data_Science_Handbook_2026.pdf', size: 15485760, date: '2026-03-15', type: 'files', ext: 'pdf' },
      { id: 102, title: 'Fullstack_Web_Development_Masterclass.mp4', size: 452428800, date: '2026-03-20', type: 'media', ext: 'mp4' },
      { id: 103, title: 'Machine_Learning_Datasets_Bundle.zip', size: 104857600, date: '2026-02-10', type: 'zips', ext: 'zip' },
      { id: 104, title: 'Lofi_Study_Background_Audio.mp3', size: 8428800, date: '2026-01-05', type: 'music', ext: 'mp3' },
      { id: 105, title: 'UI_Design_System_Mockups_Dark.png', size: 5242880, date: '2026-03-25', type: 'media', ext: 'png' },
    ]
  });
});

// Direct Browser Stream Download Route (Content-Disposition: attachment)
app.get('/api/telegram/download-stream', (req, res) => {
  const fileName = req.query.filename || 'downloaded_file.bin';
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);

  // Stream dummy chunked data straight into local downloads
  const chunk = Buffer.alloc(1024 * 64, 'a');
  res.write(chunk);
  res.end();
});

// Buy Me a Coffee Webhook Handler
app.post('/api/webhooks/bmac', (req, res) => {
  const event = req.body;
  console.log('Received BuyMeACoffee Webhook:', event);
  // Auto-activate subscription logic
  res.json({ received: true });
});

app.listen(PORT, () => {
  console.log(`⚡ Node.js Backend Server running on port ${PORT}`);
});
