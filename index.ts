import { Request, Response } from 'express';

import app from './src/app';

const PORT = 3000;

app.route('/').get((req: Request, res: Response) => {
  res.status(200).send({
    message: 'Hello, World!',
  });
});

app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});
