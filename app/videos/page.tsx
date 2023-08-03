'use client'
import React, { useState  } from 'react';
import Layout from '../../components/Layout';
import styles from './videos.module.css';
import videoData from '../../assets/videoData';

import Videos from '../../components/Videos';
// import withAuth from "@/components/ProtectedRoute";


 const Video = () => {
    const [selectedYear, setSelectedYear] = React.useState<string | undefined>(); 
    const [selectedQuarter, setSelectedQuarter] = React.useState<string | undefined>();

    console.log(videoData)
    const years = ['2023', '2022', '2021', '2020', '2019']
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4']

    const handleYearClick = (year: string) => {
        setSelectedYear(year)
    }

    const handleQuarterClick = (quarter: string) => {
        setSelectedQuarter(quarter)
    }

    const video = videoData.find(
        (v) => v.year === selectedYear && v.quarter === selectedQuarter
    );

    const projectId = video ? video.projectId : undefined;
    console.log(selectedYear)
    console.log(selectedQuarter)
    console.log(video)
    console.log(projectId)
    return (
        <Layout>
            <div className={styles.textContainer}>
                <h1>My Courses</h1>
                <p>Lorem ipsum dolor sit amet consectetur. Lorem facilisis iaculis 
                 pretium sagittis eget. Sollicitudin feugiat iaculis justo lacus 
                bibendum. Non in eu est nec laoreet in dignissim.</p>
            </div>
            <div className={styles.videoContainer}>
                <div className={styles.years}>
                    {years.map((year) => {
                        return (
                        <li onClick={() => handleYearClick(year)}>{year}</li>
                        )
                    })}
                </div>
                  
                <div className={styles.line}></div>
                <div className={styles.quarters}>
                    {quarters.map((quarter) => {
                        return (
                        <li onClick={() => handleQuarterClick(quarter)}>{quarter}</li>
                        )
                    })}
                </div>
                <Videos projectId={projectId} />
            </div>
        </Layout>
       
    )
 
}

export default Video;
