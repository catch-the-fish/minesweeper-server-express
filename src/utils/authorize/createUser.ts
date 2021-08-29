import bcrypt from 'bcryptjs';
import UserModel from 'models/user';

async function createUser(name: string, pass: string) {
  try {
    // generate salt and hash
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);

    // create user
    const newUser = new UserModel({
      username: name,
      hash: hash
    });

    // store user
    await newUser.save();
    return true;
  } catch (err) {
    console.error(Date());
    console.error(err);
    return false;
  }
}

export default createUser;
