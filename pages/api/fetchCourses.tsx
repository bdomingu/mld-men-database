import { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';




export default async function fetchCourse(req:NextApiRequest, res:NextApiResponse) {
   
  try {
    const response = await axios.get('https://api.vimeo.com/me/projects/17319211/items', {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN}`, 
      }
    });
   
    const courses = response.data
    res.status(response.status).json(courses);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' });
  }
}
