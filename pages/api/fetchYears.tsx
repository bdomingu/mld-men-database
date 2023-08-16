import { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';




export default async function fetchVideos(req:NextApiRequest, res:NextApiResponse) {
    const yearsUrl = req.query.url as string;
  try {
    const response = await axios.get(`https://api.vimeo.com/${yearsUrl}?sort=alphabetical`, {
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
