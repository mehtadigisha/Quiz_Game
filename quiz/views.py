from django.shortcuts import render, redirect
from .models import Question, UserAnswer
import random

# Start a new quiz session
def start_quiz(request):
    # Clear previous answers
    UserAnswer.objects.all().delete()
    return redirect('get_random_question')

# Fetch a random question that has not been answered yet
def get_random_question(request):
    # Get IDs of already answered questions
    answered_ids = UserAnswer.objects.values_list('question_id', flat=True)
    # Exclude those questions to avoid repetition
    questions = Question.objects.exclude(id__in=answered_ids)

    # If no questions are left, redirect to the summary page
    if not questions.exists():
        return redirect('quiz_summary')

    # Select a random question
    question = random.choice(questions)
    return render(request, 'question.html', {'question': question})

# Submit the user's answer
def submit_answer(request):
    if request.method == 'POST':
        # Get the submitted data
        question_id = request.POST.get('question_id')
        selected_option = request.POST.get('selected_option').strip().upper()  # Normalize input
        question = Question.objects.get(id=question_id)
        correct_option = question.correct_option.strip().upper()  # Normalize correct option

        # Compare selected option with the correct option
        is_correct = selected_option == correct_option

        # Log debug info (for testing)
        print(f"Selected Option: {selected_option}, Correct Option: {correct_option}")

        # Save the user's answer
        UserAnswer.objects.create(
            question=question,
            selected_option=selected_option,
            is_correct=is_correct
        )

        # Redirect to the next random question
        return redirect('get_random_question')

# Display the quiz summary
def quiz_summary(request):
    # Get all answers for the current session
    answers = UserAnswer.objects.all()
    total = answers.count()  # Total questions answered
    correct = answers.filter(is_correct=True).count()  # Correct answers
    incorrect = answers.filter(is_correct=False).count()  # Incorrect answers

    # Enhance answers with correct option text
    for answer in answers:
        correct_option_text = getattr(answer.question, f"option_{answer.question.correct_option.lower()}")
        answer.correct_option_text = correct_option_text

    return render(request, 'summary.html', {
        'total': total,
        'correct': correct,
        'incorrect': incorrect,
        'answers': answers
    })
