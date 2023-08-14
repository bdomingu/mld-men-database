import styles from './Videos.module.css';
import ReactLoading from 'react-loading';




    type VideosProps = {
        videos: any[],
        isVideoLoading: boolean
    };

  const Videos: React.FC<VideosProps> = ({ videos, isVideoLoading}) => {

    return (
        <div className={styles.container}>
            {isVideoLoading ? (
                <div className={styles.loading}>
                    <ReactLoading type="bubbles" color="#146DA6" height={200} width={100}/>
                </div>

            ): (
                <>
                 {videos.map((video: any) =>  {
                    return (
                    <>
                    <div className={styles.card} key="" >
                    <div className={styles.thumbnail}>
                        <iframe
                            loading="eager"
                            src={video.player_embed_url}
                            width="100%"
                            height="100%"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className={styles.content}>
                        <h3>{video.name}</h3>
                    </div>
                    </div>
                    </>
                    );
                })}    
                </>
            )}
               
        </div>
    )
}

export default Videos;


