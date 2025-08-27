
from django.contrib import admin
from .models import Category, Budget, Transaction

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'color', 'owner')
    list_filter = ('owner',)

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'amount', 'month')
    list_filter = ('category', 'month')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner', 'type', 'amount', 'category', 'date', 'description')
    list_filter = ('owner', 'type', 'category', 'date')
    search_fields = ('description',)
