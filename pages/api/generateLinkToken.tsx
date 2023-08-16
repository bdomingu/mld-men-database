import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next";

const generateTokenLink = async (req:NextApiRequest, res:NextApiResponse) => {

    const secret = process.env.NEXT_PUBLIC_ADMIN_KEY as string

    const { user, expirationTime } = req.body;
    const expiresIn = `${expirationTime}d`
    
    const token = jwt.sign({user}, secret, {expiresIn})

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/register?token=${token}`

    res.status(200).json({link});

}

export default generateTokenLink;
