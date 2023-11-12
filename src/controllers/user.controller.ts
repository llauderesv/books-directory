import { Request, Response } from 'express';
import userModel from 'src/models/user.model';
import convertCamelToSnakeCaseKeys from 'src/utils/convertCamelToSnake';
import userSchema, { externalSchema } from 'src/validations/user.schema';

async function getUsers(req: Request, res: Response) {
  return res.send('Hello User');
}

/**
 * Create User Profile
 *
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @returns {Object} Returns the created User Profile
 */
async function createUser(req: Request, res: Response): Return {
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

export default { getUsers, createUser };
