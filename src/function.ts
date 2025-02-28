import { Request, Response } from '@google-cloud/functions-framework';

export const helloWorld = (req: Request, res: Response) => {
  const name = req.query.name || 'World';
  res.status(200).send(`Hello ${name}!!`);
}; 