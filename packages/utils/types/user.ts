import UserType from "./user-type";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  requiresAssistance: boolean;
  eid?: string;
  userType: UserType;
};

export default User;
