import express from 'express';
import router from './routes/api.js'; 
import cors from 'cors';
import authenticateToken  from './middlewares/authenticateToken.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticateToken);
app.use('/uploads', express.static(join(__dirname, 'uploads')))
const apiUrl = "/api/v1";
app.use(apiUrl, router);

app.listen(3000);
