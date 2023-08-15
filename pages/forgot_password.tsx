'use client'
import { useState } from 'react';
import axios from 'axios';
import styles from './forgot_password.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ResetPassword = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleResetRequest = async (e: React.FormEvent<HTMLFormElement>):Promise<void>  => {
        e.preventDefault();
        
        try {
            const data = {
                email:emailAddress
            }
            const response = await axios.post('api/resetEmail', data)
            const status = response.status
            if (status === 200) {
                setSuccess(true);
            }

        } catch (error: any) {
            setError(error.response.data.message)
        }

    }

    const returnToSignIn = () => {
        router.push('/login')
    }

    return (
        <>
        <div className={styles.container}>
        <div className={styles.logoContainer}>
            <Image className={styles.logo} 
            src='/images/image8.png'
            alt='logo'
            width={100}
            height={200}
            />
        </div>
        <div className={styles.textContainer}>
            <h1>Reset Password</h1>
        </div>
        </div>
       
        <div>
                {success ? (
                    <>
                    <div className={styles.formContainer}>
                        <div className={styles.successFlex}>
                        <p>Check your email for a link to reset your password. If it doesn&apos;t appear
                            within a few minutes, check your spam folder.</p>
                         <button className={styles.button} onClick={() => returnToSignIn()}>Return to sign in</button>
                         </div>
                    </div>
                    </>) : (
                    <>
                    <div className={styles.formContainer}>
                        <p>Enter your user account's email address and we will send you a password
                            reset link.</p>
                       
                        <form onSubmit={(e) => void handleResetRequest(e)}>
                        <div className={styles.flex}>
                            <input
                                className={styles.emailInput}
                                placeholder="Enter your email address"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                name="emailAddress" />
                            <button className={styles.button} type='submit'>Send password reset email</button>
                        </div>
                            <p>{error}</p>
                        </form>
                        
                    </div>
                    </>
                )}

            </div>
            </>
    )
}

export default ResetPassword;