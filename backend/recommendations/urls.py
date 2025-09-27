from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('recommendations/', views.get_recommendations, name='get_recommendations'),
    path('skills/', views.get_available_skills, name='get_available_skills'),
    path('locations/', views.get_available_locations, name='get_available_locations'),
]
