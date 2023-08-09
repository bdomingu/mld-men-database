import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
    const Wrapper: React.FC<P> = (props) => {
      const router = useRouter();

    useEffect(() => {
      const token = Cookies.get("token"); 
      if (!token) {
        router.push('/login');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;

