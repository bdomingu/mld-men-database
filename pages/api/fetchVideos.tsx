import { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';

interface VideoResponse{
    total: number;
    page: number;
    per_page: number;
    paging: object;
    data: []; 
}


export default async function fetchVideos(req:NextApiRequest, res:NextApiResponse) {
    const videosUrl = req.query.url as string;
  try {
    const response = await axios.get<VideoResponse>(`https://api.vimeo.com/${videosUrl}?sort=alphabetical`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN}`, 
      }
    });
   
    const videos = response.data
    res.status(response.status).json(videos);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' });
  }
}
