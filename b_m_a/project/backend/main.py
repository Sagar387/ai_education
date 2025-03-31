import os
import json
import uuid
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional
import msal
from jose import jwt
from database import client, container  
from pdf_utils import extract_text_from_pdf
from openai_client import generate_quiz, generate_flashcards
from models import QuizDocument, SavedQuizResponse, SaveQuizAttemptRequest, SaveQuizAttemptResponse, QuizAttempt, FlashcardDocument

# Load the environment variables
load_dotenv()

# Create FastAPI app instance
app = FastAPI(title="Blue Marble Academy API")

# Add CORS middleware to allow the frontend React app to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# OAuth2 scheme to extract the token from the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Configure the MSAL client for validating tokens
def get_msal_app():
    return msal.ConfidentialClientApplication(
        client_id=os.getenv("CLIENT_ID"),
        authority=os.getenv("AUTHORITY"),
        client_credential=os.getenv("CLIENT_SECRET")
    )

# Validate the JWT token from Azure AD B2C
async def validate_token(token: str = Depends(oauth2_scheme)):
    try:
        # we're skipping proper token validation for now
        # We'd need to verify the token properly against Azure AD B2C's public key
        # Use a dummy key for development
        dummy_key = "development_key_not_for_production"
        
        # Use options to skip signature verification for development
        decoded_token = jwt.decode(
            token,
            key=dummy_key,  # Using a dummy key since we're not verifying the signature
            options={
                "verify_signature": False,  # Skip signature verification for development
                "verify_aud": False,        # Skip audience verification
                "verify_exp": False         # Skip expiration verification
            }
        )
        
        # Check if token contains expected claims
        if not decoded_token.get("sub"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token claims - missing 'sub' claim"
            )
            
        return decoded_token
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )

# Root endpoint - public
@app.get("/")
def read_root():
    return {"message": "Backend is running and connected to Cosmos DB!"}

# PDF upload and quiz generation endpoint - protected
@app.post("/generate-quiz")
async def create_quiz(
    file: UploadFile = File(...), 
    num_questions: Optional[int] = Form(10),
    focus_topics: Optional[str] = Form(""),
    question_formats: Optional[str] = Form("{}"),
    user_claims: dict = Depends(validate_token)
):
    try:
        # Save the uploaded file temporarily
        file_path = f"./temp_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        # Extract text from the PDF
        text = extract_text_from_pdf(file_path)
        
        # Parse question formats from string to dict
        try:
            formats_dict = json.loads(question_formats)
        except:
            formats_dict = {
                "multiple_choice": True,
                "multi_select": True,
                "drag_and_drop": True
            }
        
        # Get selected formats as a list
        selected_formats = [format for format, selected in formats_dict.items() if selected]
        
        # Validate inputs
        if num_questions < 10:
            num_questions = 10
        elif num_questions > 40:
            num_questions = 40
            
        if not selected_formats:
            selected_formats = ["multiple_choice"]
            
        # Generate quiz using Azure OpenAI with customization options
        quiz_json = generate_quiz(
            text=text,
            num_questions=num_questions,
            focus_topics=focus_topics.strip(),
            question_formats=selected_formats
        )
        
        # Clean up the temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
        
        quiz_data = json.loads(quiz_json)
        
        # Automatically save the quiz
        quiz_document = {
            "id": str(uuid.uuid4()),
            "userId": user_claims["sub"],
            "contentType": "quiz",
            "createdAt": datetime.utcnow().isoformat(),
            "data": {
                "title": quiz_data["quiz_title"],
                "questions": quiz_data["questions"],
                "userAnswers": None,
                "score": None,
                "timeTaken": 0,
                "resourceName": file.filename,
                "options": {
                    "numQuestions": num_questions,
                    "selectedTopics": focus_topics.split(",") if focus_topics else [],
                    "customTopics": focus_topics,
                    "questionFormats": formats_dict
                },
                "attempts": []
            }
        }
        
        # Save to Cosmos DB
        container.create_item(body=quiz_document)
        
        # Return the quiz data with the ID
        quiz_data["id"] = quiz_document["id"]
        return quiz_data
    except Exception as e:
        print(f"Error generating quiz: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate quiz: {str(e)}"
        )

