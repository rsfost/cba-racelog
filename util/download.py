#!/usr/bin/env python3

# Downloads the Casual BA Race Log as JSON.

import os
from time import strptime
import requests
import sys
import pandas
import json

SHEET_ID = '1G4PP-JtaxcOG6MFJEJIXM-OcWA5mXBDkkY0bPQl0OZo'
SHEET_RANGE = "'Race Log'!B4:K20000"
API_KEY_ENV = 'GOOGLE_API_KEY'
URL = f'https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{SHEET_RANGE}'

def main():
    # Fetch race log from google sheets
    api_key = os.environ.get(API_KEY_ENV)
    if api_key is None:
        print(f'Error: {API_KEY_ENV} environment variable is not set.', file = sys.stderr)
        exit(1)
    resp = requests.get(f'{URL}?key={api_key}', headers = { 'Accept': 'application/json' })
    if not resp.ok:
        print(resp.text, file = sys.stderr)
        exit(2)

    # Pass teams list to pandas and group teams by date
    allTeams = resp.json()['values']
    df = pandas.DataFrame(allTeams[1:], columns=allTeams[0])
    df.drop(df.columns[1], axis=1, inplace=True)
    df.rename(inplace=True, columns = {
        'DATE': 'date',
        'RACE': 'race',
        'MEMBER 1': 'captain',
        'MEMBER 2': 'pick1',
        'MEMBER 3': 'pick2',
        'MEMBER 4': 'pick3',
        'MEMBER 5': 'pick4',
        'TIME': 'time',
        'POSITION': 'position'
    })
    dateGroups = sorted(df.groupby(by= 'date'),
        reverse = True, key = lambda g: strptime(g[0], '%d/%m/%Y'))

    # Build "race day records" and dump json to stdout
    returnValue = []
    for dateGroup in dateGroups:
        date = dateGroup[0]
        teams = dateGroup[1]
        raceGroups = sorted(teams.groupby(by = 'race'), key = lambda g: g[0])
        raceDay = { 'date': date, 'races': [] }
        returnValue.append(raceDay)
        for raceGroup in raceGroups:
            raceNum = raceGroup[0]
            race = raceGroup[1]
            raceDay['races'].append(race.to_dict(orient = 'records'))

    json.dump(returnValue, sys.stdout)


if __name__ == '__main__':
    main()
