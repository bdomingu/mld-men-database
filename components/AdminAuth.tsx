import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';


const AdminAuth = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
    const Wrapper: React.FC<P> = (props) => {
      const router = useRouter();

    useEffect(() => {
      const token = Cookies.get("token"); 
      if (!token) {
        router.push('/login');
      }
      
    const fetchAdminStatus = async () => {
        await axios.get(`/api/verifyAdmin?token=${token}`).catch( err =>{
            console.log(err.response)
            const isAdminStatus = err.response.status
            console.log(isAdminStatus)
            if (isAdminStatus === 401){
                router.push('/unauthorized')
            }

        }

        )
    }  

      fetchAdminStatus()
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default AdminAuth;

