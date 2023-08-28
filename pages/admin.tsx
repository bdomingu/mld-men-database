import styles from './admin.module.css';
import { useState, useEffect} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Layout from "@/components/Layout";
import { useRouter } from 'next/router';
import fetchAdminStatus from "@/components/AdminStatus";
import Invalid from '@/components/Invalid';
import Loading from '@/components/Loading';


const Admin = () => {
    const [expirationTime, setExpirationTime] = useState(1);
    const [registrationLink, setRegistrationLink] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const admin = Cookies.get('user');
    const router = useRouter();

    
    
    useEffect(() => {
        const checkAdminStatus = async () => {
               const isAdmin = await fetchAdminStatus();
            if(!isAdmin){
                router.replace('/unauthorized')
            } else {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
            }
           } 
           checkAdminStatus()
    }, [router])


    const generateLink = async () => {

        const data = {
            user: admin,
            expirationTime: expirationTime,
        }
        try{
        const response = await axios.post('/api/generateLinkToken', data)

    
            const responseData = response.data;
            const registerLink = responseData.link;
            setRegistrationLink(registerLink)
      

        } catch(error) {
            console.log(error)
        } finally {
            
        }
    }

    const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = parseInt(e.target.value)
        if (value >= 1) {
            setExpirationTime(value)
        }
    };
    

    return (
        <Layout footerColor="black">
            {isLoading ? (
                <Loading/>
            ) : (
                <div className={styles.container}>
                <h4>Enter a number of day(s) you would like to set for the registration link. Please copy and paste the link somewhere safe as it will disappear on refresh.</h4>
                <div className={styles.inputContainer}>
                <label>
                    Expiration Time (days):
                    <input
                    type="number"
                    min="1"
                    value={expirationTime}
                    onChange={handleExpirationChange}
                    />
                </label>
                <button onClick={generateLink}>Generate</button>
                </div>
                <div className={styles.registrationLink}>
                  <div className={styles.link}>
                  <p >{registrationLink}</p>
                  </div>
                </div>
            </div>
            )}
         
        </Layout>
    );
}

export default Admin;