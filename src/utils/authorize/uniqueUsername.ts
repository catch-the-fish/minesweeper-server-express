import User from 'models/user';

async function uniqueUsername(name: string) {
  try {
    const user = await User.findOne({ username: name }).exec();
    if (user) return false;
    return true;
  } catch (err) {
    console.error(Date());
    console.error(err);
    return false;
  }
}

export default uniqueUsername;
