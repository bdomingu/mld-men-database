// /pages/api/fetchSubfolders.ts

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 14400 }); // 4 hours

export default async function fetchSubfolders(req: NextApiRequest, res: NextApiResponse) {
  try {
    const folderUri = req.query.folderUri as string;

    if (!folderUri) {
      return res.status(400).json({ error: "Missing folderUri query parameter." });
    }

    const cacheKey = `subfolders-${folderUri}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const vimeoToken = process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN;
    if (!vimeoToken) {
      return res.status(500).json({ error: "Server misconfiguration: no Vimeo token" });
    }

    const response = await axios.get(`https://api.vimeo.com${folderUri}/`, {
      headers: {
        Authorization: `Bearer ${vimeoToken}`,
      },
    });

    const data = response.data;
    cache.set(cacheKey, data);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
