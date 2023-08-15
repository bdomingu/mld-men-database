import styles from "./index.module.css";
import Link from "next/link";
import Layout from '../components/Layout'
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const jwt = Cookies.get('token');
    if (jwt) {
      router.replace('/videos'); 
    }
  }, [router]);




  return (
    <div>
    <Layout >
        <div className={styles.container}>
          <div className={styles.heroImage}>
            <Image 
            src="/images/mld.png"
            alt="mld"
            width={550}
            height={574}
            />
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.content}>
              <h1>MLD Videos & Courses</h1>
              <p>
                The time to transform your dating life is NOW. If you&apos;re serious
                about becoming the man every woman desires, then you need to arm
                yourself with the best tools right away. Unlock the secrets of
                seduction, master the art of attraction, and become utterly
                irresistible. My specially curated courses offer everything you
                need to create abundance in your dating life. In this digital
                age, it&apos;s crucial to know how to present yourself attractively
                online, decode and reciprocate non-verbal cues accurately, and
                delve into the deep psychology of the women you&apos;re interested
                in. 
              </p>
              <div className={styles.button}>
                <Link href="/login" passHref>
                  <button>Get Started</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
    </Layout>
    </div>
  );
}

