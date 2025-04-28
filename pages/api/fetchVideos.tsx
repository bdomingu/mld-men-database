import { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';
import NodeCache from 'node-cache';

interface VideoItem {
  name: string;
  player_embed_url: string;
  pictures: {
      base_link: string;
  };
}

interface VideoResponse{
    total: number;
    page: number;
    per_page: number;
    paging: object;
    data: VideoItem[]; 
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
    
    const response = await axios.get<VideoResponse>(`https://api.vimeo.com/${videosUrl}?fields=name,player_embed_url,pictures.base_link&page=1&per_page=100`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN}`, 
      }
    });
    console.log(videosUrl)
    const videos = response.data;
    const videoNames = response.data.data.map(video => video);

    function compareNumbers(a:any,b:any){
      let regex = /webinar\s*(\d+)/i
      let c = a.name.match(regex)
      let d = b.name.match(regex)

      let numAValue = c ? parseInt(c[1]) : 0;
      let numBValue = d ? parseInt(d[1]) : 0;
      return numAValue - numBValue;
    }

    let sortedVideos = videoNames.sort(compareNumbers)
    let responseObject = {
      total: videos.total,
      page: videos.page,
      per_page: videos.per_page,
      paging: videos.paging,
      data: sortedVideos
    }
    cache.set(videosUrl, responseObject)
    res.status(response.status).json(responseObject);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' });
  }
}
