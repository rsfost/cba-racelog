export const name = 'utils';

const monthMap = {
    '1': 'January',
    '2': 'February',
    '3': 'March',
    '4': 'April',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'August',
    '9': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
};

/**
 * Converts date string in form "dd/mm/yyyy" to string in form "Month dd, yyyy"
 */
export function prettyPrintDate(date) {
    let dateParts;
    date = date || '01/01/1901';
    dateParts = date.split('/');
    if (!dateParts || dateParts.length < 3) {
        dateParts = ['01', '01', '1901'];
    }
    const monthStr = monthMap[dateParts[1].replace(/^0+/, '')] || dateParts[1];
    return `${monthStr} ${dateParts[0]}, ${dateParts[2]}`;
}
