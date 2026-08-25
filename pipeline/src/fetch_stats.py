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
            news_items.append({
                "title": item.find('title').text if item.find('title') is not None else "",
                "category": "Latest News",
                "image": "/images/news1.png" # Placeholder until we parse image from RSS
            })
        return news_items
    except Exception as e:
        print(f"Error fetching RSS: {e}")
        return []

def fetch_espn_data():
    """Fetches Roster and Schedule from ESPN API and formats as live_data.json"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    # 1. Roster
    response = requests.get('http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/360/roster', headers=headers)
    roster_data = response.json()
    
    starting_xi = []
    if 'athletes' in roster_data and len(roster_data['athletes']) > 0:
        for athlete in roster_data['athletes'][:11]:
            raw_pos = athlete.get('position', {}).get('abbreviation', 'UNK')
            mapped_pos = 'GK' if raw_pos == 'G' else 'DEF' if raw_pos == 'D' else 'MID' if raw_pos == 'M' else 'FWD' if raw_pos == 'F' else raw_pos
            starting_xi.append({
                "name": athlete.get('lastName', athlete.get('displayName', '')),
                "number": int(athlete.get('jersey', 0)) if athlete.get('jersey') else 0,
                "position": mapped_pos
            })
            
    # 2. Schedule
    response = requests.get('http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/360/schedule', headers=headers)
    schedule_data = response.json()
    
    events = schedule_data.get('events', [])
    
    recent_match = None
    next_match = None
    upcoming_matches = []
    
    now = datetime.utcnow()
    
    for event in events:
        try:
            event_date = datetime.strptime(event['date'], "%Y-%m-%dT%H:%MZ")
            competition = event['competitions'][0]
            
            # Find Man Utd and opponent
            team1 = competition['competitors'][0]['team']['displayName']
            team2 = competition['competitors'][1]['team']['displayName']
            is_home = (team1 == 'Manchester United')
            opponent = team2 if is_home else team1
            
            match_obj = {
                "opponent": opponent,
                "opponentShort": opponent[:3].upper(),
                "isHome": is_home,
                "date": event_date.strftime("%a %d %b"),
                "time": event_date.strftime("%H:%M"),
                "competition": "Premier League" # Will refine later
            }
            
            if event_date < now:
                # Add score if completed
                if 'score' in competition['competitors'][0]:
                    man_utd_score = competition['competitors'][0 if is_home else 1]['score'].get('value', 0)
                    opp_score = competition['competitors'][1 if is_home else 0]['score'].get('value', 0)
                    match_obj["score"] = f"{int(man_utd_score)}-{int(opp_score)}"
                    match_obj["result"] = "W" if int(man_utd_score) > int(opp_score) else "L" if int(man_utd_score) < int(opp_score) else "D"
                recent_match = match_obj
            else:
                if not next_match:
                    next_match = match_obj
                else:
                    upcoming_matches.append(match_obj)
        except Exception as e:
            continue
            
    # Fetch News
    news = fetch_live_news()
    if not news:
        news = [
            { "title": "Live data successfully fetched from ESPN!", "category": "System", "image": "/images/news1.png" }
        ]
                
    # 3. Compile live_data.json equivalent
    live_data = {
        "manager": "Rúben Amorim",
        "season": "2024/25",
        "leaguePosition": 1, # Placeholder
        "recentMatch": recent_match,
        "nextMatch": next_match,
        "upcomingMatches": upcoming_matches[:5],
        "startingXI": starting_xi,
        "news": news,
        "videos": [
            { "title": "Manchester United vs Latest Opponent Highlights", "duration": "10:00", "image": "/images/vid1.png" },
            { "title": "Press Conference: Rúben Amorim", "duration": "15:30", "image": "/images/vid2.png" },
            { "title": "Inside Training at Carrington", "duration": "08:45", "image": "/images/vid3.png" },
            { "title": "Top Goals of the Month", "duration": "05:12", "image": "/images/vid4.png" }
        ]
    }
    return live_data

def lambda_handler(event, context):
    try:
        bucket_name = os.environ['DATA_BUCKET_NAME']
        
        print("Fetching data from ESPN API...")
        live_data = fetch_espn_data()
        
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
            "body": json.dumps({"message": "Success! Scraped ESPN data and saved to S3."})
        }
        
    except Exception as e:
        print(f"Error executing Lambda: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
