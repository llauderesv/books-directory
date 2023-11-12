// import { Request, Response, NextFunction } from 'express';
// import mongoose from 'mongoose';

// // Custom type representing ObjectId or string
// type ObjectIdOrString = mongoose.Types.ObjectId | string;

// export default function castToObjectId(req: Request, res: Response, next: NextFunction) {
//   const { id } = req.params;
//   console.log('Middleware', req.params);
//   if (id) {
//     try {
//       const objectId = new mongoose.Types.ObjectId(id) as unknown as mongoose.Types.ObjectId;
//       req.params._id = objectId.toString() as ObjectIdOrString; // Replace the original 'id' with the converted ObjectId
//     } catch (error) {
//       return res.status(400).json({ message: 'Invalid object id passed' });
//     }
//   }

//   next();
// }