# Save quiz endpoint - protected 
@app.post("/save-quiz", response_model=SavedQuizResponse)
async def save_quiz(quiz: QuizDocument, user_claims: dict = Depends(validate_token)):
    try:
        # Prepare document for Cosmos DB
        document = {
            "id": str(uuid.uuid4()),
            "userId": user_claims["sub"],  
            "contentType": quiz.contentType,
            "createdAt": datetime.utcnow().isoformat(),
            "data": quiz.data.dict()  
        }
        
        # Save to Cosmos DB
        container.create_item(body=document)
        return {"id": document["id"], "message": "Quiz saved successfully"}
    except Exception as e:
        print(f"Error saving quiz: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to save quiz: {str(e)}"
        )

# Save quiz attempt endpoint - protected
@app.post("/save-quiz-attempt", response_model=SaveQuizAttemptResponse)
async def save_quiz_attempt(attempt: SaveQuizAttemptRequest, user_claims: dict = Depends(validate_token)):
    try:
        # First, retrieve the original quiz
        quiz_id = attempt.quizId
        
        try:
            # Get the quiz from Cosmos DB
            quiz = container.read_item(
                item=quiz_id, 
                partition_key=user_claims["sub"]
            )
            
            # Verify the quiz belongs to the user
            if quiz["userId"] != user_claims["sub"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, 
                    detail="Access denied"
                )
                
        except Exception as e:
            print(f"Error retrieving quiz: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Quiz not found"
            )
        
        # Create a new attempt record
        attempt_id = str(uuid.uuid4())
        new_attempt = {
            "attemptId": attempt_id,
            "timestamp": datetime.utcnow().isoformat(),
            "score": attempt.score,
            "timeTaken": attempt.timeTaken,
            "userAnswers": attempt.userAnswers,
            "mode": attempt.mode
        }
        
        # Add the attempt to the quiz's attempts array
        if "attempts" not in quiz["data"]:
            quiz["data"]["attempts"] = []
            
        quiz["data"]["attempts"].append(new_attempt)
        
        # Update the quiz in Cosmos DB
        container.replace_item(
            item=quiz_id,
            body=quiz
        )
        
        return {
            "quizId": quiz_id,
            "attemptId": attempt_id,
            "message": "Quiz attempt saved successfully"
        }
        
    except HTTPException as http_e:
        # Re-raise HTTP exceptions
        raise http_e
    except Exception as e:
        print(f"Error saving quiz attempt: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to save quiz attempt: {str(e)}"
        )

# Get all quizzes for a user - protected
@app.get("/quizzes")
async def get_quizzes(user_claims: dict = Depends(validate_token)):
    try:
        # Query parameters for Cosmos DB
        query = "SELECT * FROM c WHERE c.userId = @userId AND c.contentType = 'quiz' ORDER BY c.createdAt DESC"
        parameters = [{"name": "@userId", "value": user_claims["sub"]}]
        
        # Query Cosmos DB
        items = list(container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=True
        ))
        return items
    except Exception as e:
        print(f"Error fetching quizzes: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to fetch quizzes: {str(e)}"
        )

# Get a specific quiz by ID - protected
@app.get("/quizzes/{quiz_id}")
async def get_quiz(quiz_id: str, user_claims: dict = Depends(validate_token)):
    try:
        # Get the quiz from Cosmos DB (using partition key)
        quiz = container.read_item(
            item=quiz_id, 
            partition_key=user_claims["sub"]
        )
        
        # Verify the quiz belongs to the user
        if quiz["userId"] != user_claims["sub"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Access denied"
            )
            
        return quiz
    except Exception as e:
        print(f"Error fetching quiz: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Quiz not found"
        )

