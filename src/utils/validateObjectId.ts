import { Types } from 'mongoose';

/**
 * Validate and cast the string object id to mongoose ID
 *
 * @param {string} id ObjectId of MongodDB
 * @returns {mongoose.Types.ObjectId} Returns the cast string id to mongoose ObjectId
 */
const validateCastToObjectId = (id: string): Types.ObjectId => {
  id = id.trim();
  if (!id || id.length <= 0) throw new Error(`Invalid ObjectId: ${id}`);
  return new Types.ObjectId(id);
};

export default validateCastToObjectId;
