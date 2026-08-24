import json
import os
import requests
import boto3

# Initialize AWS clients
ssm = boto3.client('ssm')
s3 = boto3.client('s3')

def get_ssm_parameter(param_name):
    """Securely fetches API keys from AWS SSM Parameter Store."""
    response = ssm.get_parameter(Name=param_name, WithDecryption=True)
    return response['Parameter']['Value']

def fetch_fpl_data():
    """Fetches Manchester United player data from the free Official FPL API."""
    url = "https://fantasy.premierleague.com/api/bootstrap-static/"
    headers = {
        # FPL API requires a User-Agent to prevent blocking
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    data = response.json()
    
    # Find Manchester United's Team ID (usually 14)
    man_utd_id = None
    for team in data['teams']:
        if team['name'] == 'Man Utd':
            man_utd_id = team['id']
            break
            
    # Extract all Man Utd players
    players = []
    for element in data['elements']:
        if element['team'] == man_utd_id:
            # The FPL API uses the 'code' for the high-res image
            photo_code = str(element['code'])
            players.append({
                "name": f"{element['first_name']} {element['second_name']}",
                "position_id": element['element_type'],
                "goals": element['goals_scored'],
                "assists": element['assists'],
                "clean_sheets": element['clean_sheets'],
                "form": element['form'],
                "ict_index": element['ict_index'], # Influence, Creativity, Threat
                "image_url": f"https://resources.premierleague.com/premierleague/photos/players/250x250/p{photo_code}.png"
            })
            
    # Sort players by ICT index (overall impact) descending
    players.sort(key=lambda x: float(x['ict_index']), reverse=True)
    return players[:10] # Return top 10 players to save AI token limits

def lambda_handler(event, context):
    """AWS Lambda entry point for the $0 Data Engine."""
    try:
        print("Fetching free data from FPL API...")
        # 1. Fetch free data (wrapped in try/except for robustness)
        try:
            top_players = fetch_fpl_data()
        except Exception as scrape_err:
            print(f"Scraping failed: {str(scrape_err)}")
            raise Exception("Critical: Failed to fetch fallback FPL data.")
            
        clean_stats = {
            "team": "Manchester United",
            "top_performers": top_players
        }
        
        # 2. Fetch Gemini API Key & Initialize AI
        gemini_api_key = get_ssm_parameter("/manutd-ecosystem/GeminiApiKey")
        
        from google import genai
        client = genai.Client(api_key=gemini_api_key)
        
        # 3. Generate the YouTube Script using the FPL data
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
        print("Generated YouTube Script Successfully!")
        
        # 4. Save data and script to our secure S3 Bucket
        bucket_name = os.environ['DATA_BUCKET_NAME']
        
        # Save cleaned JSON stats
        s3.put_object(
            Bucket=bucket_name,
            Key='latest_stats.json',
            Body=json.dumps(clean_stats),
            ContentType='application/json'
        )
        
        # Save generated YouTube script
        s3.put_object(
            Bucket=bucket_name,
            Key='latest_youtube_script.txt',
            Body=youtube_script,
            ContentType='text/plain'
        )
        print(f"Successfully saved files to S3 bucket: {bucket_name}")
        
        # 5. Trigger AWS Amplify Webhook to rebuild the frontend site
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
