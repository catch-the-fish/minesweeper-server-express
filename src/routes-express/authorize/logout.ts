import { Request, Response } from 'express';

function logout(req: Request, res: Response) {
  // redirect to login if logged out
  if (!req.isAuthenticated()) return res.status(200).end();

  req.logOut();
  return res.status(200).end();
}

export default logout;
