import cors from 'cors';
import { app } from "../src/server.js"

app.use(cors());
app.use(express.json());