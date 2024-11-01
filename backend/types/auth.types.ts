import { userTypes } from '.';
import { Request } from 'express';
import { Document, Types } from 'mongoose';
import { UserDocument } from './user.types';

interface AuthedRequest extends Request {
  userId?: string;
  user: Document<unknown, {}, UserDocument> & UserDocument & Required<{
    _id: Types.ObjectId;
  }> & {
    __v?: number;
  };
}

export { AuthedRequest };
