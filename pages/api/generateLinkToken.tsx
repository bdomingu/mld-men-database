import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next";

const generateTokenLink = async (req:NextApiRequest, res:NextApiResponse) => {

    const secret = process.env.NEXT_PUBLIC_ADMIN_KEY as string

    const { user, expirationTime } = req.body;
    const expiresIn = `${expirationTime}m`
    console.log(typeof(expiresIn))
    console.log(expiresIn)
    const token = jwt.sign({user}, secret, {expiresIn})

    res.status(200).json({token});
}

export default generateTokenLink;
