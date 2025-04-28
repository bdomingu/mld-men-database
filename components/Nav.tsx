'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Nav.module.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import isAdmin from "@/components/AdminAuth";
import fetchAdminStatus from './AdminStatus';
import Image from 'next/image';
import { type } from 'os';


config.autoAddCss = false;


const Nav = () => {

    const [showMenu, setShowMenu] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdminUser, setIsAdminUser] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();


    useEffect(() => {
        const checkAdminStatus = async () => {
           if(Cookies.get("token")){
               setLoggedIn(true);
               const isAdmin = await fetchAdminStatus();
               setIsAdminUser(isAdmin);
           } 
        }
           checkAdminStatus()
       }, [])

    const handleClick = () => {
        setShowMenu(!showMenu);
    }

    const handleLogout = async () => {
        setLoading(true)
        const response = await axios.get('/api/logout')
        const status = response.status;
        if(status === 200) {
            Cookies.remove('token', { path: '/' })
            Cookies.remove('user', { path: '/' })
            router.push('/')
        }
        setLoading(false)
    }

  

    return (
        <nav className={styles.navContainer}>
            <div className={styles.navContent}>
                <div className={styles.logo}>
                <Link href='/'>
                <Image 
                src='/images/image8.png'
                alt='logo'
                width={150}
                height={200} 
                /></Link>
                </div>
                <div className={styles.text}>
                <h2>Modern Life Dating</h2>
                <h3>MEN Database</h3>
                </div>
               
                <button className={styles.menuButton} onClick={handleClick}>
                    <span className={styles.hamburgerIcon}>
                        <FontAwesomeIcon icon={faBars} size='2x'></FontAwesomeIcon>
                    </span> 
                </button>
               
                {loggedIn ? (
                    <>
                <div className={showMenu ? styles.menuListActive : styles.menuList}>
                <div className={styles.menu}>
                {isAdminUser && <Link href='/admin' className={styles.myCourses}><span>Admin</span></Link>} {/* Render the extra option if the user is an admin */}

                    <button onClick={handleLogout} disabled={loading}>Logout</button>
                </div>
                </div>
                </> 
                ) : (
                    <>
                    <div className={showMenu ? styles.menuListActive : styles.menuList}>
                    <div className={styles.menu}>
                        <Link href='/login' className={styles.myCourses}><span>Login</span></Link>
                    </div>
                    </div>
                    </>
                )
                }
           
            </div>
            
        </nav>
    )
}

export default Nav;