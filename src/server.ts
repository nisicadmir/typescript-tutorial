import express from 'express';
import { Request, Response } from 'express';

const app = express();

// GET, POST, PUT, DELETE

app.get('/', (req: Request, res: Response) => {
  res.send('Application works!');
});

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});
