import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next";


const verifyAdmin = async (req:NextApiRequest, res:NextApiResponse) => {
    const secret = process.env.NEXT_PUBLIC_SECRET_KEY as string;

  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { token } = req.query as {token: string}

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload
    const isAdmin = decoded.admin

    if (isAdmin === false) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      return res.status(200).json({ message: "Authorized" });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
}
}

export default verifyAdmin;