import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next";


const verifyRegisterToken = async (req:NextApiRequest, res:NextApiResponse) => {
    const secret = process.env.NEXT_PUBLIC_ADMIN_KEY as string
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const token = req.query.token as string;
  try {
    const decodedToken = jwt.verify(token, secret) as jwt.JwtPayload;
    return res.status(200).json({ message: 'Token verified successfully' });

  } catch (error:any) {
    console.error(error.message)
    return res.status(500).json({ error: error.message });

}
}

export default verifyRegisterToken;