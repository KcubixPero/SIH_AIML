from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import ast
import random
import os
from typing import List, Dict, Any

# Global variables to store loaded models and data
df = None
vectorizer = None
tfidf_matrix = None
model = None
skill_to_idx = None
location_to_idx = None
role_to_idx = None

# PyTorch ANN Model Definition
class RecommendationANN(nn.Module):
    def __init__(self, num_skills, num_locations, num_roles, embedding_dim=16):
        super(RecommendationANN, self).__init__()
        self.skill_embedding = nn.Embedding(num_skills, embedding_dim)
        self.location_embedding = nn.Embedding(num_locations, embedding_dim)
        self.role_embedding = nn.Embedding(num_roles, embedding_dim)
        
        self.fc1 = nn.Linear(embedding_dim * 3, 64)
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, 1)
        self.relu = nn.ReLU()
        self.sigmoid = nn.Sigmoid()

    def forward(self, skill_idx, location_idx, role_idx):
        skill_embed = self.skill_embedding(skill_idx)
        location_embed = self.location_embedding(location_idx)
        role_embed = self.role_embedding(role_idx)
        
        x = torch.cat([skill_embed, location_embed, role_embed], dim=1)
        
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        x = self.sigmoid(self.fc3(x))
        return x.squeeze()

def clean_and_parse_list_string(s):
    """Clean and parse string representations of lists"""
    try:
        parsed_list = ast.literal_eval(s)
        return [str(item).strip().lower() for item in parsed_list]
    except (ValueError, SyntaxError):
        return []

def get_job_skills_text(row, skill_columns):
    """Extract skills text from a job row"""
    skills = []
    for col in skill_columns:
        val = row[col]
        if isinstance(val, str):
            skills_in_cell = [s.strip().lower() for s in val.strip("[]").replace("'", "").split(',') if s.strip()]
            skills.extend(skills_in_cell)
        elif isinstance(val, (int, float)) and val == 1:
            skills.append(col.lower())
    return " ".join(skills)

def load_data_and_models():
    """Load data and initialize models"""
    global df, vectorizer, tfidf_matrix, model, skill_to_idx, location_to_idx, role_to_idx
    
    try:
        # Load internship data
        df = pd.read_csv('internship_data.csv')
        
        # Clean and parse data
        df['Skills'] = df['Skills'].apply(clean_and_parse_list_string)
        df['Location'] = df['Location'].apply(lambda s: [loc.strip().lower() for loc in str(s).strip("(),'").split(',')])
        df['Role_Keywords'] = df['Role'].apply(lambda r: [word.lower() for word in r.split()])
        
        # Create vocabularies and mappings
        all_skills = sorted(list(set(skill for skills_list in df['Skills'] for skill in skills_list)))
        all_locations = sorted(list(set(loc for loc_list in df['Location'] for loc in loc_list)))
        all_role_keywords = sorted(list(set(word for word_list in df['Role_Keywords'] for word in word_list)))
        
        skill_to_idx = {skill: i+1 for i, skill in enumerate(all_skills)}
        location_to_idx = {loc: i+1 for i, loc in enumerate(all_locations)}
        role_to_idx = {word: i+1 for i, word in enumerate(all_role_keywords)}
        
        skill_to_idx['<unk>'] = 0
        location_to_idx['<unk>'] = 0
        role_to_idx['<unk>'] = 0
        
        # Initialize TF-IDF vectorizer for the simpler model
        try:
            # Try to load the processed data for TF-IDF
            tfidf_df = pd.read_csv('k3_ohe_all_skills.csv')
            skill_columns = [col for col in tfidf_df.columns if col not in ['Job Title', 'Skills']]
            tfidf_df['skill_text'] = tfidf_df.apply(lambda row: get_job_skills_text(row, skill_columns), axis=1)
            
            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform(tfidf_df['skill_text'].tolist())
        except FileNotFoundError:
            print("TF-IDF data file not found, using basic skill matching")
            vectorizer = None
            tfidf_matrix = None
        
        # Initialize ANN model
        model = RecommendationANN(
            num_skills=len(skill_to_idx),
            num_locations=len(location_to_idx),
            num_roles=len(role_to_idx)
        )
        
        # Try to load pre-trained model weights
        if os.path.exists('model_weights.pth'):
            model.load_state_dict(torch.load('model_weights.pth', map_location='cpu'))
            print("Loaded pre-trained model weights")
        else:
            print("No pre-trained weights found, model will use random initialization")
        
        model.eval()
        print("Data and models loaded successfully!")
        
    except Exception as e:
        print(f"Error loading data: {e}")
        raise

