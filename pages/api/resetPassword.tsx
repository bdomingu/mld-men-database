import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../schemas/userSchema';
import connectToDatabase from "./database";

/* look at not allowing the same password?
    look into managing errors when token is incorrect or expired
    Maybe provide another link within the same page?
    Use Yup for password strength? 
    Style new pages
*/

const secretKey = process.env.RESET_SECRET_KEY as string;

const resetPassword = async (req:NextApiRequest, res:NextApiResponse) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (!token || !password || !confirmPassword) {
            res.status(400).send({message: 'All fields are required'})
        }

        if (password !== confirmPassword) {
            return res.status(400).send({ message: 'Passwords do not match'});
        }
        
        const verifiedToken = jwt.verify(token, secretKey) as { email: string };
        const { email } = verifiedToken;

    
        const { db } = await connectToDatabase();
        const resetPasswords = db.collection('resetpasswords');
        const resetPassword = await resetPasswords.findOne({ email });
        console.log(resetPassword)

            if (!resetPassword) {
                res.status(400).send({message: 'Invalid password reset token.'});
                return;
            }

        const isTokenValid = await bcrypt.compare(token, resetPassword.token)
            
            if (!isTokenValid) {
                res.status(400).send({message: 'Invalid password reset token.'});

            }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const updatedUser = await User.findOneAndUpdate({ email }, {password: hashedPassword});

        await resetPasswords.deleteOne({ email });
        res.status(200).json({ message: 'Password has been reset successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default resetPassword;
