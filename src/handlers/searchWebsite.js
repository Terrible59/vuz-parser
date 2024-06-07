import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

import { ipLookup } from '../utils/ipLookup.js';

export async function searchWebsite(title) {
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_ENGINE_ID;
    const query = encodeURIComponent(title);

    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${searchEngineId}`;

    try {
        const response = await axios.get(url);

        const websiteIp = await ipLookup(response.data.items[0].link.split('/')[2]);

        const websiteIpInfo = await axios.get(`https://ipinfo.io/${websiteIp}`);

        return {
            websiteUrl: response.data.items[0].link,
            websiteIp: websiteIp,
            websiteHosting: websiteIpInfo.data.org,
            websiteLocation: `${websiteIpInfo.data.country}, ${websiteIpInfo.data.city}`,
        };
    } catch (error) {
        console.error('Search API error:', error);
        return '';
    }
}