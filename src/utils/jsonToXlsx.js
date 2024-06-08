import xlsx from 'node-xlsx';
import fs from 'fs';

const headers = [
    'ИНН', 'ОГРН', 'Краткое наименование', 'Полное наименование', 'Решение', 'Регион', 
    'Ссылка на лицензию', 'Сайт', 'IP сайта', 'Хостинг сайта', 'Местоположение сайта', 'Есть кафедра ИБ', 'Специальности ИБ'
];

const rknHeaders = [
    'Регистрационный номер', 'Дата и основание внесения', 'Наименование оператора', 'ИНН',
    'Юридический адрес', 'Дата регистрации уведомления', 'Территория обработки', 'Цель обработки',
    'Правовое основание', 'Меры защиты данных', 'Ответственное лицо', 'Контактная информация',
    'Дата начала обработки', 'Срок обработки', 'Дата записи в реестр'
];

export function jsonToXlsx(data, rknData) {
    const worksheetData = data.map(item => [
        item.inn, item.ogrn, item.shortName, item.fullName, item.decision, item.region,
        item.licenseUrl, item.websiteUrl, item.websiteIp, item.websiteHosting, item.websiteLocation, item.hasInfoBez, item.specialtyNumbers
    ]);      

    worksheetData.unshift(headers);

    const rknWorksheetData = rknData.map(rknItem => [
        rknItem.registrationNumber, rknItem.entryDateAndBasis, rknItem.operatorName, rknItem.inn,
        rknItem.legalAddress, rknItem.notificationRegistrationDate, rknItem.processingTerritory,
        rknItem.processingPurpose, rknItem.legalBasisForProcessing, rknItem.dataProtectionMeasures,
        rknItem.responsiblePerson, rknItem.contactInfo, rknItem.dataProcessingStartDate,
        rknItem.processingTermination, rknItem.entryRecordDateAndBasis
    ]);

    rknWorksheetData.unshift(rknHeaders);

    const sheets = [
        { name: "Вузы", data: worksheetData },
        { name: "РКН", data: rknWorksheetData }
    ];

    const buffer = xlsx.build(sheets);
    fs.writeFileSync('data.xlsx', buffer);
}