import styles from './Footer.module.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons'
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faInstagramSquare} from '@fortawesome/free-brands-svg-icons';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faYoutubeSquare} from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';



config.autoAddCss = false;

export default function Footer({ footerColor }: {footerColor?: string}) {
    return (
     <footer 
     className={ `${styles.footerContainer} ${footerColor ? styles[footerColor] : "" 
    }`}
     >
        <div className={styles.footerContent}>
            <div className={styles.logo}>
            <Link href='/'>
            <img src='/images/image8.png' />
            </Link>
            
            </div>
            <div className={styles.copyright}>
                <p>Copyright Modern Life Dating</p>
            </div>
            <div className={styles.socials}>
                <Link href='https://www.tiktok.com/@mldmotivation?_t=8d4YSfHMrzk&_r=1'>
                <span><FontAwesomeIcon icon={faTiktok} size='2x'></FontAwesomeIcon></span>
                </Link>
                <Link href='https://www.youtube.com/@ModernLifeDating'>
                <span><FontAwesomeIcon icon={faYoutubeSquare} size='2x'></FontAwesomeIcon></span>
                </Link>
                <Link href='https://www.facebook.com/ModernLifeDating'>
                <span><FontAwesomeIcon icon={faFacebookSquare} size='2x'></FontAwesomeIcon></span>
                </Link>
                <Link href='https://twitter.com/AlphaMaleMLD'>
                <span><FontAwesomeIcon icon={faTwitterSquare} size='2x'></FontAwesomeIcon></span>
                </Link>
                <Link href='https://www.instagram.com/hotdudelife/?igshid=YmMyMTA2M2Y%3D'>
                <span><FontAwesomeIcon icon={faInstagramSquare} size='2x'></FontAwesomeIcon></span>
                </Link>
            </div>
       </div>
        
     </footer>
    )
}