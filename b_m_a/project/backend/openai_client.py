# backend/azure_client.py
import os
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

# Create the Azure OpenAI client
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-05-01-preview"
)

DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

def summarize_text(text):
    """
    Summarize text using Azure OpenAI GPT model via the chat completions API.
    
    Args:
        text (str): The text to summarize
        
    Returns:
        str: The generated summary
    """
    try:
        response = client.chat.completions.create(
            model=DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes text concisely."},
                {"role": "user", "content": f"Please summarize the following text:\n\n{text}"}
            ],
            max_tokens=150,
            temperature=0.5
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error while calling Azure OpenAI: {str(e)}")
        raise Exception(f"Azure OpenAI request failed: {str(e)}")