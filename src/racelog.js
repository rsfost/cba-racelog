export const name = 'racelog';

let racelog;

export async function init() {
    const resp = await fetch('./data/racelog.json');
    racelog = await resp.json();
}

export function getRaceDays(start = 0, count = 10) {
    return racelog.slice(start, start + count);
}
