import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../schemas/userSchema';
import * as Yup from 'yup';
import { ValidationError } from "yup";


const secretKey = process.env.NEXT_PUBLIC_RESET_SECRET_KEY as string;

const resetPassword = async (req:NextApiRequest, res:NextApiResponse) => {

    try{
    const token = req.query.token as string;
    const {password, confirmPassword } = req.body;
    

    try{
        const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload
        const email = decoded.email

        const validationSchema = Yup.object().shape({
            password:Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
            .required('Password is required'),
            confirmPassword: Yup.string()
            .required('Confirm password is required')
            .oneOf([Yup.ref('password')], 'Passwords must match'), 
        });

        try{
            await validationSchema.validate({password, confirmPassword}, { abortEarly: false })
        } catch(error) {
            if (error instanceof ValidationError) {
                const errors = error.inner.map((err) => ({ field: err.path, message: err.message }));
                return res.status(400).json({ errors });
            }
            return res.status(500).json({ message: "Internal server error" });
        }

        const user = await User.findOne({where: {email:email}});
        const currentPassword = user?.password;

        if (!currentPassword) {
            return res.status(400).json({ message: "User not found" });
        }

        const isSamePassword = await bcrypt.compare(password, currentPassword);
        if (isSamePassword) {
            return res.status(400).json({ message: "New password cannot be the same as the previous password" });

        }

        const hashedPassword = await bcrypt.hash(password, 12);

        User.update(
            {password: hashedPassword},
            {where: {email:email}}
        ).then(() => {
            return res.status(201).json({ message: 'User registered successfully' });
        });

    } catch(err) {
        return res.status(400).send({message:"The link has expired or is invalid."})
    }  
 
    } catch (error) {
        if (error instanceof ValidationError) {
            const errors = error.inner.map((err) => ({ field: err.path, message: err.message }));
            return res.status(400).json({ errors });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default resetPassword;
