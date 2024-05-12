import { Request, Response } from 'express';
import userModel, { IUser } from 'src/models/user.model';
import convertCamelToSnakeCaseKeys from 'src/utils/convertCamelToSnake';
import userSchema, {
  externalSchema,
  updateExternalSchema,
  updateUserSchema,
} from 'src/validations/user.schema';
import { ApiResponse } from 'src/types/global';
import validateCastToObjectId from 'src/utils/validateObjectId';

/**
 * Search specific User
 *
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @returns {Object} Returns the searched User
 */
async function getUsers(req: Request, res: Response): ApiResponse {
  const id = req.params.id;
  const _id = validateCastToObjectId(id);

  const user = await userModel.findById(_id);
  if (!user) {
    return res.status(404).json({ message: 'No User found' });
  }

  return res.status(200).json({ data: user });
}

/**
 * Create User Profile
 *
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @returns {Object} Returns the created User Profile
 */
async function createUser(req: Request, res: Response): ApiResponse {
  const body = req.body;
  const resp = userSchema.validate(body);
  if (resp.error) {
    console.log(resp.error);
    return res.status(400).json({ message: resp.error.details });
  }

  const { username, email } = resp.value;
  await externalSchema.validateAsync({ username, email });

  const transformKeys = convertCamelToSnakeCaseKeys(resp.value);
  await userModel.create(transformKeys);

  return res.status(200).json({ data: resp.value });
}

async function updateUser(req: Request, res: Response): ApiResponse {
  const prop = req.body;
  const resp = updateUserSchema.validate(prop);
  if (resp.error) {
    console.log(resp.error);
    return res.status(400).json({ message: resp.error.details });
  }

  const _id = validateCastToObjectId(prop.id);
  let user: IUser | unknown = await userModel.findOne(_id);
  if (!user) {
    return res.status(404).json({ message: 'Error updating the user.' });
  }

  const { id, username, email } = resp.value;
  await updateExternalSchema.validateAsync({ id, username, email });

  // Convert
  const transformKeys = convertCamelToSnakeCaseKeys(resp.value);
  await userModel.findOneAndUpdate(_id, transformKeys);

  return res.status(200).json({ data: transformKeys });
}

export default { getUsers, createUser, updateUser };
