import json
import os
import urllib.request
import boto3

# Initialize AWS clients
ssm = boto3.client('ssm') # Automatically uses the deployment region (ca-central-1)
s3 = boto3.client('s3')

def get_ssm_parameter(param_name):
    """Securely fetches API keys from AWS SSM Parameter Store."""
    response = ssm.get_parameter(Name=param_name, WithDecryption=True)
    return response['Parameter']['Value']

def lambda_handler(event, context):
    """
    AWS Lambda entry point.
    Fetches Manchester United stats from API-Football.
    """
    try:
        # 1. Fetch our secure API Key
        api_key = get_ssm_parameter("/manutd-ecosystem/ApiFootballKey")
        
        # Manchester United Team ID in API-Football is 33
        team_id = "33"
        season = "2023" # Current or target season
        
        # 2. Setup the request to API-Football
        url = f"https://v3.football.api-sports.io/teams/statistics?season={season}&team={team_id}&league=39"
        
        req = urllib.request.Request(url)
        req.add_header('x-rapidapi-key', api_key)
        req.add_header('x-rapidapi-host', 'v3.football.api-sports.io')
        
        # 3. Execute request
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            
        # 4. Clean the data to save tokens for Gemini later
        clean_stats = {
            "team": data["response"]["team"]["name"],
            "form": data["response"]["form"],
            "fixtures_played": data["response"]["fixtures"]["played"]["total"],
            "wins": data["response"]["fixtures"]["wins"]["total"],
            "draws": data["response"]["fixtures"]["draws"]["total"],
            "loses": data["response"]["fixtures"]["loses"]["total"],
            "goals_for": data["response"]["goals"]["for"]["total"]["total"],
            "goals_against": data["response"]["goals"]["against"]["total"]["total"]
        }
        
        # 5. Fetch Gemini API Key & Initialize AI
        gemini_api_key = get_ssm_parameter("/manutd-ecosystem/GeminiApiKey")
        
        # Using the official google-genai SDK
        from google import genai
        from google.genai import types
        
        client = genai.Client(api_key=gemini_api_key)
        
        # 6. Generate the YouTube Script using the cleaned data
        prompt = f"""
        Act as a professional Manchester United sports analyst. 
        Write an engaging, 4-minute YouTube script analyzing this current data: {json.dumps(clean_stats)}. 
        Focus on the team's form, goal difference, and overall performance.
        Do not include camera directions, just the spoken script.
        """
        
        ai_response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
        )
        youtube_script = ai_response.text
        
        print("Generated YouTube Script Successfully!")
        
        # 7. Save data and script to our secure S3 Bucket
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
        
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Successfully fetched stats and generated script!",
                "data": clean_stats,
                "script": youtube_script
            })
        }
        
    except Exception as e:
        print(f"Error fetching data or generating script: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
