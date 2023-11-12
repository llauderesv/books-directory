import mongoose from 'mongoose';

interface IUser {
  name: string;
  email: string;
  username: string;
  password: string;
  country: string;
  profile_picture: string;
  date_of_birth: string;
  gender: string;
  preferred_genres: string;
  reading_preferences: string;
}

const schema = new mongoose.Schema<IUser>(
  {
    name: String,
    email: String,
    username: String,
    password: String,
    country: String,
    profile_picture: String,
    date_of_birth: String,
    gender: String,
    preferred_genres: String,
    reading_preferences: String,
  },
  { versionKey: false, toJSON: { virtuals: true } }
);

const userModel = mongoose.model('user', schema);

export { IUser };
export default userModel;
