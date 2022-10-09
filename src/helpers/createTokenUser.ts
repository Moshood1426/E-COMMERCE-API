import { UserSchemaInterface } from "../models/User";

export interface TokenUserArg extends UserSchemaInterface {
  _id: object;
}

const createTokenUser = (user: TokenUserArg) => {
  return ({ name: user.name, userId: user._id, role: user.role })
};

export default createTokenUser;
