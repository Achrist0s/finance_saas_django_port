
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.db.models import Sum, Case, When, F, Value, DecimalField
from datetime import date
from .models import Transaction, Category, Budget
from .forms import TransactionForm, CategoryForm, BudgetForm

def _ensure_user(request):
    # For demo: ensure an anonymous session can try the UI
    # In production, protect routes with @login_required and use real users.
    if request.user.is_authenticated:
        return request.user
    return None

def dashboard(request):
    user = _ensure_user(request)
    tx_qs = Transaction.objects.all() if user is None else Transaction.objects.filter(owner=user)
    budgets = Budget.objects.all() if user is None else Budget.objects.filter(category__owner=user)
    income = tx_qs.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0
    expenses = tx_qs.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0
    balance = income - expenses
    monthly = tx_qs.values('date__year','date__month','type').annotate(total=Sum('amount')).order_by('date__year','date__month')
    recent = tx_qs.select_related('category').order_by('-date')[:8]
    return render(request, 'finance/dashboard.html', {
        'income': income, 'expenses': expenses, 'balance': balance,
        'monthly': monthly, 'recent': recent, 'budgets': budgets,
    })

def transactions(request):
    user = _ensure_user(request)
    tx_qs = Transaction.objects.all() if user is None else Transaction.objects.filter(owner=user)
    form = TransactionForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        tx = form.save(commit=False)
        if user is not None:
            tx.owner = user
        else:
            # demo owner-less (would fail if null disallowed)
            from django.contrib.auth import get_user_model
            tx.owner = get_user_model().objects.first() or None
        tx.save()
        return redirect('finance:transactions')
    return render(request, 'finance/transactions.html', {'transactions': tx_qs, 'form': form})

def categories(request):
    user = _ensure_user(request)
    qs = Category.objects.all() if user is None else Category.objects.filter(owner=user)
    form = CategoryForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        cat = form.save(commit=False)
        if user is not None:
            cat.owner = user
        else:
            from django.contrib.auth import get_user_model
            cat.owner = get_user_model().objects.first() or None
        cat.save()
        return redirect('finance:categories')
    return render(request, 'finance/categories.html', {'categories': qs, 'form': form})

def budgets(request):
    user = _ensure_user(request)
    qs = Budget.objects.all() if user is None else Budget.objects.filter(category__owner=user)
    form = BudgetForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        form.save()
        return redirect('finance:budgets')
    return render(request, 'finance/budgets.html', {'budgets': qs, 'form': form})

def analytics(request):
    user = _ensure_user(request)
    tx_qs = Transaction.objects.all() if user is None else Transaction.objects.filter(owner=user)
    by_category = tx_qs.values('category__name').annotate(
        income=Sum(Case(When(type='income', then=F('amount')), default=Value(0), output_field=DecimalField())),
        expense=Sum(Case(When(type='expense', then=F('amount')), default=Value(0), output_field=DecimalField()))
    ).order_by('category__name')
    return render(request, 'finance/analytics.html', {'by_category': by_category})

def settings_view(request):
    return render(request, 'finance/settings.html')
