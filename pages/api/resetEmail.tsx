import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ResetPassword from "../schemas/resetPasswordSchema";
import sequelize from "./db";

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL database!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
})();

const secretKey = process.env.NEXT_PUBLIC_RESET_SECRET_KEY as string;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NEXT_PUBLIC_GMAIL_USER,
    pass: process.env.NEXT_PUBLIC_GMAIL_PASSWORD,
  },
});

const resetEmail = async (req:NextApiRequest, res:NextApiResponse) => {
 
    try {
        const { email } = req.body;

        if(!email) {
            return res.status(400).send({message: 'Email is required.'})
        }

        const token = jwt.sign({ email }, secretKey, {expiresIn:'1hr'});

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset_password?token=${token}`;
        const mailOptions = {
            from: process.env.GMAIL_USER as string,
            to: email,
            subject: '[MLD Academy] Please reset your password',
            html: `
              <p>You recently requested to reset your password for Modern Life Dating Academy.</p>
              <p>Click the link below to reset your password:</p>
              <a href="${resetUrl}">${resetUrl}</a>
              <p>If you do not use this link within 1 hour, it will expire.</p>
              <p>If you did not request a password reset, please ignore this email.</p>
            `,
        };
      
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link has been sent to your email' });

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
};

export default resetEmail;