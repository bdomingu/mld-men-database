import Cookies from 'js-cookie';

import axios from 'axios';

const fetchAdminStatus = async () => {
    const token = Cookies.get("token"); 
    try {
        await axios.get(`/api/verifyAdmin?token=${token}`);
        return true; // Return true if the request is successful (no error)
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            return false; // Return false if the response status is 401 (Unauthorized)
        }
        console.error('Error checking admin status:', error);
        return false; // Return false for any other errors
    }
};

export default fetchAdminStatus;