def get_tfidf_recommendations(candidate_skills: List[str], top_k: int = 5, threshold: float = 0.1) -> List[Dict]:
    """Get recommendations using TF-IDF similarity"""
    if vectorizer is None or tfidf_matrix is None:
        return []
    
    # Skill synonyms for normalization
    skill_synonyms = {
        'ms-excel': ['ms office excel', 'excel'],
        'ms-word': ['ms office word', 'word'],
        'english proficiency (spoken)': ['english speaking', 'english conversation']
    }
    
    def normalize_candidate_skills(skills):
        normalized = []
        for s in skills:
            s_lower = s.lower()
            matched = False
            for key, syns in skill_synonyms.items():
                if s_lower == key or s_lower in syns:
                    normalized.append(key)
                    matched = True
                    break
            if not matched:
                normalized.append(s_lower)
        return normalized
    
    candidate_skills = normalize_candidate_skills(candidate_skills)
    candidate_text = " ".join(candidate_skills)
    candidate_vector = vectorizer.transform([candidate_text])
    cos_sim = cosine_similarity(candidate_vector, tfidf_matrix)[0]
    
    # Load the TF-IDF dataframe for results
    tfidf_df = pd.read_csv('k3_ohe_all_skills.csv')
    
    # Create skill_text column if it doesn't exist
    if 'skill_text' not in tfidf_df.columns:
        skill_columns = [col for col in tfidf_df.columns if col not in ['Job Title', 'Skills']]
        tfidf_df['skill_text'] = tfidf_df.apply(lambda row: get_job_skills_text(row, skill_columns), axis=1)
    
    tfidf_df['similarity'] = cos_sim
    top_df = tfidf_df[tfidf_df['similarity'] >= threshold].sort_values('similarity', ascending=False).head(top_k)
    
    recommendations = []
    for _, row in top_df.iterrows():
        job_skills = set(row['skill_text'].split())
        candidate_set = set(candidate_skills)
        matched = candidate_set.intersection(job_skills)
        missing = job_skills - candidate_set
        recommendations.append({
            'job_title': row['Job Title'],
            'similarity_score': round(row['similarity']*100, 2),
            'matched_skills': list(matched),
            'missing_skills': list(missing)
        })
    
    return recommendations

def get_ann_recommendations(candidate_profile: Dict[str, List[str]], top_n: int = 5) -> List[Dict]:
    """Get recommendations using ANN model"""
    if model is None:
        return []
    
    model.eval()
    scores = []
    
    candidate_skill_idx = torch.tensor([skill_to_idx.get(s.lower(), 0) for s in candidate_profile['skills']], dtype=torch.long)
    candidate_loc_idx = torch.tensor([location_to_idx.get(l.lower(), 0) for l in candidate_profile['locations']], dtype=torch.long)
    candidate_interest_idx = torch.tensor([role_to_idx.get(i.lower(), 0) for i in candidate_profile['interests']], dtype=torch.long)
    
    with torch.no_grad():
        for idx, internship in df.iterrows():
            total_score = 0
            count = 0
            
            internship_skills = torch.tensor([skill_to_idx.get(s, 0) for s in internship['Skills']], dtype=torch.long)
            for s_idx in candidate_skill_idx:
                for i_s_idx in internship_skills:
                    score = model(s_idx.unsqueeze(0), candidate_loc_idx[0].unsqueeze(0), candidate_interest_idx[0].unsqueeze(0))
                    total_score += score.item()
                    count += 1
            
            scores.append((total_score / (count if count > 0 else 1), idx))
    
    sorted_scores = sorted(scores, key=lambda x: x[0], reverse=True)
    top_indices = [index for score, index in sorted_scores[:top_n]]
    
    recommendations = []
    for idx in top_indices:
        row = df.loc[idx]
        location_text = ", ".join(row['Location']).title()
        recommendations.append({
            'role': row['Role'],
            'company': row['Company Name'],
            'location': location_text,
            'stipend': row['Stipend'],
            'duration': row['Duration'],
            'skills': row['Skills'],
            'score': sorted_scores[top_indices.index(idx)][0]
        })
    
    return recommendations

# Initialize models when the module is imported
try:
    load_data_and_models()
except Exception as e:
    print(f"Warning: Could not load ML models: {e}")

@require_http_methods(["GET"])
def health_check(request):
    """Health check endpoint"""
    return JsonResponse({'status': 'healthy', 'message': 'ML API is running'})

@csrf_exempt
@require_http_methods(["POST"])
def get_recommendations(request):
    """Get internship recommendations based on user profile"""
    try:
        data = json.loads(request.body)
        
        if not data:
            return JsonResponse({'error': 'No data provided'}, status=400)
        
        skills = data.get('skills', [])
        locations = data.get('locations', [])
        interests = data.get('interests', [])
        model_type = data.get('model_type', 'tfidf')  # 'tfidf' or 'ann'
        top_k = data.get('top_k', 5)
        
        if not skills:
            return JsonResponse({'error': 'Skills are required'}, status=400)
        
        recommendations = []
        
        if model_type == 'ann':
            candidate_profile = {
                'skills': skills,
                'locations': locations,
                'interests': interests
            }
            recommendations = get_ann_recommendations(candidate_profile, top_k)
        else:
            recommendations = get_tfidf_recommendations(skills, top_k)
        
        return JsonResponse({
            'recommendations': recommendations,
            'model_type': model_type,
            'total_found': len(recommendations)
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def get_available_skills(request):
    """Get list of available skills"""
    try:
        if skill_to_idx is None:
            return JsonResponse({'error': 'Skills not loaded'}, status=500)
        
        skills = [skill for skill in skill_to_idx.keys() if skill != '<unk>']
        return JsonResponse({'skills': sorted(skills)})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def get_available_locations(request):
    """Get list of available locations"""
    try:
        if location_to_idx is None:
            return JsonResponse({'error': 'Locations not loaded'}, status=500)
        
        locations = [loc for loc in location_to_idx.keys() if loc != '<unk>']
        return JsonResponse({'locations': sorted(locations)})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
