import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import Videos from '@/components/Videos';
import Loading from '@/components/Loading';
import type {Video} from '@/components/Videos';
import styles from '../.././year.module.css';




interface VideoResponse {
  data: Video[];
}

const YearVideosPage = () => {
  const router = useRouter();
  const { uri, year, quarter } = router.query;

  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const vimeoToken = process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN as string;

  useEffect(() => {
    if (!router.isReady) return;
    
    if (uri && typeof uri === 'string') {
      const fetchVideos = async () => {
        try {
          const response = await axios.get<VideoResponse>(`/api/fetchVideos/?url=${uri}`, {
            headers: {
              Authorization: `Bearer ${vimeoToken}`,
            },
          });
          setVideos(response.data.data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchVideos();
    }
  }, [uri, vimeoToken]);

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
        <div className={styles.container}>
          <h1 className={styles.title}>{year}</h1>
          <div className={styles.blueLine}></div>
          <h2 className={styles.title}>{quarter} Videos</h2>
        
          <Videos videos={videos} isVideoLoading={isLoading} />
          </div>
        </>
       
      )}
    </Layout>
  );
};

export default YearVideosPage;
