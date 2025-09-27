# ML-Powered Internship Recommendation API

A Django REST API that provides AI-powered internship recommendations using both TF-IDF and Artificial Neural Network (ANN) models.

## Features

- **Dual ML Models**: TF-IDF similarity and PyTorch-based ANN
- **RESTful API**: Clean JSON endpoints for frontend integration
- **Skill Matching**: Intelligent skill matching with similarity scores
- **Location Filtering**: Support for location-based recommendations
- **Real-time Recommendations**: Fast inference for user queries

## API Endpoints

### Health Check
```
GET /api/health/
```
Returns API status and health information.

### Get Available Skills
```
GET /api/skills/
```
Returns a list of all available skills from the dataset.

### Get Available Locations
```
GET /api/locations/
```
Returns a list of all available locations from the dataset.

### Get Recommendations
```
POST /api/recommendations/
```

**Request Body:**
```json
{
  "skills": ["python", "machine learning", "data analysis"],
  "locations": ["remote", "delhi"],
  "interests": ["data science"],
  "model_type": "tfidf",  // or "ann"
  "top_k": 5
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "job_title": "Data Science Intern",
      "similarity_score": 85.5,
      "matched_skills": ["python", "machine learning"],
      "missing_skills": ["sql", "statistics"]
    }
  ],
  "model_type": "tfidf",
  "total_found": 5
}
```

## Installation

### Prerequisites
- Python 3.8+
- pip

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Load ML models**
   ```bash
   python manage.py load_models
   ```

6. **Start the server**
   ```bash
   python manage.py runserver 0.0.0.0:5000
   ```

## Quick Start

Use the provided startup script:
```bash
python start_django_server.py
```

This script will:
- Install dependencies
- Run migrations
- Load ML models
- Start the development server

## Data Files

The following data files are required:

- `internship_data.csv` - Main internship dataset
- `k3_ohe_all_skills.csv` - Processed skills data for TF-IDF
- `skills_columns.csv` - Skills column definitions

## ML Models

### TF-IDF Model
- Uses cosine similarity between user skills and job requirements
- Provides similarity scores (0-100%)
- Identifies matched and missing skills
- Fast and interpretable

### ANN Model
- PyTorch-based neural network with embeddings
- Considers skills, locations, and role keywords
- Provides confidence scores (0-1)
- More sophisticated but requires more computational resources

## Development

### Project Structure
```
backend/
├── manage.py                 # Django management script
├── start_django_server.py    # Startup script
├── requirements.txt          # Python dependencies
├── ml_api/                   # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── recommendations/          # Django app
│   ├── views.py             # API views
│   ├── urls.py              # URL routing
│   └── management/commands/ # Custom commands
└── data/                    # ML data files
```

### Custom Management Commands

```bash
# Load ML models and data
python manage.py load_models

# Create superuser
python manage.py createsuperuser
```

### Environment Variables

Create a `.env` file for environment-specific settings:
```
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
```

## API Usage Examples

### Python
```python
import requests

# Get recommendations
response = requests.post('http://localhost:5000/api/recommendations/', json={
    'skills': ['python', 'machine learning'],
    'model_type': 'tfidf',
    'top_k': 5
})

recommendations = response.json()
```

### JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:5000/api/recommendations/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    skills: ['python', 'machine learning'],
    model_type: 'tfidf',
    top_k: 5
  })
});

const recommendations = await response.json();
```

### cURL
```bash
curl -X POST http://localhost:5000/api/recommendations/ \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["python", "machine learning"],
    "model_type": "tfidf",
    "top_k": 5
  }'
```

## Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   ```bash
   lsof -ti:5000 | xargs kill -9
   ```

2. **Missing data files**
   - Ensure all CSV files are in the backend directory
   - Check file permissions

3. **Model loading errors**
   ```bash
   python manage.py load_models
   ```

4. **CORS errors**
   - Ensure django-cors-headers is installed
   - Check CORS settings in settings.py

### Logs

Check Django logs for detailed error information:
```bash
python manage.py runserver --verbosity=2
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Django logs
3. Create an issue in the repository
