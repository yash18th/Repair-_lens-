import express from 'express';
import cookieParser from 'cookie-parser';
import diagnosisRoutes from '../../server/src/routes/diagnosisRoutes.js';

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/', diagnosisRoutes);

export default function handler(req, res) {
  return app(req, res);
}
