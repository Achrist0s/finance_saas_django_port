
from django.urls import path
from . import views

app_name = 'finance'

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('transactions/', views.transactions, name='transactions'),
    path('categories/', views.categories, name='categories'),
    path('budgets/', views.budgets, name='budgets'),
    path('analytics/', views.analytics, name='analytics'),
    path('settings/', views.settings_view, name='settings'),
]
