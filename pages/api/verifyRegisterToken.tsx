import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next";


const verifyRegisterToken = async (req:NextApiRequest, res:NextApiResponse) => {
    const secret = process.env.NEXT_PUBLIC_ADMIN_KEY as string
    console.log(secret)
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const token = req.query.token as string;
  console.log(token)
  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload

    if (decoded) {
        return res.status(200).send({message:"The link is valid."})

    }
    return res.status(400).send({message:"The link has expired or is invalid."})

  } catch (error:any) {
    console.error('Error decoding token:', error.message);
}
}

export default verifyRegisterToken;