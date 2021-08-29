import { Request, Response } from 'express';

function lobbies(req: Request, res: Response) {
  if (!req.user) return res.status(403).json('User not logged in.');
  return res.status(200).json({ lobbies: req.user.lobbies });
}

function pastLobbies(req: Request, res: Response) {
  if (!req.user) return res.status(403).json('User not logged in.');
  return res.status(200).json({ lobbies: req.user.pastLobbies });
}

export { lobbies, pastLobbies };
