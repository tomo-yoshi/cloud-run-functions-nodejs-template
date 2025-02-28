import { Request, Response } from 'express';
import { helloWorld } from '../src/function';

describe('helloWorld function', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  it('should return Hello World! when no name is provided', () => {
    helloWorld(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Hello World!');
  });

  it('should return Hello [name]! when name is provided', () => {
    req.query = { name: 'Test' };
    helloWorld(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Hello Test!');
  });
}); 