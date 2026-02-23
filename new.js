// File: /home/dilip/provisioningExamstatus.js/generate-new.js

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { parse } = require('json2csv');

const inputFilePath = '/home/dilip/provisioningExamstatus.js/output_data5.csv';
const outputFilePath = '/home/dilip/provisioningExamstatus.js/new.csv';

// Mapping from pro_url to Exam_url
const urlMap = {
  'tcp://pro.ambicam.com:1883': 'https://pro.ambicam.com/vmukti/index-pro.html',
  'tcp://pro.ambicam.com:1884': 'https://pro.ambicam.com/vmukti/index-exam1.html',
  'tcp://pro.ambicam.com:1885': 'https://pro.ambicam.com/vmukti/index-exam2.html',
  'tcp://pro.ambicam.com:1886': 'https://pro.ambicam.com/vmukti/index-exam3.html',
  'tcp://pro.ambicam.com:1887': 'https://pro.ambicam.com/vmukti/index-exam4.html',
  'tcp://pro.ambicam.com:1888': 'https://pro.ambicam.com/vmukti/index-exam5.html',
  'tcp://pro.ambicam.com:1889': 'https://pro.ambicam.com/vmukti/index-exam6.html',
  'tcp://pro.ambicam.com:1890': 'https://pro.ambicam.com/vmukti/index-exam7.html',
  'tcp://pro.ambicam.com:1891': 'https://pro.ambicam.com/vmukti/index-exam8.html',
  'tcp://pro.ambicam.com:1892': 'https://pro.ambicam.com/vmukti/index-exam9.html',
  'tcp://pro.ambicam.com:1893': 'https://pro.ambicam.com/vmukti/index-exam10.html',
  'tcp://pro.ambicam.com:1894': 'https://pro.ambicam.com/vmukti/index-exam11.html',
  'tcp://pro.ambicam.com:1895': 'https://pro.ambicam.com/vmukti/index-exam12.html',
  'tcp://vsplpro.ambicam.com:6901': 'https://vsplpro.ambicam.com/vmukti/index-exam1.html',
  'tcp://vsplpro.ambicam.com:6902': 'https://vsplpro.ambicam.com/vmukti/index-exam2.html',
  'tcp://vsplpro.ambicam.com:6903': 'https://vsplpro.ambicam.com/vmukti/index-exam3.html',
  'tcp://vsplpro.ambicam.com:6904': 'https://vsplpro.ambicam.com/vmukti/index-exam4.html',
  'tcp://vsplpro.ambicam.com:6905': 'https://vsplpro.ambicam.com/vmukti/index-exam5.html',
  'tcp://vsplpro.ambicam.com:6906': 'https://vsplpro.ambicam.com/vmukti/index-exam6.html',
  'tcp://vsplpro.ambicam.com:6907': 'https://vsplpro.ambicam.com/vmukti/index-exam7.html',
  'tcp://vsplpro.ambicam.com:6908': 'https://vsplpro.ambicam.com/vmukti/index-exam8.html',
  'tcp://vsplpro.ambicam.com:6909': 'https://vsplpro.ambicam.com/vmukti/index-exam9.html',
  'tcp://vsplpro.ambicam.com:6910': 'https://vsplpro.ambicam.com/vmukti/index-exam10.html'
};

const results = [];

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const uuid = row['uuid'];
    const pro_url = row['pro_url'];
    const Exam_url = urlMap[pro_url] || '';

    if (uuid && pro_url && Exam_url) {
      results.push({ uuid, pro_url, Exam_url });
    }
  })
  .on('end', () => {
    const csvData = parse(results, { fields: ['uuid', 'pro_url', 'Exam_url'] });
    fs.writeFileSync(outputFilePath, csvData);
    console.log(`✅ new.csv created at: ${outputFilePath}`);
  });

