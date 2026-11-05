import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env from project root or server dir
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

import { TelephonyManager } from './telephony/manager.js';
import { createTelephonyRouter } from './routes/telephony.js';
import { createLeadsRouter } from './routes/leads.js';
import { createDashboardRouter } from './routes/dashboard.js';
import { createCalendarRouter } from './routes/calendar.js';
import { createPulseRouter } from './routes/pulse.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Telephony Core
const telephonyManager = new TelephonyManager();

// Register API Routes
app.use('/api/telephony', createTelephonyRouter(telephonyManager));
app.use('/api/leads', createLeadsRouter());
app.use('/api/dashboard', createDashboardRouter());
app.use('/api/calendar', createCalendarRouter());
app.use('/api/pulse', createPulseRouter());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    telephony: telephonyManager.getProviderStatus(),
  });
});

// Serve static frontend build if available
const possiblePaths = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), '../client/dist'),
];
const clientDistPath = possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0];
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('On-Ground.ai Call Centre Server is running. Start frontend with npm run dev:client');
    }
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 On-Ground.ai Call Centre Server running on port ${PORT}`);
  console.log(`📞 Telephony Status: ${telephonyManager.getProviderStatus().message}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});
