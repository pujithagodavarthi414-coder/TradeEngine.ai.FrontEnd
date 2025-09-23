export class User {
  fullName: string;
  id: string;
  roleId: string;
  profileImage: string;
}

export function createStubUser() {
  const user = new User();
  user.fullName = "Srihari Kothapalli";

  return user;
}
