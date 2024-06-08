import * as cheerio from 'cheerio';
import axios from 'axios';
import qs from 'qs';

import { CONST } from '../constants.js';

export async function searchOperator(inn) {
    const res = await axios.get(
        CONST.URLS.PERSONAL_INFO_SEARCH
    );    

    const cookies = res.headers['set-cookie'];
    let csrfToken = '';

    if (res.data) {
        const regex = /<meta name='csrf-token-value' content='([^']+)'/;
        const matches = res.data.match(regex);
        if (matches) {
            csrfToken = matches[1];
        }
    }

    const searchRes = await axios.post(
        CONST.URLS.PERSONAL_INFO_SEARCH,
        qs.stringify({
            csrftoken: csrfToken,
            act: 'search',
            name_full: '',
            inn: inn,
            regn: ''
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookies
            },
        }
    ); 

    let $ = cheerio.load(searchRes.data);

    const link = $('a[href*="?id="]')[0].attribs.href;

    const uniRes = await axios.get(
        `${CONST.URLS.PERSONAL_INFO_SEARCH}/${link}`
    );    

    $ = cheerio.load(uniRes.data);

    const result =  {
        regiтstrationNumber: $('td:contains("Регистрационный номер")').next().text().trim(),
        entryDateAndBasis: $('td:contains("Дата и основание внесения оператора в реестр")').next().text().trim(),
        operatorName: $('td:contains("Наименование оператора")').next().text().trim(),
        inn: $('td:contains("ИНН")').next().text().trim(),
        legalAddress: $('td:contains("Юридический адрес")').next().text().trim(),
        notificationRegistrationDate: $('td:contains("Дата регистрации уведомления")').next().text().trim(),
        processingTerritory: $('td:contains("Субъекты РФ, на территории которых происходит обработка персональных данных")').next().text().trim(),
        processingPurpose: $('td:contains("Цель обработки персональных данных")').next().text().trim(),
        legalBasisForProcessing: $('td:contains("Правовое основание обработки персональных данных")').next().text().trim(),
        dataProtectionMeasures: $('td:contains("Описание мер, предусмотренных ст. 18.1 и 19 Закона")').next().text().trim(),
        responsiblePerson: $('td:contains("ФИО физического лица или наименование юридического лица, ответственных за организацию обработки персональных данных")').next().text().trim(),
        contactInfo: $('td:contains("номера их контактных телефонов, почтовые адреса и адреса электронной почты")').next().text().trim(),
        dataProcessingStartDate: $('td:contains("Дата начала обработки персональных данных")').next().text().trim(),
        processingTermination: $('td:contains("Срок или условие прекращения обработки персональных данных")').next().text().trim(),
        entryRecordDateAndBasis: $('td:contains("Дата и основание внесения записи в реестр")').next().text().trim(),
    };

    return result;
}