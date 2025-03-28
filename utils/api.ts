import { getCurrentUser } from "aws-amplify/auth";


export const WhoAmIRequest = async () => {
  try {
    const { username } = await getCurrentUser();
    return { username };
  } catch (err) {
    throw new Error("No authenticated user");
  }
};
