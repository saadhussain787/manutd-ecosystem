import urllib.request
import json

def check_live_fpl():
    print("Fetching live FPL data...\n")
    url = "https://fantasy.premierleague.com/api/bootstrap-static/"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read())
        
        # Find Man Utd ID (usually 14)
        man_utd_id = next(team['id'] for team in data['teams'] if team['name'] == 'Man Utd')
        
        # Filter for Man Utd players
        man_utd_players = [p for p in data['elements'] if p['team'] == man_utd_id]
        
        # Sort by total points to see who is highest
        man_utd_players.sort(key=lambda x: x['total_points'], reverse=True)
        
        print("--- LIVE MANCHESTER UNITED STATS ---")
        for p in man_utd_players[:10]:
            print(f"{p['first_name']} {p['second_name']}: Goals: {p['goals_scored']}, Assists: {p['assists']}, Total Points: {p['total_points']}")
            
    except Exception as e:
        print(f"Error fetching data: {e}")

if __name__ == "__main__":
    check_live_fpl()
