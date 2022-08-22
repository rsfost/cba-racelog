export const name = 'racelog';

let racelog;

export async function init() {
    const resp = await fetch('./data/racelog.json');
    racelog = await resp.json();
}

export function getRaceDays() {
    return racelog;
}
