import { getSession } from "next-auth/react";

const sessionFile = async (req) => {
  const session = await getSession({ req });
  // console.log(session);
  if (!session.accessToken) {
    return res.status(401).json({ error: "Unauthenticated user" });
  }
};

export default sessionFile;
