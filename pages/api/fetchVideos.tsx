import { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';
import NodeCache from 'node-cache';

interface VideoResponse{
    total: number;
    page: number;
    per_page: number;
    paging: object;
    data: []; 
}

const cache = new NodeCache({ stdTTL: 14400 }); 


export default async function fetchVideos(req:NextApiRequest, res:NextApiResponse) {
    const videosUrl = req.query.url as string;
  try {
    const cachedVideos = cache.get(videosUrl);
    if(cachedVideos){
      console.log('Cache hit - fetching data from cache...');
      res.status(200).json(cachedVideos);
      return;
    }

    console.log('Cache miss - fetching data from API');
    
    const response = await axios.get<VideoResponse>(`https://api.vimeo.com/${videosUrl}?sort=alphabetical&fields=name,player_embed_url,pictures.base_link&page=1&per_page=100`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN}`, 
      }
    });
   
    const videos = response.data;
    cache.set(videosUrl, videos)
    res.status(response.status).json(videos);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' });
  }
}
