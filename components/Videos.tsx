import { useState } from 'react';
import styles from './Videos.module.css';
import ReactLoading from 'react-loading';


    type VideosProps = {
        videos: any[];
        isVideoLoading: boolean;
      
    };

  const Videos: React.FC<VideosProps> = ({ videos, isVideoLoading}) => {
    const [activeVideo, setActiveVideo] = useState<string | null>(null)

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
                    <div className={styles.card} key={video.resource_key} >
                    <div className={styles.thumbnail}>
                      
                        {activeVideo === video.player_embed_url ?  (
                          
                               <iframe
                               src={video.player_embed_url}
                               width="100%"
                               height="auto"
                               allow="autoplay; fullscreen"
                               allowFullScreen
                               loading= 'lazy'
                           ></iframe>
                         
                        ) : (
                            <img
                            src={video.pictures.base_link}
                            alt={video.name}
                            onMouseEnter={() => setActiveVideo(video.player_embed_url)}
                            onMouseLeave={() => setActiveVideo(null)} 
                        />
                        )}
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


