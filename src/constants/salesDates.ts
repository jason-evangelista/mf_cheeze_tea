
// YYYY-MM-DD
export const transformSalesMonth = (year: number) => {
  return {
    Jan: {
      start: `${year}-01-01`,
      end: `${year}-01-31`,
    },
    Feb: {
      start: `${year}-02-01`,
      end: `${year}-02-29`,
    },
    Mar: {
      start: `${year}-03-01`,
      end: `${year}-03-31`,
    },
    Apr: {
      start: `${year}-04-01`,
      end: `${year}-04-30`,
    },
    May: {
      start: `${year}-05-01`,
      end: `${year}-05-31`,
    },
    June: {
      start: `${year}-06-01`,
      end: `${year}-06-30`,
    },
    July: {
      start: `${year}-07-01`,
      end: `${year}-07-31`,
    },
    Aug: {
      start: `${year}-08-01`,
      end: `${year}-08-31`,
    },
    Sep: {
      start: `${year}-09-01`,
      end: `${year}-09-30`,
    },
    Oct: {
      start: `${year}-10-01`,
      end: `${year}-10-31`,
    },
    Nov: {
      start: `${year}-11-01`,
      end: `${year}-11-30`,
    },
    Dec: {
      start: `${year}-12-01`,
      end: `${year}-12-31`,
    },
  };
};

export const parseDate = (date: string) => new Date(date);
