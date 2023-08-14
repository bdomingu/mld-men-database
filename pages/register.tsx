import Layout from "@/components/Layout";
import styles from './register.module.css';
import axios from 'axios';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Register from '../components/Register';
import Invalid from "@/components/Invalid";

export default function Signup() {
    const router = useRouter();
    const { token } = router.query
    const [tokenStatus, setTokenStatus] = useState(false)

    useEffect(() => {
        const verifyRegisterToken = async () => {
            try {
                const response = await axios.post(`/api/verifyRegisterToken/?token=${token}`)

                const status = response.status
                if (status === 200){
                    setTokenStatus(true)
                }
            } catch(error: any) {
                console.log(error.response.status)
            }
        }
        verifyRegisterToken();
    }, [token])
  

    return (
        <Layout footerColor="black">
           
       
        {tokenStatus ? (
            <Register/>
        ) : (
            <div>
                <Invalid/>
            </div>
        )}
    </Layout>
    )
}