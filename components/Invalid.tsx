import styles from './Invalid.module.css';

const Invalid = () => {
    return (
        <div className={styles.container}>
            <h1>Unauthorized Access</h1>
            <p>You do not have permission to access this page.</p>
        </div>
    )
}


export default Invalid;