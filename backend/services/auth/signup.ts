import bcryptjs from "bcryptjs"

import { Email, Password, User } from '../../models'
import Logger from '../../utils/logger';

export default async (firstName: string, lastName: string, email: string, password: string) => {
  Logger.info(`Creating new user account for: ${email}`);

  const newEmail = new Email({
    address: email
  })

  const hashedPassword = await bcryptjs.hash(password, 10)

  const newPassword = new Password({
    hash: hashedPassword
  })

  await Promise.all([newEmail.save(), newPassword.save()])

  const newUser = new User({
    firstName,
    lastName,
    emails: [newEmail._id],
    passwords: {
      history: [newPassword._id],
      current: newPassword._id
    }
  })

  newEmail.userId = newUser._id
  newPassword.userId = newUser._id

  await Promise.all([newEmail.save(), newPassword.save()])

  await newUser.save()
  Logger.info(`User account created successfully: ${email}`);
  return newUser.toObject()
}
