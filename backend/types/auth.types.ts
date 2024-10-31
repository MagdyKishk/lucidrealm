import { userTypes } from '.';
import { Request } from 'express';

interface AuthedRequest extends Request {
  userId?: string;
  user?: userTypes.UserDocument;
}

export { AuthedRequest };
