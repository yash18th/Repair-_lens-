import express from 'express';
import cookieParser from 'cookie-parser';
import subscriptionRoutes from '../server/src/routes/subscriptionRoutes.js';

const app = express();

app.use(cookieParser());
app.use(express.json({
  limit: '10mb',
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));

app.use('/api/subscription', subscriptionRoutes);
app.use('/', subscriptionRoutes);

export default function handler(req, res) {
  return app(req, res);
}
