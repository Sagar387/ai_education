# backend/main.py
from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
from pdf_utils import extract_text_from_pdf
from openai_client import summarize_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""@app.post("/summarize")
async def summarize_file(
    file: UploadFile = None, 
    text: str = Body(None)
):
    # If neither a file nor text is provided, raise an error
    if not file and not text:
        raise HTTPException(status_code=400, detail="Please provide a file or text.")

    try:
        # CASE 1: A file was uploaded
        if file:
            allowed_content_types = ["application/pdf", "text/plain"]
            if file.content_type not in allowed_content_types:
                raise HTTPException(status_code=400, detail="Invalid file type.")

            # Save the uploaded file temporarily
            file_location = f"temp_{file.filename}"
            with open(file_location, "wb") as f:
                content = await file.read()
                f.write(content)

            # Extract text from PDF or read text file
            if file.content_type == "application/pdf":
                extracted_text = extract_text_from_pdf(file_location)
            else:  # "text/plain"
                with open(file_location, "r", encoding="utf-8") as text_file:
                    extracted_text = text_file.read()

            # Clean up
            os.remove(file_location)

        # CASE 2: Plain text was sent in JSON
        else:
            extracted_text = text

        # Summarize using your Azure function
        summary = summarize_text(extracted_text)

    except Exception as e:
        # Any error in extraction or summarization will raise 500
        raise HTTPException(status_code=500, detail=str(e))

    return {"summary": summary}"""
@app.post("/summarize")
async def summarize_file(
    file: UploadFile = None, 
    text: str = Body(None)
):
    print("🔍 Entered /summarize route")

    if not file and not text:
        raise HTTPException(status_code=400, detail="Please provide a file or text.")

    try:
        if file:
            print(f"📄 File received: {file.filename}, type: {file.content_type}")
            allowed_content_types = ["application/pdf", "text/plain"]
            if file.content_type not in allowed_content_types:
                raise HTTPException(status_code=400, detail="Invalid file type.")

            file_location = f"temp_{file.filename}"
            with open(file_location, "wb") as f:
                content = await file.read()
                f.write(content)

            if file.content_type == "application/pdf":
                print("📚 Extracting text from PDF...")
                extracted_text = extract_text_from_pdf(file_location)
            else:
                print("📄 Reading plain text file...")
                with open(file_location, "r", encoding="utf-8") as text_file:
                    extracted_text = text_file.read()

            os.remove(file_location)

        else:
            print("📝 Text received in body")
            extracted_text = text

        print("✨ Sending to Azure for summarization...")
        summary = summarize_text(extracted_text)
        print("✅ Summary received")

    except Exception as e:
        print(f"❌ Error during processing: {e}")  # <- THIS is what we need to see
        raise HTTPException(status_code=500, detail=str(e))

    return {"summary": summary}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
