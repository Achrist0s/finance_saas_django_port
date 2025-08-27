
from django.urls import path
from . import views

app_name = 'finance'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('transactions/', views.transactions, name='transactions'),
    path('categories/', views.categories, name='categories'),
    path('budgets/', views.budgets, name='budgets'),
    path('analytics/', views.analytics, name='analytics'),
    path('settings/', views.settings, name='settings'),
    # API endpoints for AJAX operations
    path('api/transactions/add/', views.add_transaction, name='add_transaction'),
    path('api/categories/add/', views.add_category, name='add_category'),
    path('api/budgets/add/', views.add_budget, name='add_budget'),
]
