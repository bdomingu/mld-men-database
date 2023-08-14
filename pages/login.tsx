import { useState } from 'react';
import axios from 'axios';
import styles from './login.module.css';
import Layout from '../components/Layout'
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import Link from 'next/link';
import jwt from 'jsonwebtoken';
import Loading from '@/components/Loading';

interface ResponseData {
    token: string;
    user: {
        name: string;
    } 
}

export default function Login() {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    function isResponseData(obj: any): obj is ResponseData {
        return 'token' in obj && 'user' in obj && typeof obj.user.name === 'string';
    }
    


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>):Promise<void>  => {
        e.preventDefault();
        setIsLoading(true);
        let status;
        try {
            const registeredUser = {
                email: userEmail.toLowerCase(),
                password: userPassword
            }
           
            const response = await axios.post('api/login', registeredUser)
            status = response.status;

             if (isResponseData(response.data)) {
                const responseData = response.data;
                const token = responseData.token;
                const user = responseData.user.name;

                const expirationDate = new Date(Date.now() + 60 * 60 * 1000); 
                Cookies.set('token', token, {expires: expirationDate, path: '/'});
                Cookies.set('user', user, {expires: expirationDate, path: '/'});               
            } else {
                console.log('Token is missing in the response data')
            }
        } catch (error:any) {
            setError(error.response.data.message);
        } finally {
           if (status === 200){
            router.push('/videos')
           
        }
        }

    }


    return (
        <Layout footerColor="black">
              {isLoading ? (
                <Loading/>
            ): (
            <div className={styles.container}>
            <div className={styles.login}>
                <div className={styles.text}>
                <h3>Login to MLD Video Hub</h3>
                </div>
                <div >
                    <form className={styles.form} onSubmit={(e) => void handleLogin(e)}>
                        <label>Email address</label>
                            <input 
                            type="text"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            />
                        <label>Password</label>
                            <input 
                            type="password"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            />
                            <p className={styles.error}>{error}</p>
                    <div className={styles.button}>
                    <button type='submit'>Login</button>
                    </div>
                     </form>
                     <div className={styles.flex}>
                     <Link href='/forgot_password'>Forgot Password?</Link>
                     </div>
                </div>
            </div>
            </div>

            )}
        </Layout>
    )
}