import { Request, Response } from 'express';
import createUser from 'utils/authorize/createUser';
import uniqueUsername from 'utils/authorize/uniqueUsername';

async function register(req: Request, res: Response) {
  // redirect to home if logged in
  if (req.isAuthenticated())
    return res.status(401).json('You are already logged in.');

  // use template strings to prevent array injection
  const name = `${req.body.username}`;
  const pass = `${req.body.password}`;

  // username and password must not be empty
  if (!name || !pass)
    return res.status(401).json('Credentials must not be empty.');

  // username must be [2, 16] characters
  if (!(2 <= name.length && name.length <= 16))
    return res.status(401).json('Username must be 2 to 16 characters long.');

  // password must be [6, 30] characters
  if (!(6 <= pass.length && pass.length <= 30))
    return res.status(401).json('Password must be 6 to 30 characters long.');

  const isUnique = await uniqueUsername(name);
  if (!isUnique) return res.status(401).json('This username has been taken.');

  if (!createUser(name, pass))
    return res.status(401).json('Error: cannot register user.');

  return res.status(200).end();
}

export default register;
