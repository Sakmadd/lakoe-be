import express from 'express';
import { CONFIGS } from './config/config';
import { API_V1 } from './routes/v1/indexRoutesV1';
const app = express();
const port = CONFIGS.PORT;

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.use(express.json());

app.use('/v1', API_V1);

app.use((req, res) => {
  res.status(404).send('Not found BRUH');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
