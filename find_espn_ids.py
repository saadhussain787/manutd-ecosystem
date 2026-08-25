import urllib.request
import json
import urllib.parse

players = ["Bruno Fernandes", "Marcus Rashford", "Kobbie Mainoo", "Alejandro Garnacho", "Rasmus Hojlund", "Diogo Dalot", "Lisandro Martinez", "Andre Onana", "Mason Mount", "Leny Yoro"]

def get_espn_id(name):
    query = urllib.parse.quote(name)
    url = f"https://site.api.espn.com/apis/search/v2?query={query}&limit=5"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read())
        for r in data.get('results', []):
            for c in r.get('contents', []):
                # Search for soccer athletes
                if 'soccer' in c.get('url', '') and '/player/_/id/' in c.get('url', ''):
                    # extract id from url
                    # e.g. https://www.espn.com/soccer/player/_/id/177024/bruno-fernandes
                    parts = c['url'].split('/')
                    if 'id' in parts:
                        idx = parts.index('id')
                        return parts[idx+1]
    except Exception as e:
        pass
    return None

def main():
    for p in players:
        espn_id = get_espn_id(p)
        print(f"{p}: {espn_id}")

if __name__ == "__main__":
    main()
