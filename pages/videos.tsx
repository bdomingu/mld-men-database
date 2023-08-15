import React, { useEffect, useState  } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import styles from './videos.module.css';
import Cookies from 'js-cookie';
import Videos from '../components/Videos';
import Loading from '@/components/Loading';
import ReactLoading from 'react-loading';
import withAuth from '@/components/ProtectedRoute';

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
    const [isListItemDisabled, setIsListItemDisabled] = useState(false);


    const baseURL = 'projects/17319211/items'
    const vimeoToken = process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN as string

    useEffect(() => {
        if(Cookies.get("token")){
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {

        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get<CourseResponse>(`https://api.vimeo.com/me/${baseURL}`, {
                    headers: {
                      Authorization: `Bearer ${process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN}`, 
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
    }, [vimeoToken])

    const handlecCourseClick = (uri: string, selectedCourse: Course) => {
        fetchYears(uri, selectedCourse);
        setVideos([]);
    }

    const fetchYears = async (url: string, selectedCourse: Course) => {
        try {
            setIsFetchLoading(true);
            setSelectedCourse(selectedCourse);
            setIsListItemDisabled(true);
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
            setIsListItemDisabled(false);
        }
    }

    const fetchVideos = async (videosUrl: string, selectedYear: Year) => {
      
        try {
            setIsVideoLoading(true)
            setIsListItemDisabled(true);
            setSelectedYear(selectedYear)
            const response = await axios.get<VideoResponse>(`api/fetchVideos/?url=${videosUrl}`, {
                headers: {
                    Authorization: `Bearer ${vimeoToken}`, 
                }
            })

            const videos = response.data.data
            setVideos(videos)
        } catch(error) {
            console.error(error)
        } finally {
            setIsVideoLoading(false);
            setIsListItemDisabled(false);

        }

    }
  
    return (
        <Layout>
            {Cookies.get('token') && !isLoading ?(
                  <><div className={styles.textContainer}>
                  <h1>Courses</h1>
                  <p>Choose a course below to get started.</p>
              </div><div className={styles.videoContainer}>
                      <div className={styles.courses}>
                          {courses.map((course, index) => {
                              return (
                                  <li 
                                  key={index}
                                  onClick={() => handlecCourseClick(course.folder.metadata.connections.items.uri, course)}
                                  className={isListItemDisabled ? styles.disabled : selectedCourse === course ? styles.selectedFolder : undefined}
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
                                      className={isListItemDisabled ? styles.disabled : selectedYear === year ? styles.selectedFolder : undefined}
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
            ): (
            <Loading/>
              
            )}
     </Layout>
       
    )
 
}

export default withAuth(Video);
