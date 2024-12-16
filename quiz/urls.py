from django.urls import path
from . import views

urlpatterns = [
    # path('home/',views.home,name="home"),
    path('start/', views.start_quiz, name='start_quiz'),
    path('question/', views.get_random_question, name='get_random_question'),
    path('submit/', views.submit_answer, name='submit_answer'),
    path('summary/', views.quiz_summary, name='quiz_summary'),
]
