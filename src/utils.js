export const name = 'utils';

const monthMap = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
};

/**
 * Converts date string in form "dd/mm/yyyy" to string in form "Month dd, yyyy"
 */
export function prettyPrintDate(date) {
    const monthStr = monthMap[date.getMonth()];
    return `${monthStr} ${date.getDate()}, ${date.getFullYear()}`;
}
