import { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';
import NodeCache from 'node-cache';


const cache = new NodeCache({ stdTTL: 14400 }); 


export default async function fetchVideos(req:NextApiRequest, res:NextApiResponse) {
    const yearsUrl = req.query.url as string;
  try {
    const cachedYears = cache.get(yearsUrl);
    if(cachedYears){
      console.log('Cache hit - fetching data from cache...');
      res.status(200).json(cachedYears);
      return;
    }

    console.log('Cache miss - fetching data from API');
    console.log(`url:${yearsUrl}`)
    const response = await axios.get(`https://api.vimeo.com/${yearsUrl}?fields=folder.name,folder.metadata`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN}`, 
      }
    });
   
    const videos = response.data;
    console.log(videos)
    cache.set(yearsUrl, videos)
    res.status(response.status).json(videos);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' });
  }
}
