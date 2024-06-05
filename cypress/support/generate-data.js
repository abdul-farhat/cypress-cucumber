import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

Cypress.Commands.add('saveRecordsToData', (filename, startDate, nonReported) => {
  const baseURL = Cypress.env('REMITTANCE_DATA_URL');

  dayjs.extend(utc);

  const getTime = (timeString, startDate) => {
    const now = startDate || dayjs().format();
    let timeArray;
    if (!timeString.includes('NOW') && !timeString.includes('STARTOF')) {
      return dayjs(timeString);
    }
    if (timeString.includes('SUBTRACT') && timeString.includes('WORKING_DAY')) {
      timeArray = timeString.split('_');
      return dayjs(startDate).subtract(timeArray[2], 'day');
    }
    if (timeString.includes('ADD') && timeString.includes('WORKING_DAY')) {
      timeArray = timeString.split('_');
      return addWorkingDays(dayjs(now), timeArray[2]);
    }
    timeArray = timeString.split('_');
    const base = timeArray[0] === 'NOW' ? dayjs(now) : dayjs(now).utc(false).startOf('date');
    if (timeArray.length === 4) {
      return base[timeArray[1].toLowerCase()](timeArray[2], timeArray[3].toLowerCase());
    }
    return base[timeArray[1].toLowerCase()](timeArray[2]);
  };

  const saveRecords = (records) => {
    return cy.request({
      method: 'POST',
      url: `${baseURL}/arucs/data/v1/aruc/create`,
      body: records,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000 // Increased timeout to handle network delays
    }).then(response => {
      return response.body.numSaved === records.length;
    });
  };

  // Create a fake data object instead of reading from a file
  const data = [
    {
      CPSCreditDate: '2023-05-01',
      StatusChangeEffectiveDate: '2023-05-02',
      StatusChangeActionedDateTime: '2023-05-03T10:00:00Z',
      PaymentStartDate: '2023-05-04',
      PaymentEndDate: '2023-05-05',
      CPSIndex: 1
    },
    {
      CPSCreditDate: '2023-06-01',
      StatusChangeEffectiveDate: '2023-06-02',
      StatusChangeActionedDateTime: '2023-06-03T10:00:00Z',
      PaymentStartDate: '2023-06-04',
      PaymentEndDate: '2023-06-05',
      CPSIndex: 2
    }
  ];

  let mapped;
  if (nonReported === undefined) {
    mapped = data.map((item) => ({
      ...item,
      CPSFilename: `${filename.toUpperCase().replace('.JSON', '')}_${dayjs(startDate).format('YYYY-MM-DD')}`,
      CPSCreditDate: getTime(item.CPSCreditDate, startDate).toDate(),
      StatusChangeEffectiveDate: getTime(item.StatusChangeEffectiveDate, startDate).toDate(),
      StatusChangeActionedDateTime: getTime(item.StatusChangeActionedDateTime, startDate).toDate(),
      PaymentStartDate: getTime(item.PaymentStartDate, startDate).toDate(),
      PaymentEndDate: getTime(item.PaymentEndDate, startDate).toDate(),
    }));
  } else {
    mapped = data.map((item) => ({
      ...item,
      CPSFilename: `${filename.toUpperCase().replace('.JSON', '')}_${dayjs(startDate).format('YYYY-MM-DD')}`,
    }));
  }

  return saveRecords(mapped).then(response => {
    if (!response) {
      throw new Error('Failed to save records');
    }
    cy.log(`Created ${data.length} arucs records from ${filename} starting at ${startDate}`);
  });
});
