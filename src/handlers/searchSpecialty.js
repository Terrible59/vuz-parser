import * as cheerio from 'cheerio';
import axios from 'axios';
import qs from 'qs';

import { CONST } from '../constants.js';

export async function searchSpecialty(title) {
    const searchRes = await axios.post(
        CONST.URLS.SPECIALITY_SEARCH,
        qs.stringify({
            vuz: title,
            limit: 1
        }),
        {
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8,es;q=0.7,ru-RU;q=0.6',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            },
        }
    );

    let $ = cheerio.load(searchRes.data);

    const vuzId = $('div[id^="vuz"]').attr('id').replace('vuz', '');

    const vuzInfoRes = await axios.post(
        CONST.URLS.VUZ_INFO_SEARCH,
        qs.stringify({
            idvuz: vuzId,
            search: "безопасность",
            bud: 0,
            math: 1,
            obsh: 1,
            foreg: 1,
            inform: 1,
            biolog: 1,
            geog: 0,
            xim: 1,
            fiz: 1,
            lit: 1,
            hist: 1,
            dop: 1,
            what: 0,
            sort: 2,
        }),
        {
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8,es;q=0.7,ru-RU;q=0.6',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            },
        }
    );

    $ = cheerio.load(vuzInfoRes.data);
    const specialtyNumbers = [];

    $('.font2').each(function() {
        const text = $(this).text();
        const matches = text.match(/10\.\d{2}\.\d{2}/g);
        if (matches) {
            specialtyNumbers.push(...matches);
        }
    });

    return {
        hasInfoBez: specialtyNumbers.length > 0 ? "+" : "-",
        specialtyNumbers: specialtyNumbers.join(", "),
    };
}