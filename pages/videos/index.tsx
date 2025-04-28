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
        name: string
        metadata:{
            connections: {
                videos: {
                    uri: string
                }
            }
        }
    }
}

interface YearResponse{
    total: number;
    page: number;
    per_page: number;
    paging: object;
    data: []; 
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


 const Video = () => {
    const [years, setYears] = useState<Year[]>([])
    const [videos, setVideos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchLoading, setIsFetchLoading] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState<Year | null>(null)
    const [isListItemDisabled, setIsListItemDisabled] = useState(false);


    const vimeoToken = process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN as string;

    const router = useRouter();

    useEffect(() => {
        if(Cookies.get("token")){
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {

        const fetchYears = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get<YearResponse>('api/fetchCourses', {
                    headers: {
                      Authorization: `Bearer ${process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN}`, 
                    }
                  });
                
                const folders: Year[] = response.data.data;
                folders.sort((a, b) => a.folder.name.localeCompare(b.folder.name));

                setYears(folders);
            } catch(error) {
                console.error(error);
            } finally {
                setIsLoading(false)
            }
        };
        fetchYears();
    }, [vimeoToken])
  
    return (
        <Layout>
            {Cookies.get('token') && !isLoading ?(
                  <><div className={styles.textContainer}>
                  <h1>Choose a year and quarter to get started</h1>
                  <p>Below are MLD's courses since 2019</p>
              </div><div className={styles.videoContainer}> 
                      <div className={styles.years}>
                              <>
                              {years.map((year, index) => {
                                  return (
                                      <button
                                      key={index}
                                      onClick={() => { router.push({ 
                                        pathname: `/videos/${year.folder.name}`,
                                        query: {
                                            uri: year.folder.metadata.connections.videos.uri,
                                        },
                                    });
                                }}
                                className={`${styles.yearButton}`}>{year.folder.name}
                                </button>
                                  );
                              })}
                              </>
                    
                      </div>
                  </div></>
            ): (
            <Loading/>
              
            )}
     </Layout>
       
    )
 
}

export default withAuth(Video);
