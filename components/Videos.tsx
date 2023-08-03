import styles from './Videos.module.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation';
import ReactLoading from 'react-loading';



    type VideosProps = {
     projectId: string | undefined;
    };

    interface Video {
        
    }

    interface VideoResponse {
        total: number;
        page: number;
        per_page: number;
        paging: object;
        data: any[]; 
    }

  const Videos: React.FC<VideosProps> = ({ projectId }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    const router = useRouter();

    const vimeoToken = process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN as string

    useEffect(() => {

        const fetchVideos = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get<VideoResponse>(`https://api.vimeo.com/me/projects/${projectId}/videos?sort=alphabetical`, {
                    headers: {
                      Authorization: `Bearer ${vimeoToken}`, 
                    }
                  });
                
                const videos = await response.data.data;
                setVideos(videos);
            } catch(error) {
                console.error(error);
            } finally {
                setIsLoading(false)
            }
        };
        fetchVideos();
    }, [projectId])
console.log(isLoading)
 
    return (
        <div className={styles.container}>
        {isLoading ? (
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
                        <p>Lorem ipsum dolor sit amet consectetur. Dictum lectus.</p>
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