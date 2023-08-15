import styles from './admin.module.css';
import { useState, useEffect} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Layout from "@/components/Layout";
import fetchAdminStatus from "@/components/AdminStatus";
import Invalid from '@/components/Invalid';


interface ResponseData {
    token: string;
   
}

const Admin = () => {
    const [expirationTime, setExpirationTime] = useState(1);
    const [registrationLink, setRegistrationLink] = useState('');
    const [isAdminUser, setIsAdminUser] = useState(false);
    const admin = Cookies.get('user');
    
    
    useEffect(() => {
        const checkAdminStatus = async () => {
               const isAdmin = await fetchAdminStatus();
               setIsAdminUser(isAdmin);
           } 
           checkAdminStatus()
    }, [])

    function isResponseData(obj: any): obj is ResponseData {
        return 'token' in obj;
    }

    const generateLink = async () => {

        const data = {
            user: admin,
            expirationTime: expirationTime,
        }
        try{
        const response = await axios.post('/api/generateLinkToken', data)

        if (isResponseData(response.data)) {
            const responseData = response.data;
            const token = responseData.token;
            const link = `${process.env.NEXT_PUBLIC_APP_URL}/register?token=${token}`
            setRegistrationLink(link)
        } else {
            console.log('Token is missing in the response data')
        }

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
            {isAdminUser ? (
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
            ) : (
            <Invalid/>
            )}
        </Layout>
    );
}

export default Admin;