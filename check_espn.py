import urllib.request
import json

def get_espn_images():
    # 360 is Manchester United on ESPN
    url = "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/360/roster"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read())
        
        for category in data.get('athletes', []):
            for p in category.get('items', []):
                name = p.get('fullName', '')
                headshot = p.get('headshot', {}).get('href', 'No Headshot')
                print(f"{name}: {headshot}")
            
    except Exception as e:
        print(f"Error fetching data: {e}")

if __name__ == "__main__":
    get_espn_images()
