import Joi from 'joi';
import userModel from 'src/models/user.model';

async function isUsernameExist(username: string) {
  const resp = await userModel.findOne({ username });
  if (resp) {
    throw new Error('Username is already exists');
  }
}

async function isEmailExist(email: string) {
  const resp = await userModel.findOne({ email });
  if (resp) {
    throw new Error('Email address is already exists');
  }
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
  username: Joi.string().external(isUsernameExist),
  email: Joi.string().external(isEmailExist),
});

export default schema;
