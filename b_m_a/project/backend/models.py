from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from datetime import datetime

class QuizOptions(BaseModel):
    numQuestions: int
    selectedTopics: List[str]
    customTopics: str
    questionFormats: Dict[str, bool]

class QuizAttempt(BaseModel):
    attemptId: str
    timestamp: str
    score: float
    timeTaken: int
    userAnswers: List[Any]
    mode: str  

class QuizData(BaseModel):
    title: str
    questions: List[Dict[str, Any]]
    userAnswers: Optional[List[Any]] = None
    score: Optional[float] = None
    timeTaken: Optional[int] = None
    resourceName: str
    options: QuizOptions
    attempts: Optional[List[QuizAttempt]] = []
    originalQuizId: Optional[str] = None  
    
class QuizDocument(BaseModel):
    contentType: str
    data: QuizData

class SavedQuizResponse(BaseModel):
    id: str
    message: str

class SaveQuizAttemptRequest(BaseModel):
    quizId: str
    score: float
    timeTaken: int
    userAnswers: List[Any]
    mode: str

class SaveQuizAttemptResponse(BaseModel):
    quizId: str
    attemptId: str
    message: str

class FlashcardData(BaseModel):
    title: str
    cards: List[Dict[str, str]]
    resourceName: str
    options: Dict[str, Any]

class FlashcardDocument(BaseModel):
    contentType: str
    data: FlashcardData
