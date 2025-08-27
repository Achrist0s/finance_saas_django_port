
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=64)
    color = models.CharField(max_length=16, default='#3b82f6')  # Tailwind-ish default
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')

    def __str__(self):
        return self.name

class Budget(models.Model):
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='budgets')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.DateField(help_text='Use first day of month')

    class Meta:
        unique_together = ('category', 'month')

    def __str__(self):
        return f"{self.category.name} — {self.month:%Y-%m}"

class Transaction(models.Model):
    TYPE_CHOICES = [('income', 'Income'), ('expense', 'Expense')]
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=255, blank=True)
    date = models.DateField()
    type = models.CharField(max_length=7, choices=TYPE_CHOICES, default='expense')

    class Meta:
        ordering = ['-date', '-id']

    def __str__(self):
        return f"{self.type}: {self.amount} on {self.date:%Y-%m-%d}"
