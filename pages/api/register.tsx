import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt';
import User from './schemas/userSchema';
import * as Yup from 'yup';
import sequelize from "./db";
import { ValidationError } from "yup";

(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connected to MySQL database!');
    } catch (error) {
      console.error('Error connecting to database:', error);
    }
  })();




const register = async (req:NextApiRequest, res:NextApiResponse) => {

    if (req.method !== 'POST') {
        return res.status(405).send({message:"Method not allowed"})
    }

    const { name, email, password, confirmPassword } = req.body;

    const validateExistingUser = async (email: string): Promise<boolean> => {
        const existingUser = await User.findOne({
            where: { email },
        });
        
        if (existingUser) {
            throw new ValidationError("User already exists", email, "email");
        }
        return true;
    };

    const validationSchema = Yup.object().shape({
        name:Yup.string().required('Please enter your name.'),
        email:Yup.string()
        .email('Please enter a valid email.')
        .required('Email is required.')
        .test("existingUser", "Use already exists", validateExistingUser),
        password:Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        .required('Password is required'),
        confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password')], 'Passwords must match'), 
    });

    try {
        await validationSchema.validate({ name, email, password, confirmPassword }, { abortEarly: false });
      } catch (error) {
        if (error instanceof ValidationError) {
          const errors = error.inner.map((err) => ({ field: err.path, message: err.message }));
          return res.status(400).json({ errors });
        }
        return res.status(500).json({ message: "Internal server error" });
      }

    const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
          name, 
          email, 
          password: hashedPassword});
        await user.save();

        return res.status(201).json({ message: 'User registered successfully' });
   
}

export default register;