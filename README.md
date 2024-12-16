# Quiz Game - Django Application

A fun and interactive quiz game built with Django. This application allows users to answer randomly selected questions, tracks their performance, and provides a detailed summary at the end of the quiz, including the correct answers for any incorrectly answered questions.

## Features
- Random question selection.
- Tracks user answers and evaluates correctness.
- Displays a summary of the quiz, including:
  - Total questions attempted.
  - Number of incorrect answers.
  - User's selected answers.
  - Correct answers for incorrect responses.
- Restart the quiz with a single click.

## Demo Screenshot
![Quiz Summary Screenshot]![quiz1](https://github.com/user-attachments/assets/1834da4e-f93a-4798-8d0d-1dfa622a9b33)
![quiz2](https://github.com/user-attachments/assets/047df151-6805-4f07-8f3c-e31a2bc16de2)


## Tech Stack
- **Backend**: Django Framework (Python)
- **Frontend**: HTML, CSS (Bootstrap for styling)

## Prerequisites
Ensure you have the following installed on your system:
- Python 3.8 or later
- pip (Python package manager)
- Virtualenv (optional but recommended)

## Installation and Setup

Follow these steps to set up the project on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/quiz-game-django.git
cd quiz-game-django
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Apply Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Add Questions to the Database

### 5. Run the Server
```bash
python manage.py runserver
```

### 6. Access the Application
```bash
http://127.0.0.1:8000/
```
