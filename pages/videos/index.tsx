import React, { useEffect, useState  } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../../components/Layout';
import styles from '.././videos.module.css';
import Cookies from 'js-cookie';
import Videos from '../../components/Videos';
import Loading from '@/components/Loading';
import ReactLoading from 'react-loading';
import withAuth from '@/components/ProtectedRoute';


interface Year {
  folder: {
    name: string;
    metadata: {
      connections: {
        items?: {
          uri: string;
          total: number;
          options: string[];
        };
        videos?: {
          uri: string;
          total: number;
          options: string[];
        };
        [key: string]: any; // optional catch-all if structure varies
      };
    };
  };
  subfolders?: Folder[];
}




interface YearResponse {
    total: number;
    page: number;
    per_page: number;
    paging: object;
    data: Year[]; // ✅ correct type
  }
  

interface VideoResponse{
    total: number;
    page: number;
    per_page: number;
    paging: object;
    data: Video[]; 
}

interface Video {
    uri: string;
    name: string;
    type: string;
    player_embed_url: string;
}

interface Folder {
    folder: {
      name: string;
      uri: string;
      [key: string]: any;
    };
  }
  
  
  interface FolderResponse {
    data: Folder[];
  }
  


 const Video = () => {
    const [quarters, setQuarters] = useState<Year[]>([])
    const [videos, setVideos] = useState<any[]>([]);
    const [years, setYears] = useState<Year[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchLoading, setIsFetchLoading] = useState(false);


    const vimeoToken = process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN as string;

    const router = useRouter();

    useEffect(() => {
        if(Cookies.get("token")){
            setIsLoading(false);
        }
    }, []);

    const fetchSubfolders = async (folderUri: string): Promise<Folder[]> => {
  try {
    const response = await axios.get<FolderResponse>(`/api/fetchSubfolders?folderUri=${encodeURIComponent(folderUri)}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN}`,
      },
    });
    return response.data.data;
  } catch (error) {
    return [];
  }
};


useEffect(() => {
    const fetchYearsAndQuarters = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<YearResponse>('api/fetchCourses', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN}`,
          },
        });
  
        const folders = response.data.data;
        const yearsWithQuarters = await Promise.all(
          folders.map(async (year) => {

            const uri = year.folder?.metadata?.connections?.items?.uri;
        
            if (uri) {
              const subfolders = await fetchSubfolders(uri);
              subfolders.sort((a, b) =>
  a.folder.name.localeCompare(b.folder.name, undefined, { numeric: true })
);
return { ...year, subfolders };

            } else {
              return { ...year, subfolders: [] };
            }
          })
        );
        yearsWithQuarters.sort((a, b) =>
  a.folder.name.localeCompare(b.folder.name, undefined, { numeric: true })
);
        setYears(yearsWithQuarters);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchYearsAndQuarters();
  }, [vimeoToken]);
  

  
    return (
        <Layout>
        {Cookies.get('token') && !isLoading ?(
              <><div className={styles.textContainer}>
              <h1>Courses</h1>
              <p>Choose a course below to get started.</p>
          </div><div className={styles.videoContainer}>
           

                  <div className={styles.years}>
  {isFetchLoading ? (
    <ReactLoading type="bubbles" color="#146DA6" height={200} width={100} />
  ) : (
    <>
      <div className={styles.yearGrid}>
  {years.map((year, index) => (
    <div className={styles.yearCard} key={index}>
      <h3 className={styles.yearTitle}>{year.folder.name}</h3>
      <div className={styles.quarterList}>
        {year.subfolders?.map((quarter, qIndex) => (
          <button
            key={qIndex}
            className={styles.quarterButton}
            onClick={() =>
              router.push({
                pathname: `/videos/${year.folder.name}/${quarter.folder.name}`,
                query: {
                  uri: quarter.folder?.metadata?.connections?.videos?.uri,
                },
              })
            }
          >
            {quarter.folder?.name}
          </button>
        ))}
      </div>
    </div>
  ))}
</div>
    </>
  )}
</div>

                 
              </div></>
        ): (
        <Loading/>
          
        )}
 </Layout>
       
    )
 
}

export default withAuth(Video);
