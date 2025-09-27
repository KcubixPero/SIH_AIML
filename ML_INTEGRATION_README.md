# ML Model Integration Guide

This guide explains how to connect your ML model in the backend to the frontend for internship recommendations.

## Architecture Overview

```
Frontend (Next.js) ←→ Backend API (Django) ←→ ML Models (TF-IDF + ANN)
```

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Django API Server

```bash
# Option 1: Using the startup script (recommended)
python start_django_server.py

# Option 2: Manual Django commands
python manage.py migrate
python manage.py load_models
python manage.py runserver 0.0.0.0:5000
```

The API server will start on `http://localhost:5000`

### 3. Django Management Commands

```bash
# Load ML models and data
python manage.py load_models

# Run database migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 4. API Endpoints

- `GET /api/health/` - Health check
- `GET /api/skills/` - Get available skills
- `GET /api/locations/` - Get available locations  
- `POST /api/recommendations/` - Get internship recommendations

### 5. API Usage Example

```bash
# Get recommendations
curl -X POST http://localhost:5000/api/recommendations/ \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["python", "machine learning", "data analysis"],
    "locations": ["remote", "delhi"],
    "interests": ["data science"],
    "model_type": "tfidf",
    "top_k": 5
  }'
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## How It Works

### 1. Data Flow

1. **User Input**: User selects skills, location, and duration in the Filter component
2. **API Request**: Frontend sends POST request to `/api/recommendations`
3. **ML Processing**: Backend processes data using either TF-IDF or ANN model
4. **Response**: Backend returns ranked internship recommendations
5. **Display**: Frontend displays recommendations with match scores and missing skills

### 2. ML Models

#### TF-IDF Model
- Uses cosine similarity between user skills and job requirements
- Provides similarity scores and identifies matched/missing skills
- Faster and more interpretable

#### ANN Model  
- Uses PyTorch neural network with embeddings
- Considers skills, location, and role keywords
- More sophisticated but requires more data

### 3. Recommendation Features

- **Match Score**: Percentage similarity between user and job requirements
- **Matched Skills**: Skills the user already has
- **Missing Skills**: Skills the user needs to learn
- **Company Info**: Company name, location, stipend, duration
- **Model Selection**: Choose between TF-IDF and ANN models

## File Structure

```
backend/
├── manage.py              # Django management script
├── start_django_server.py # Django server startup script
├── requirements.txt       # Python dependencies
├── ml_api/               # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── recommendations/      # Django app
│   ├── views.py         # API views
│   ├── urls.py          # URL routing
│   └── management/commands/load_models.py
├── internship_data.csv    # Main dataset
├── k3_ohe_all_skills.csv # TF-IDF processed data
└── sih.ipynb            # Original ML model code

frontend/
├── src/
│   ├── app/internships/page.tsx    # Main page
│   └── components/
│       ├── Filter.tsx              # User input form
│       ├── Internships.tsx         # Results display
│       ├── JobCard.tsx             # Individual job card
│       └── ui/badge.tsx            # UI components
```

## Troubleshooting

### Backend Issues

1. **Port 5000 already in use**:
   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   ```

2. **Missing data files**:
   - Ensure `internship_data.csv` and `k3_ohe_all_skills.csv` are in the backend directory

3. **Python dependencies**:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Django migration issues**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Model loading issues**:
   ```bash
   python manage.py load_models
   ```

### Frontend Issues

1. **CORS errors**:
   - Ensure backend is running on port 5000
   - Check that django-cors-headers is installed and configured

2. **API connection failed**:
   - Verify backend server is running
   - Check browser console for network errors

## Development Tips

1. **Model Training**: The ANN model can be retrained by running the Jupyter notebook and saving weights
2. **Adding Skills**: Update the skills list in the Filter component or load from API
3. **Styling**: Modify the JobCard component to change recommendation display
4. **Performance**: TF-IDF is faster for real-time recommendations, ANN is better for accuracy

## Next Steps

1. **Model Improvement**: Train ANN model with more data and save weights
2. **User Profiles**: Add user authentication and profile management
3. **Advanced Filtering**: Add more filter options (salary, company size, etc.)
4. **Analytics**: Track recommendation clicks and user preferences
5. **Deployment**: Deploy to cloud platforms (Heroku, AWS, etc.)
