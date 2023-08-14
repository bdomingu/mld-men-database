import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import fetchAdminStatus from './AdminStatus';


const AdminAuth = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
    const Wrapper: React.FC<P> = (props) => {
      const router = useRouter();

    useEffect(() => {
      const token = Cookies.get("token"); 
      if (!token) {
        router.push('/login');
      }
      
    const checkAdminStatus = async () => {
       const isAdmin = await fetchAdminStatus();
       if (isAdmin === false ) {
        router.push('/unauthorized');
       
       }
    }  

      checkAdminStatus()
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default AdminAuth;