# Get quiz with attempt history endpoint - protected
@app.get("/quizzes/{quiz_id}/with-history")
async def get_quiz_with_history(quiz_id: str, user_claims: dict = Depends(validate_token)):
    try:
        # Get the quiz from Cosmos DB
        quiz = container.read_item(
            item=quiz_id, 
            partition_key=user_claims["sub"]
        )
        
        # Verify the quiz belongs to the user
        if quiz["userId"] != user_claims["sub"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Access denied"
            )
            
        return quiz
    except Exception as e:
        print(f"Error fetching quiz with history: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Quiz not found"
        )

# PDF upload and flashcard generation endpoint - protected
@app.post("/generate-flashcards")
async def create_flashcards(
    file: UploadFile = File(...), 
    num_cards: Optional[int] = Form(20),
    focus_topics: Optional[str] = Form(""),
    user_claims: dict = Depends(validate_token)
):
    try:
        # Save the uploaded file temporarily
        file_path = f"./temp_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        # Extract text from the PDF
        text = extract_text_from_pdf(file_path)
        
        # Validate inputs
        if num_cards < 10:
            num_cards = 10
        elif num_cards > 50:
            num_cards = 50
            
        # Generate flashcards using Azure OpenAI
        flashcards_json = generate_flashcards(
            text=text,
            num_cards=num_cards,
            focus_topics=focus_topics.strip()
        )
        
        # Clean up the temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
        
        flashcard_data = json.loads(flashcards_json)
        
        # Automatically save the flashcards
        flashcard_document = {
            "id": str(uuid.uuid4()),
            "userId": user_claims["sub"],
            "contentType": "flashcards",
            "createdAt": datetime.utcnow().isoformat(),
            "data": {
                "title": flashcard_data["title"],
                "cards": flashcard_data["cards"],
                "resourceName": file.filename,
                "options": {
                    "numCards": num_cards,
                    "selectedTopics": focus_topics.split(",") if focus_topics else [],
                    "customTopics": focus_topics
                }
            }
        }
        
        # Save to Cosmos DB
        container.create_item(body=flashcard_document)
        
        # Return the flashcard data with the ID
        flashcard_data["id"] = flashcard_document["id"]
        return flashcard_data
    except Exception as e:
        print(f"Error generating flashcards: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate flashcards: {str(e)}"
        )

# Save flashcards endpoint - protected 
@app.post("/save-flashcards", response_model=SavedQuizResponse)
async def save_flashcards(flashcards: FlashcardDocument, user_claims: dict = Depends(validate_token)):
    try:
        # Prepare document for Cosmos DB
        document = {
            "id": str(uuid.uuid4()),
            "userId": user_claims["sub"],  
            "contentType": flashcards.contentType,
            "createdAt": datetime.utcnow().isoformat(),
            "data": flashcards.data.dict()  
        }
        
        # Save to Cosmos DB
        container.create_item(body=document)
        return {"id": document["id"], "message": "Flashcards saved successfully"}
    except Exception as e:
        print(f"Error saving flashcards: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to save flashcards: {str(e)}"
        )

# Get saved flashcards endpoint - protected
@app.get("/saved-flashcards")
async def get_saved_flashcards(user_claims: dict = Depends(validate_token)):
    try:
        # Query Cosmos DB for flashcards
        query = f"""
        SELECT * FROM c 
        WHERE c.userId = @userId 
        AND c.contentType = 'flashcards'
        ORDER BY c.createdAt DESC
        """
        
        parameters = [{"name": "@userId", "value": user_claims["sub"]}]
        
        results = list(container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=True
        ))
        
        return results
    except Exception as e:
        print(f"Error fetching saved flashcards: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch saved flashcards: {str(e)}"
        )

# Health check endpoint - public
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# For development purposes
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 