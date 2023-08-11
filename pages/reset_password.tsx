import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from './reset_password.module.css'

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([])
    const [linkError, setLinkError] = useState('');
    const router = useRouter();
    const { token } = router.query
    

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {

        e.preventDefault();
        try{
            const data = {
                password: newPassword,
                confirmPassword: confirmPassword,
             }
             const response = await axios.post(`api/resetPassword/?token=${token}`, data)
             const status = response.status
             if (status === 201) {
                router.push('/login')
             }
        } catch (error: any) {
            console.log(error.response.data.message)
            console.log(error.response.data.errors)
            setLinkError(error.response.data.message)
            setErrors(error.response.data.errors);

        }

    }

    return (
        <><div className={styles.container}>
            <div className={styles.logoContainer}>
                <img className={styles.logo} src='/images/image8.png' />
            </div>
            <div className={styles.textContainer}>
                <h1>Reset Password</h1>
            </div>
        </div>
            <div className={styles.formContainer}>
                <form  className={styles.form} onSubmit={(e) => void handleResetPassword(e)}>
                <div className={styles.inputContainer}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} />
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                    
                    {errors && errors.length > 0 && (
                        <div>
                            {errors.map((error: any) => {
                                return(
                                 <p className={styles.errors}>{error.message}</p>
                                )
                            })}
                        </div>
                    )}
                   {linkError && <p className={styles.errors}>{linkError}</p> }
                    <button 
                    className={styles.button}
                    type="submit"
                    >Change Password</button>
                    </div>
                    <p>Make sure it's at least 8 characters including an uppercase letter, a lowercase
                        letter, one number, and one special character.</p>
                </form>
        </div>
        </>
    )
}

export default ResetPasswordPage;