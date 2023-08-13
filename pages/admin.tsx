import AdminAuth from "@/components/AdminAuth";
import { useState } from 'react';
import axios from 'axios';

interface ResponseData {
    token: string;
   
}

const Admin = () => {
    const [expirationTime, setExpirationTime] = useState(1);
    const [token, setToken] = useState('');
    const [registrationLink, setRegistrationLink] = useState('')

    function isResponseData(obj: any): obj is ResponseData {
        return 'token' in obj;
    }

    const generateLink = async () => {
        const days = {
           expirationTime: expirationTime,
        }
        try{
        const response = await axios.post('/api/generateLinkToken', days)


        if (isResponseData(response.data)) {
            const responseData = response.data;
            const token = responseData.token;
            setToken(token)
            const link = `${process.env.NEXT_PUBLIC_APP_URL}/register?token${token}`
            setRegistrationLink(link)
          
        } else {
            console.log('Token is missing in the response data')
        }

        } catch(error) {
            console.log(error)
        }
    }

    const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = parseInt(e.target.value)
        if (value >= 0) {
            setExpirationTime(value)
        }
    };

    return (
        <div>
            <label>
                Expiration Time (days):
                <input
                type="number"
                min="0"
                value={expirationTime}
                onChange={handleExpirationChange}
                />
            </label>
            <button onClick={generateLink}>Generate Registration Link</button>
            <p>{registrationLink}</p>
        </div>
    );
}

export default AdminAuth(Admin);