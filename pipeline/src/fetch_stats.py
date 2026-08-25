import json
import os
import requests
import boto3
import urllib.request
import xml.etree.ElementTree as ET

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
        for item in root.findall('./channel/item')[:6]: # Get top 6 articles
            news_items.append({
                "title": item.find('title').text if item.find('title') is not None else "",
                "link": item.find('link').text if item.find('link') is not None else "",
                "pubDate": item.find('pubDate').text if item.find('pubDate') is not None else "",
                "description": item.find('description').text if item.find('description') is not None else ""
            })
        return news_items
    except Exception as e:
        print(f"Error fetching RSS: {e}")
        return []

def fetch_squad_data():
    """Fetches full squad and top players from FPL."""
    url = "https://fantasy.premierleague.com/api/bootstrap-static/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    data = response.json()
    
    man_utd_id = next((team['id'] for team in data['teams'] if team['name'] == 'Man Utd'), None)
    if not man_utd_id:
        return [], []
            
    players = []
    for element in data['elements']:
        if element['team'] == man_utd_id:
            photo_code = str(element['code'])
            players.append({
                "id": element['id'],
                "name": f"{element['first_name']} {element['second_name']}",
                "first_name": element['first_name'],
                "second_name": element['second_name'],
                "position_id": element['element_type'],
                "goals": element['goals_scored'],
                "assists": element['assists'],
                "clean_sheets": element['clean_sheets'],
                "form": element['form'],
                "ict_index": element['ict_index'],
                "now_cost": element['now_cost'],
                "selected_by_percent": element['selected_by_percent'],
                "image_url": f"https://resources.premierleague.com/premierleague/photos/players/250x250/p{photo_code}.png",
                "total_points": element['total_points'],
                "minutes": element['minutes'],
                "yellow_cards": element['yellow_cards'],
                "red_cards": element['red_cards'],
            })
            
            
    # Sort for top 10 players
    sorted_players = sorted(players, key=lambda x: (float(x['ict_index']), int(x['now_cost']), float(x['selected_by_percent'])), reverse=True)
    return players, sorted_players[:10], data['teams']

def fetch_fixtures_data():
    """Fetches all fixtures for FPL."""
    url = "https://fantasy.premierleague.com/api/fixtures/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    data = response.json()
    
    # We will upload the raw array or filter it. 
    # To keep the Next.js page logic identical, we upload the raw fixtures array.
    return data

def lambda_handler(event, context):
    try:
        bucket_name = os.environ['DATA_BUCKET_NAME']
        
        print("Fetching free data from FPL API...")
        # 1. Fetch live squad data
        try:
            full_squad, top_players, teams = fetch_squad_data()
            
            # Save full squad
            s3.put_object(
                Bucket=bucket_name,
                Key='full_squad.json',
                Body=json.dumps(full_squad),
                ContentType='application/json'
            )
            print("Saved full_squad.json")
            
            # Save teams
            s3.put_object(
                Bucket=bucket_name,
                Key='teams.json',
                Body=json.dumps(teams),
                ContentType='application/json'
            )
            print("Saved teams.json")
        except Exception as scrape_err:
            print(f"Failed to fetch FPL data: {str(scrape_err)}")
            top_players = []
            
        # 2. Fetch fixtures
        try:
            fixtures_data = fetch_fixtures_data()
            s3.put_object(
                Bucket=bucket_name,
                Key='fixtures.json',
                Body=json.dumps(fixtures_data),
                ContentType='application/json'
            )
            print("Saved fixtures.json")
        except Exception as e:
            print(f"Failed to fetch fixtures: {e}")
            
        print("Fetching live news from Sky Sports RSS...")
        live_news = fetch_live_news()
        
        clean_stats = {
            "team": "Manchester United",
            "top_performers": top_players,
            "live_news": live_news
        }
        
        gemini_api_key = get_ssm_parameter("/manutd-ecosystem/GeminiApiKey")
        from google import genai
        client = genai.Client(api_key=gemini_api_key)
        
        prompt = f"""
        Act as a professional Manchester United sports analyst. 
        Write an engaging, 4-minute YouTube script analyzing this current player data: {json.dumps(clean_stats)}. 
        Focus on the top performers, their ICT index (Influence, Creativity, Threat), and their form.
        Do not include camera directions, just the spoken script.
        """
        
        ai_response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
        )
        youtube_script = ai_response.text
        
        # Save latest_stats.json and script
        s3.put_object(
            Bucket=bucket_name,
            Key='latest_stats.json',
            Body=json.dumps(clean_stats),
            ContentType='application/json'
        )
        s3.put_object(
            Bucket=bucket_name,
            Key='latest_youtube_script.txt',
            Body=youtube_script,
            ContentType='text/plain'
        )
        print(f"Successfully saved files to S3 bucket: {bucket_name}")
        
        # Trigger AWS Amplify Webhook to rebuild the frontend site
        try:
            webhook_url = get_ssm_parameter("AmplifyWebhookUrl")
            requests.post(webhook_url)
            print("Triggered Amplify Webhook.")
        except Exception as webhook_err:
            print(f"Warning: Failed to trigger webhook. {str(webhook_err)}")
        
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Success! Scraped FPL data and saved to S3."})
        }
        
    except Exception as e:
        print(f"Error executing Lambda: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
