import React, { useEffect, useState  } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import styles from './videos.module.css';
import Cookies from 'js-cookie';
import Videos from '../components/Videos';
import withAuth from "@/components/ProtectedRoute";
import Loading from '@/components/Loading';
import ReactLoading from 'react-loading';

interface Course {
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

interface CourseResponse {
    total: number;
    page: number;
    per_page: number;
    paging: object;
    data: []; 
}

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
    const [courses, setCourses] = useState<Course[]>([])
    const [years, setYears] = useState<Year[]>([])
    const [videos, setVideos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchLoading, setIsFetchLoading] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedYear, setSelectedYear] = useState<Year | null>(null)


    const baseURL = 'projects/17319211/items'
    const vimeoToken = process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN as string

    useEffect(() => {
        if(Cookies.get("token")){
            setIsLoading(false);
        }     
    }, []);

    useEffect(() => {

        const fetchCourses = async () => {
            try {
                const response = await axios.get<CourseResponse>(`https://api.vimeo.com/me/${baseURL}`, {
                    headers: {
                      Authorization: `Bearer ${vimeoToken}`, 
                    }
                  });
                
                const folders = await response.data.data;
                setCourses(folders.reverse());
            } catch(error) {
                console.error(error);
            } finally {
                setIsLoading(false)
            }
        };
        fetchCourses();
    }, [])

    const handlecCourseClick = (uri: string, selectedCourse: Course) => {
        fetchYears(uri, selectedCourse);
        setVideos([]);
    }

    const fetchYears = async (url: string, selectedCourse: Course) => {
        try {
            setIsFetchLoading(true)
            setSelectedCourse(selectedCourse)
            const response = await axios.get<YearResponse>(`https://api.vimeo.com/${url}`, {
                headers: {
                    Authorization: `Bearer ${vimeoToken}`, 
                  }
            })

            const subFolders = await response.data.data
            setYears(subFolders.reverse())
        } catch(error) {
            console.error(error);
        } finally {
            setIsFetchLoading(false)
        }
    }

    const fetchVideos = async (videosUrl: string, selectedYear: Year) => {
        try {
            setIsVideoLoading(true)
            setSelectedYear(selectedYear)
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
                        <p>Choose a course below to get started.</p>
                    </div><div className={styles.videoContainer}>
                            <div className={styles.courses}>
                                {courses.map((course) => {
                                    return (
                                        <li 
                                        onClick={() => handlecCourseClick(course.folder.metadata.connections.items.uri, course)}
                                        className={selectedCourse === course ? styles.selectedFolder : undefined}
                                        >
                                        {course.folder.name}
                                        </li>
                                    );
                                })}
                            </div>

                            <div className={styles.line}></div>
                            <div className={styles.years}>
                                {isFetchLoading ? (
                                    <ReactLoading type="bubbles" color="#146DA6" height={200} width={100}/>
                                ): (
                                    <>
                                    {years.map((year, index) => {
                                        return (
                                            <li 
                                            onClick={() => fetchVideos(year.folder.metadata.connections.videos.uri, year)}
                                            className={selectedYear === year ? styles.selectedFolder : undefined}
                                            key={index}
                                            >{year.folder.name}
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