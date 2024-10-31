import jwtConfig from '../../config/__config__/jwt.config';
import jwt from "jsonwebtoken"
import { UserDocument } from '../../types/user.types';

export default (user: UserDocument) => {
  const token = jwt.sign({ id: user._id }, jwtConfig.accessSecret, {
    expiresIn: "1d"
  })
  return token
}
