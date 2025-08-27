
# Finance SaaS (Django port)

This project ports the uploaded React frontend into a Django app that uses Django Templates and Tailwind CDN.

## Quickstart

```bash
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # optional
python manage.py runserver
```

Open http://127.0.0.1:8000 to view the UI.
Use /admin for data entry if desired.
