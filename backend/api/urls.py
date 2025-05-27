from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
import math

router = DefaultRouter()
def sanitize_for_json(obj):
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return 0.0  # or any default value you prefer
        return obj
    elif isinstance(obj, dict):
        return {k: sanitize_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_for_json(x) for x in obj]
    else:
        return obj

urlpatterns = [
    path('test/', views.test_api, name='test_api'),
    path('chatbot/', views.chatbot_view, name='chatbot'),
]

urlpatterns += router.urls 