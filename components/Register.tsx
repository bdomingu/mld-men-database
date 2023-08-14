import Layout from "@/components/Layout";
import styles from './Register.module.css';
import axios from 'axios';
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Loading from "./Loading";

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
  


    const handleRegister = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
        setIsLoading(true);
        e.preventDefault();
        try {
        const user = {
            name: name, 
            email: email, 
            password: password,
            confirmPassword: confirmPassword
        }

        const response = await axios.post('api/register', user)
        const status = response.status
        if(status === 201) {
             router.push('/login');
        }
       

    } catch (error:any) {
        const errors = error.response.data
        console.log(errors)
        setErrors(error.response.data.errors);
    } finally {
        setIsLoading(false);
    }
}

    return (
            <div className={styles.container}>
                {isLoading ? (
                    <Loading/>
                ) : (
                    <div className={styles.signup}>
                    <div className={styles.text}>
                    <h3>Sign Up For MLD Video Hub</h3>
                    </div>
                    <div >
                        <form className={styles.form} onSubmit={(e) => void handleRegister(e)}>
                            <label>Name</label>
                                <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                />
                            <label>Email</label>
                                <input 
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                            <label>Password</label>
                                <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                            <label>Confirm Password</label>
                                <input 
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {errors.map((error: any) => {
                                    return(
                                    <p className={styles.errors}>{error.message}</p>
                                    )
                                })}
                        {/* <div className={styles.checkboxContainer}>
                        <input type="checkbox" />
                        <div className={styles.label}>
                        <label>I agree to the Terms of Use and Privacy Policy</label>
                        </div>
                        </div> */}
                         <p className={styles.passwordReference}>Password must contain at least 8 characters including an uppercase letter, a lowercase
                        letter, one number, and one special character [@$!%*?&].</p>
                        <div className={styles.button}>
                        <button type="submit">Create Account</button>
                        </div>
                       
                         </form>
                         <div className={styles.flex}>
                         <Link href='/login'>Already have an account? Login</Link>
                         </div>
                    </div>
                </div>
          
                )}
              </div>
    )
}