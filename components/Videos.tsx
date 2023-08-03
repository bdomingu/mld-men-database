import styles from './Videos.module.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation';

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
        data: any[]; // or define a more specific type for the items in the array if possible
    }

  const Videos: React.FC<VideosProps> = ({ projectId }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const router = useRouter();
    console.log(projectId)
    const vimeoToken = process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN as string

    useEffect(() => {

        const fetchVideos = async () => {
            try {
    
                const response = await axios.get<VideoResponse>(`https://api.vimeo.com/me/projects/${projectId}/videos?sort=alphabetical`, {
                    headers: {
                      Authorization: `Bearer ${vimeoToken}`, 
                    }
                  });
                
                const videos = await response.data.data;
                setVideos(videos);
            } catch(error) {
                console.error(error);
            }
        }
        fetchVideos();
    }, [projectId])

    const handleThumbnailClick = (embedUrl: string) => {
        router.push(`/video?embedUrl=${encodeURIComponent(embedUrl)}`)
    }
    
    console.log(videos)
 
    return (
        <div className={styles.container}>
                {videos.map((video: any) =>  {
                    return (
                    <>
                    <div className={styles.card} >
                    <div className={styles.thumbnail}>
                        <img 
                        key={video.resource_key}
                        src={video.pictures.base_link}
                        onClick={() => handleThumbnailClick(video.player_embed_url)}
                        />
                    </div>
                    <div className={styles.content}>
                        <h3>Title</h3>
                        <p>Lorem ipsum dolor sit amet consectetur. Dictum lectus.</p>
                    </div>
                    </div>
                    </>
                    )
                })}    
        </div>
    )
}

export default Videos;