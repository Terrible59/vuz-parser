import * as cheerio from 'cheerio';
import axios from 'axios';
import qs from 'qs';

import { CONST } from '../constants.js';

export async function searchLicense(title) {
    const res = await axios.post(
        CONST.URLS.LICENSE_SEARCH,
        qs.stringify({
            eoName: title
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );    

    let $ = cheerio.load(res.data);

    const licenseID = $('tr[data-guid]').attr('data-guid');

    const licenseRes = await axios.get(`https://islod.obrnadzor.gov.ru/rlic/details/${licenseID}/`);

    $ = cheerio.load(licenseRes.data);

    return {
        inn: $('td:contains("ИНН")').next().text().trim(),
        ogrn: $('td:contains("ОГРН")').next().text().trim(),
        shortName: $('td:contains("Сокращенное наименование организации")').next().text().trim(),
        fullName: $('td:contains("Полное наименование организации")').next().text().trim(),
        decision: $('td:contains("Решение о предоставлении")').next().text().trim(),
        region: $('td:contains("Субъект РФ")').next().text().trim(),
        licenseUrl: `https://islod.obrnadzor.gov.ru/rlic/details/${licenseID}/`
    };
}