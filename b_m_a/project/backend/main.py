# backend/main.py
import os
import traceback
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pdf_utils import extract_text_from_pdf
from azure_client import summarize_text

app = FastAPI()

# Enable CORS so your React frontend can make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend URL(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/summarize")
async def summarize_pdf(file: UploadFile = File(...)):
    # Ensure that only PDF files are accepted
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")
    
    # Save the uploaded PDF temporarily
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        content = await file.read()
        f.write(content)
    
    try:
        # Extract text from the PDF
        extracted_text = extract_text_from_pdf(file_location)
        # Summarize the extracted text using Azure AI
        summary = summarize_text(extracted_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Remove the temporary file
        if os.path.exists(file_location):
            os.remove(file_location)
    
    return {"summary": summary}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
