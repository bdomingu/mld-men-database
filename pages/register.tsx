import Layout from "@/components/Layout";
import axios from 'axios';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Register from '../components/Register';
import Invalid from "@/components/Invalid";
import Loading from "@/components/Loading";

export default function Signup() {
    const router = useRouter();
    const { token } = router.query
    const [tokenStatus, setTokenStatus] = useState(false);
    const [verifiedToken, setVerifiedToken] = useState(false);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const verifyRegisterToken = async () => {
            try {
            if(token) {
                const response = await axios.post(`/api/verifyRegisterToken/?token=${token}`)

                const status = response.status
                if (status === 200){
                    setTokenStatus(true);
                    setVerifiedToken(true)
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setVerifiedToken(false);
            }
            } catch(error: any) {
                console.error(error.response);
                setTokenStatus(false);
                setVerifiedToken(false);
                setLoading(false);
            }
        }
        verifyRegisterToken();
    }, [router])
  

    return (
        <Layout footerColor="black">
           
        {loading && !tokenStatus ?(
            <Loading/>
        ) : verifiedToken ? (
            
            <Register/>
        ): (
            <Invalid/>
        )}
    </Layout>
    )
}