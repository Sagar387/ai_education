# backend/azure_client.py
import os
import requests

AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

def summarize_text(text):
    url = f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{DEPLOYMENT_NAME}/completions?api-version=2022-12-01"
    headers = {
        "Content-Type": "application/json",
        "api-key": AZURE_OPENAI_API_KEY,
    }
    payload = {
        "prompt": f"Summarize the following text:\n\n{text}",
        "max_tokens": 150,
        "temperature": 0.5,
    }
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"Azure OpenAI request failed: {response.text}")
    data = response.json()
    summary = data["choices"][0]["text"].strip()
    return summary
