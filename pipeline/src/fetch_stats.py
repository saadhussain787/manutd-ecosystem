import json
import os
import requests
import boto3
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

# Initialize AWS clients
ssm = boto3.client('ssm')
s3 = boto3.client('s3')

def get_ssm_parameter(param_name):
    """Securely fetches API keys from AWS SSM Parameter Store."""
    response = ssm.get_parameter(Name=param_name, WithDecryption=True)
    return response['Parameter']['Value']

def fetch_live_news():
    """Fetches real live Manchester United news from Sky Sports RSS."""
    try:
        req = urllib.request.Request('https://www.skysports.com/rss/11667', headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        root = ET.fromstring(response.read())
        
        news_items = []
        for item in root.findall('./channel/item')[:6]:
            title = item.find('title').text if item.find('title') is not None else ""
            enclosure = item.find('enclosure')
            image_url = enclosure.attrib['url'] if enclosure is not None and 'url' in enclosure.attrib else "/images/news1.png"
            news_items.append({
                "title": title,
                "category": "Latest News",
                "image": image_url
            })
        return news_items
    except Exception as e:
        print(f"Error fetching RSS: {e}")
        return []

def fetch_apifootball_data():
    """Fetches Standings, Fixtures, Squad, and Lineups from API-Football."""
    import time
    try:
        api_key = get_ssm_parameter("/manutd-ecosystem/ApiFootballKey")
    except Exception as e:
        print(f"Failed to get API key from SSM: {e}")
        api_key = "DEMO_KEY_IF_NEEDED"
        
    headers = {
        'x-rapidapi-host': "v3.football.api-sports.io",
        'x-rapidapi-key': api_key
    }
    
    # 1. Standings
    print("Fetching standings...")
    standings_res = requests.get("https://v3.football.api-sports.io/standings?league=39&season=2024", headers=headers).json()
    league_position = 0
    table = []
    
    if standings_res.get('response'):
        league = standings_res['response'][0]['league']
        standings = league['standings'][0]
        for team in standings:
            table.append({
                "pos": team['rank'],
                "team": team['team']['name'],
                "played": team['all']['played'],
                "wins": team['all']['win'],
                "draws": team['all']['draw'],
                "losses": team['all']['lose'],
                "gd": team['goalsDiff'],
                "pts": team['points'],
                "isManUtd": team['team']['id'] == 33
            })
            if team['team']['id'] == 33:
                league_position = team['rank']
                
    # 2. Fixtures
    print("Fetching fixtures...")
    fixtures_res = requests.get("https://v3.football.api-sports.io/fixtures?team=33&season=2024", headers=headers).json()
    fixtures = fixtures_res.get('response', [])
    
    # Sort fixtures by timestamp
    fixtures.sort(key=lambda x: x['fixture']['timestamp'])
    
    # Mock 'now' to Nov 1, 2024 so we have a realistic split of past/future fixtures for the 2024 season
    now = 1730419200 
    past_fixtures = [f for f in fixtures if f['fixture']['timestamp'] < now and f['fixture']['status']['short'] in ['FT', 'AET', 'PEN']]
    future_fixtures = [f for f in fixtures if f['fixture']['timestamp'] >= now]
    
    recent_match = None
    if past_fixtures:
        recent = past_fixtures[-1]
        is_home = recent['teams']['home']['id'] == 33
        opponent_team = recent['teams']['away'] if is_home else recent['teams']['home']
        
        home_goals = recent['goals']['home'] or 0
        away_goals = recent['goals']['away'] or 0
        
        man_utd_score = home_goals if is_home else away_goals
        opp_score = away_goals if is_home else home_goals
            
        recent_match = {
            "opponent": opponent_team['name'],
            "opponentShort": opponent_team['name'][:3].upper(),
            "isHome": is_home,
            "date": datetime.utcfromtimestamp(recent['fixture']['timestamp']).strftime("%a %d %b"),
            "time": datetime.utcfromtimestamp(recent['fixture']['timestamp']).strftime("%H:%M"),
            "competition": recent['league']['name'],
            "score": f"{man_utd_score}-{opp_score}",
            "result": "W" if man_utd_score > opp_score else "L" if man_utd_score < opp_score else "D"
        }
        
    next_match = None
    upcoming_matches = []
    for f in future_fixtures:
        is_home = f['teams']['home']['id'] == 33
        opponent_team = f['teams']['away'] if is_home else f['teams']['home']
        match_obj = {
            "opponent": opponent_team['name'],
            "opponentShort": opponent_team['name'][:3].upper(),
            "isHome": is_home,
            "date": datetime.utcfromtimestamp(f['fixture']['timestamp']).strftime("%a %d %b"),
            "time": datetime.utcfromtimestamp(f['fixture']['timestamp']).strftime("%H:%M"),
            "competition": f['league']['name']
        }
        if not next_match:
            next_match = match_obj
        else:
            upcoming_matches.append(match_obj)
            
    # 3. Lineups (Fallback backwards until a grid is found)
    starting_xi = []
    manager = "Unknown"
    print("Fetching lineups...")
    # Loop backwards through past fixtures until we find one with startXI and grid
    for past_f in reversed(past_fixtures):
        fixture_id = past_f['fixture']['id']
        lineup_res = requests.get(f"https://v3.football.api-sports.io/fixtures/lineups?fixture={fixture_id}", headers=headers).json()
        
        found_grid = False
        temp_xi = []
        temp_manager = "Unknown"
        
        for team_lineup in lineup_res.get('response', []):
            if team_lineup['team']['id'] == 33:
                raw_manager = team_lineup.get('coach', {}).get('name', 'Unknown')
                # Clean up manager name (e.g. "Ruben Filipe Marques Diogo Amorim" -> "Rúben Amorim")
                if "Amorim" in raw_manager:
                    temp_manager = "Rúben Amorim"
                elif "ten Hag" in raw_manager:
                    temp_manager = "Erik ten Hag"
                else:
                    parts = raw_manager.split()
                    if len(parts) > 2:
                        temp_manager = f"{parts[0]} {parts[-1]}"
                    else:
                        temp_manager = raw_manager
                        
                for player in team_lineup.get('startXI', []):
                    p = player['player']
                    pos = p.get('pos')
                    grid = p.get('grid')
                    if grid: found_grid = True
                    
                    mapped_pos = 'GK' if pos == 'G' else 'DEF' if pos == 'D' else 'MID' if pos == 'M' else 'FWD' if pos == 'F' else pos
                    temp_xi.append({
                        "name": p.get('name', ''),
                        "number": p.get('number', 0),
                        "position": mapped_pos,
                        "grid": grid
                    })
                    
        if found_grid and len(temp_xi) == 11:
            starting_xi = temp_xi
            manager = temp_manager
            print(f"Found valid lineup from fixture {fixture_id}")
            break

    # 4. Squad
    print("Fetching squad...")
    squad_res = requests.get("https://v3.football.api-sports.io/players/squads?team=33", headers=headers).json()
    squad = []
    if squad_res.get('response'):
        players = squad_res['response'][0].get('players', [])
        for p in players:
            squad.append({
                "id": p['id'],
                "name": p['name'],
                "age": p.get('age', 0),
                "number": p.get('number', 0),
                "position": p['position'],
                "photo": p.get('photo', '')
            })

    # Fetch News
    print("Fetching news...")
    news = fetch_live_news()
    if not news:
        news = [
            { "title": "Live data successfully fetched from API-Football!", "category": "System", "image": "/images/news1.png" }
        ]
                
    live_data = {
        "manager": manager,
        "season": "2024/25",
        "leaguePosition": league_position,
        "table": table,
        "recentMatch": recent_match,
        "nextMatch": next_match,
        "upcomingMatches": upcoming_matches[:5],
        "startingXI": starting_xi,
        "squad": squad,
        "news": news,
        "videos": [
            { "title": "Manchester United vs Latest Opponent Highlights", "duration": "10:00", "image": "/images/vid1.png" },
            { "title": "Press Conference Highlights", "duration": "15:30", "image": "/images/vid2.png" },
            { "title": "Inside Training at Carrington", "duration": "08:45", "image": "/images/vid3.png" },
            { "title": "Top Goals of the Month", "duration": "05:12", "image": "/images/vid4.png" }
        ]
    }
    return live_data

def lambda_handler(event, context):
    try:
        bucket_name = os.environ['DATA_BUCKET_NAME']
        
        print("Fetching data from API-Football...")
        live_data = fetch_apifootball_data()
        
        # Save live_data.json to S3
        s3.put_object(
            Bucket=bucket_name,
            Key='live_data.json',
            Body=json.dumps(live_data),
            ContentType='application/json'
        )
        print(f"Successfully saved live_data.json to S3 bucket: {bucket_name}")
        
        # Trigger AWS Amplify Webhook to rebuild the frontend site (optional)
        try:
            webhook_url = get_ssm_parameter("AmplifyWebhookUrl")
            requests.post(webhook_url)
            print("Triggered Amplify Webhook.")
        except Exception as webhook_err:
            print(f"Warning: Failed to trigger webhook. {str(webhook_err)}")
        
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Success! Scraped API-Football data and saved to S3."})
        }
        
    except Exception as e:
        print(f"Error executing Lambda: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
