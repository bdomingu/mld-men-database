'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Nav.module.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Cookies from 'js-cookie';


config.autoAddCss = false;


export default function Nav() {
    const [showMenu, setShowMenu] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
   

    useEffect(() => {
        if(Cookies.get("token")){
        setLoggedIn(true);
        } 
      }, [])

    const handleClick = () => {
        setShowMenu(!showMenu);
    }

    const handleLogout = async () => {
        const response = await axios.get('api/logout')
        const status = response.status;
        if(status === 200) {
            Cookies.remove('token', { path: '/' })
            router.push('/')
        }

    }

    return (
        <nav className={styles.navContainer}>
            <div className={styles.navContent}>
                <div className={styles.logo}>
                <Link href='/'><img src='/images/image8.png' /></Link>
                </div>
                <div className={styles.text}>
                <h2>Modern Life Dating</h2>
                <h3>Video Archive</h3>
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
                    <button onClick={handleLogout}>Logout</button>
                    <Link href='/courseHome' className={styles.myCourses}><span >My Courses</span></Link>
                    {/* <Link href='/home'><li>Video Archive</li></Link> */}

                </div>
                </div>
                </> 
                ) : (
                    <>
                    <div className={showMenu ? styles.menuListActive : styles.menuList}>
                    <div className={styles.menu}>
                        <Link href='/login' className={styles.myCourses}><span>Login</span></Link>
                        {/* <Link href='/signup'><li>Signup</li></Link> */}
                    </div>
                    </div>
                    </>
                )
                }
           
            </div>
            
        </nav>
    )
}