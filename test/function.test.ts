import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { helloWorld } from '../src/function';

describe('helloWorld function', () => {
  let req: Partial<ExpressRequest>;
  let res: Partial<ExpressResponse>;

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
    helloWorld(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Hello World!');
  });

  it('should return Hello [name]! when name is provided', () => {
    req.query = { name: 'Test' };
    helloWorld(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Hello Test!');
  });
}); 