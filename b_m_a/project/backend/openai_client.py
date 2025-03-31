import os
from dotenv import load_dotenv
from openai import AzureOpenAI
from typing import List, Optional

load_dotenv()

# Create the Azure OpenAI client
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_QUIZ_GENERATOR_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_QUIZ_GENERATOR_API_KEY"),
    api_version="2024-05-01-preview"
)

DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_QUIZ_GENERATOR_DEPLOYMENT_NAME")

def generate_quiz(
    text: str, 
    num_questions: int = 10, 
    focus_topics: str = "", 
    question_formats: List[str] = ["multiple_choice", "multi_select", "drag_and_drop"]
):
    # Format the question types instruction based on selected formats
    question_types_instruction = ""
    
    if "multiple_choice" in question_formats:
        question_types_instruction += "\n  - **Multiple-choice (single correct answer).**"
    
    if "multi_select" in question_formats:
        question_types_instruction += "\n  - **Multi-select (more than one correct answer).**"
    
    if "drag_and_drop" in question_formats:
        question_types_instruction += "\n  - **Drag-and-drop** (e.g., matching terms to definitions, ordering events, categorizing items)."
    
    if "short_answer" in question_formats:
        question_types_instruction += "\n  - **Short-answer** (brief text responses to specific questions)."
    
    if "fill_in_blank" in question_formats:
        question_types_instruction += "\n  - **Fill-in-the-blank** (sentences with missing words to be completed)."
    
    # Add focus topics instruction if provided
    focus_instruction = ""
    if focus_topics:
        focus_instruction = f"\n\n# Focus Areas:\nPay special attention to these topics: {focus_topics}"
    
    # Create the system prompt with customized instructions
    system_prompt = f"""You are an AI quiz generator that creates quizzes based on input text containing a specific topic. The quiz will consist of {num_questions} questions using the following question types: {', '.join(question_formats)}. The output should be a structured JSON object.{focus_instruction}

---

# Steps:
- Analyze the input text to extract key pieces of knowledge, concepts, or important details.
- Generate a variety of question types based on the extracted information:{question_types_instruction}
- Ensure questions are clear, relevant to the input text, and appropriately varied in difficulty.
- Generate exactly {num_questions} questions, balancing the different question types proportionally.
- Provide correct answers and explanation details (if relevant) for all question types.

---

# Output Format:

Return a JSON object structured as follows:

{{
  "quiz_title": "[Generated Quiz Title Based on the Topic]",
  "questions": ["""

    # Add example formats for each selected question type
    if "multiple_choice" in question_formats:
        system_prompt += """
    {
      "type": "multiple_choice",
      "question": "[Insert multiple-choice question here]",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": "Option X"
    },"""
    
    if "multi_select" in question_formats:
        system_prompt += """
    {
      "type": "multi_select",
      "question": "[Insert multi-select question here]",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answers": ["Option X", "Option Y"]
    },"""
    
    if "drag_and_drop" in question_formats:
        system_prompt += """
    {
      "type": "drag_and_drop",
      "question": "[Insert drag-and-drop question here]",
      "prompts": ["Prompt 1", "Prompt 2", "Prompt 3"],
      "targets": ["Target 1", "Target 2", "Target 3"],
      "correct_mapping": {
        "Prompt 1": "Target X",
        "Prompt 2": "Target Y",
        "Prompt 3": "Target Z"
      }
    },"""
    
    if "short_answer" in question_formats:
        system_prompt += """
    {
      "type": "short_answer",
      "question": "[Insert short-answer question here]",
      "correct_answer": "The expected correct answer",
      "acceptable_answers": ["Alternative 1", "Alternative 2"]
    },"""
    
    if "fill_in_blank" in question_formats:
        system_prompt += """
    {
      "type": "fill_in_blank",
      "question": "This is a sentence with a [BLANK] to be filled in.",
      "correct_answer": "word",
      "acceptable_answers": ["term", "phrase"]
    },"""
    
    # Remove the trailing comma and close the JSON structure
    system_prompt = system_prompt.rstrip(",") + """
  ]
}

### Field Explanation:
- **quiz_title**: A concise, topic-relevant title for the quiz, inferred from the provided text.  
- **type**: Denotes the question type ("multiple_choice", "multi_select", "drag_and_drop", "short_answer", "fill_in_blank").  
- **question**: The main question or task.  
- **options**: For multiple-choice and multi-select questions, a list of answer options.  
- **correct_answer**: The correct choice for "multiple_choice" questions (a single string).  
- **correct_answers**: A list of all correct answers for "multi_select".  
- **prompts**: In drag-and-drop, the items the user will drag.  
- **targets**: In drag-and-drop, the drop zones or categories where items belong.  
- **correct_mapping**: A dictionary showing the correct drag-and-drop pairings.  
- **acceptable_answers**: For "short_answer" and "fill_in_blank", a list of alternative correct answers.

---

# Notes:
- Focus on generating questions that reflect critical concepts from the given text.
- Ensure clarity and correctness in both questions and answers.
- Proportionately balance the mix of question types across the quiz.
- Avoid ambiguity in "correct_answer" or "correct_answers" fields by making answers explicit. 

This structured format will maintain consistency and ensure the generated quizzes are high-quality and easily parsable."""

    response = client.chat.completions.create(
        model=DEPLOYMENT_NAME,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Generate a quiz from the following text:\n\n{text}"}
        ],
        response_format={"type": "json_object"}
    )
    return response.choices[0].message.content

def generate_flashcards(
    text: str,
    num_cards: int = 20,
    focus_topics: str = ""
):
    # Add focus topics instruction if provided
    focus_instruction = ""
    if focus_topics:
        focus_instruction = f"\n\n# Focus Areas:\nPay special attention to these topics: {focus_topics}"
    
    # Create the system prompt
    system_prompt = f"""You are an AI flashcard generator that creates flashcards based on input text containing a specific topic. The output will consist of {num_cards} flashcards. The output should be a structured JSON object.{focus_instruction}

---

# Steps:
- Analyze the input text to extract key concepts, definitions, and important details
- Generate clear, concise flashcards that cover the main points
- Ensure questions are focused and answers are accurate and comprehensive
- Generate exactly {num_cards} flashcards
- Vary the difficulty and complexity of the cards

---

# Output Format:

Return a JSON object structured as follows:

{{
  "title": "[Generated Title Based on the Topic]",
  "cards": [
    {{
      "question": "[Clear, concise question]",
      "answer": "[Comprehensive answer with key details]"
    }},
    // ... more cards ...
  ]
}}

### Field Explanation:
- **title**: A concise, topic-relevant title for the flashcard set
- **question**: A clear, focused question that tests understanding
- **answer**: A comprehensive answer that includes key details and explanations

---

# Notes:
- Focus on generating cards that reflect critical concepts from the given text
- Ensure clarity and correctness in both questions and answers
- Make questions specific and focused
- Provide detailed answers that explain the concept thoroughly
- Avoid ambiguity in both questions and answers

This structured format will maintain consistency and ensure the generated flashcards are high-quality and effective for learning."""

    response = client.chat.completions.create(
        model=DEPLOYMENT_NAME,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Generate flashcards from the following text:\n\n{text}"}
        ],
        response_format={"type": "json_object"}
    )
    return response.choices[0].message.content

