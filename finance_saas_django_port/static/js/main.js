// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize sidebar toggle
    initializeSidebar();

    // Initialize modals
    initializeModals();

    // Initialize form handlers
    initializeForms();

    // Initialize charts if on dashboard
    if (window.location.pathname.includes('dashboard')) {
        initializeCharts();
    }
}

function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    // Load sidebar state from localStorage
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar?.classList.add('collapsed');
        mainContent?.classList.add('collapsed');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (sidebar && mainContent) {
        const isCollapsed = sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('collapsed');

        // Save state to localStorage
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }
}

function initializeModals() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="flex"]');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Focus first input
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

function initializeForms() {
    // Transaction type buttons
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            typeButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Update hidden input if exists
            const typeInput = document.getElementById('transactionType');
            if (typeInput) {
                typeInput.value = this.dataset.type;
            }
        });
    });

    // Color selection for categories
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            colorOptions.forEach(o => o.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');

            // Update hidden input if exists
            const colorInput = document.getElementById('categoryColor');
            if (colorInput) {
                colorInput.value = this.dataset.color;
            }
        });
    });

    // Set current date for date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = new Date().toISOString().split('T')[0];
        }
    });

    // Set current month for month inputs
    const monthInputs = document.querySelectorAll('input[type="month"]');
    monthInputs.forEach(input => {
        if (!input.value) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            input.value = `${year}-${month}`;
        }
    });
}

function initializeCharts() {
    // Simple chart rendering for dashboard
    renderFinancialChart();
}

function renderFinancialChart() {
    const chartContainer = document.getElementById('financialChart');
    if (!chartContainer) return;

    // Sample data - replace with actual data from Django context
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const incomeData = [2500, 2800, 2600, 3000, 2900, 3200];
    const expenseData = [1800, 2100, 1900, 2200, 2000, 2300];
    const maxValue = Math.max(...incomeData, ...expenseData);

    chartContainer.innerHTML = '';

    months.forEach((month, index) => {
        const barContainer = document.createElement('div');
        barContainer.className = 'chart-bar';

        const incomeHeight = (incomeData[index] / maxValue) * 100;
        const expenseHeight = (expenseData[index] / maxValue) * 100;

        barContainer.innerHTML = `
            <div class="chart-bar-income" style="height: ${incomeHeight}%"></div>
            <div class="chart-bar-expense" style="height: ${expenseHeight}%"></div>
        `;

        const labelContainer = document.createElement('div');
        labelContainer.className = 'chart-label';
        labelContainer.textContent = month;

        const monthContainer = document.createElement('div');
        monthContainer.style.flex = '1';
        monthContainer.style.display = 'flex';
        monthContainer.style.flexDirection = 'column';
        monthContainer.style.alignItems = 'center';
        monthContainer.appendChild(barContainer);
        monthContainer.appendChild(labelContainer);

        chartContainer.appendChild(monthContainer);
    });
}

// Transaction modal specific functions
function openTransactionModal(type = 'expense') {
    // Set the transaction type
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        }
    });

    const typeInput = document.getElementById('transactionType');
    if (typeInput) {
        typeInput.value = type;
    }

    openModal('transactionModal');
}

// Filter functions for transactions page
function filterTransactions() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const typeFilter = document.getElementById('typeFilter');
    const tableBody = document.getElementById('transactionsTableBody');

    if (!tableBody) return;

    const searchTerm = searchInput?.value.toLowerCase() || '';
    const categoryValue = categoryFilter?.value || '';
    const typeValue = typeFilter?.value || '';

    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const description = row.querySelector('.transaction-description span')?.textContent.toLowerCase() || '';
        const category = row.dataset.category || '';
        const type = row.dataset.type || '';

        const matchesSearch = description.includes(searchTerm);
        const matchesCategory = !categoryValue || category === categoryValue;
        const matchesType = !typeValue || type === typeValue;

        if (matchesSearch && matchesCategory && matchesType) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

// Export functions for global use
window.toggleSidebar = toggleSidebar;
window.openModal = openModal;
window.closeModal = closeModal;
window.openTransactionModal = openTransactionModal;
window.filterTransactions = filterTransactions;