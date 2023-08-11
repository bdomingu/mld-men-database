import React, { useEffect, useState  } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import styles from './videos.module.css';
import Cookies from 'js-cookie';
import Videos from '../components/Videos';
import withAuth from "@/components/ProtectedRoute";
import Loading from '@/components/Loading';
import ReactLoading from 'react-loading';

interface Folder {
   folder: {
    name: string
    metadata: {
        connections: {
            items:{
                uri: string
            }
        }
    }
   }
}

interface FolderResponse {
    total: number;
    page: number;
    per_page: number;
    paging: object;
    data: []; 
}

interface SubFolder {
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

interface SubFolderResponse{
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
    const [folders, setFolders] = useState<Folder[]>([])
    const [subFolders, setSubFolders] = useState<SubFolder[]>([])
    const [videos, setVideos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchLoading, setIsFetchLoading] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(false);

    const baseURL = 'projects/17319211/items'
    const vimeoToken = process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN as string

    useEffect(() => {
        if(Cookies.get("token")){
            setIsLoading(false);
        }     
    }, []);

    useEffect(() => {

        const fetchFolders = async () => {
            try {
                const response = await axios.get<FolderResponse>(`https://api.vimeo.com/me/${baseURL}`, {
                    headers: {
                      Authorization: `Bearer ${vimeoToken}`, 
                    }
                  });
                
                const folders = await response.data.data;
                setFolders(folders);
            } catch(error) {
                console.error(error);
            } finally {
                setIsLoading(false)
            }
        };
        fetchFolders();
    }, [])

    const fetchSubFolders = async (url: string) => {
        try {
            setIsFetchLoading(true)
            const response = await axios.get<SubFolderResponse>(`https://api.vimeo.com/${url}`, {
                headers: {
                    Authorization: `Bearer ${vimeoToken}`, 
                  }
            })

            const subFolders = await response.data.data
            setSubFolders(subFolders)
        } catch(error) {
            console.error(error);
        } finally {
            setIsFetchLoading(false)
        }
    }

    const fetchVideos = async (videosUrl: string) => {
        try {
            setIsVideoLoading(true)
            const response = await axios.get<VideoResponse>(`https://api.vimeo.com/${videosUrl}`, {
                headers: {
                    Authorization: `Bearer ${vimeoToken}`, 
                }
            })

            const videos = response.data.data
            setVideos(videos)
        } catch(error) {
            console.error(error)
        } finally {
            setIsVideoLoading(false)
        }

    }
  
    return (
        <Layout>
            {isLoading ? (
                <Loading/>
            ): (
                <><div className={styles.textContainer}>
                        <h1>Courses</h1>
                        <p>Lorem ipsum dolor sit amet consectetur. Lorem facilisis iaculis
                            pretium sagittis eget. Sollicitudin feugiat iaculis justo lacus
                            bibendum. Non in eu est nec laoreet in dignissim.</p>
                    </div><div className={styles.videoContainer}>
                            <div className={styles.years}>
                                {folders.map((folder) => {
                                    return (
                                        <li 
                                        onClick={() => fetchSubFolders(folder.folder.metadata.connections.items.uri)}
                                        >
                                        {folder.folder.name}
                                        </li>
                                    );
                                })}
                            </div>

                            <div className={styles.line}></div>
                            <div className={styles.quarters}>
                                {isFetchLoading ? (
                                    <ReactLoading type="bubbles" color="#146DA6" height={200} width={100}/>
                                ): (
                                    <>
                                    {subFolders.map((subFolder) => {
                                        return (
                                            <li 
                                            onClick={() => fetchVideos(subFolder.folder.metadata.connections.videos.uri)}    
                                            >{subFolder.folder.name}
                                            </li>
                                        );
                                    })}
                                    </>
                                )}
                                
                            </div>
                            <Videos videos={videos} isVideoLoading={isVideoLoading}/>
                        </div></>
            )}
     </Layout>
       
    )
 
}

export default withAuth(Video);
