import xlsx from 'node-xlsx';
import fs from 'fs';

const headers = [
    'ИНН', 'ОГРН', 'Краткое наименование', 'Полное наименование', 'Решение', 'Регион', 
    'Ссылка на лицензию', 'Сайт', 'IP сайта', 'Хостинг сайта', 'Местоположение сайта', 'Есть кафедра ИБ', 'Специальности ИБ'
];

export function jsonToXlsx(data) {
    const worksheetData = data.map(item => [
        item.inn, item.ogrn, item.shortName, item.fullName, item.decision, item.region,
        item.licenseUrl, item.websiteUrl, item.websiteIp, item.websiteHosting, item.websiteLocation, item.hasInfoBez, item.specialtyNumbers
    ]);      

    worksheetData.unshift(headers);

    const worksheet = xlsx.build([{name: "Данные", data: worksheetData}]);

    fs.writeFileSync('data.xlsx', worksheet);
}