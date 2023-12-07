import Joi from 'joi';
import userModel from 'src/models/user.model';

interface AsyncExternalSchema {
  username: string;
  email: string;
}

interface AsyncUpdateExternalSchema extends AsyncExternalSchema {
  id: string;
}

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  profilePicture: Joi.string(),
  dateOfBirth: Joi.string(),
  gender: Joi.string().allow('male', 'female', 'not to say'),
  country: Joi.string(),
  preferredGenres: Joi.string(),
  readingPreferences: Joi.string(),
  termsAndCondition: Joi.boolean().valid(true),
  repeatPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({ 'any.only': 'repeatPassword must match with password' }),
  accessToken: [Joi.string(), Joi.number()],
})
  .options({ abortEarly: false })
  .with('password', 'repeatPassword');

export const externalSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string(),
}).external(async (value: AsyncExternalSchema) => {
  const { username, email } = value;
  const usernameResp = await userModel.findOne({ username });
  if (usernameResp) {
    throw new Error('Username is already exists');
  }

  const emailResp = await userModel.findOne({ email });
  if (emailResp) {
    throw new Error('Email address is already exists');
  }
});

export const updateExternalSchema = Joi.object({
  id: Joi.string(),
  username: Joi.string(),
  email: Joi.string(),
}).external(async (value: AsyncUpdateExternalSchema) => {
  const { username, email, id } = value;
  const usernameResp = await userModel.findOne({ username, _id: { $ne: id } });
  if (usernameResp) {
    throw new Error('Username is already exists');
  }

  const emailResp = await userModel.findOne({ email, _id: { $ne: id } });
  if (emailResp) {
    throw new Error('Email is already exists');
  }
});

export const updateUserSchema = schema.keys({
  id: Joi.string().required(),
});

export default schema;
