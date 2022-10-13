import { UnauthorizedError } from "../errors";

const checkPermissions = (
  requestUser: { userId: string; role: string; name: string },
  resourceUserId: object
) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthorizedError("Unauthorized to access this route");
};

export default checkPermissions;
