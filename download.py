import os
import requests
import sys

SHEET_ID = '1G4PP-JtaxcOG6MFJEJIXM-OcWA5mXBDkkY0bPQl0OZo'
SHEET_RANGE = "'Race Log'!B4:K20000"
API_KEY_ENV = 'GOOGLE_API_KEY'

def main():
    api_key = os.environ.get(API_KEY_ENV)
    if api_key is None:
        print(f'Error: {API_KEY_ENV} environment variable is not set.', file = sys.stderr)
        exit(1)
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{SHEET_RANGE}?key={api_key}'
    resp = requests.get(url, headers = { 'Accept': 'application/json' })
    if not resp.ok:
        print(resp.text, file = sys.stderr)
        exit(2)
    print(resp.text)

if __name__ == '__main__':
    main()