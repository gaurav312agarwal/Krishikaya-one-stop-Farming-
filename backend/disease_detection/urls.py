from django.urls import path
from .views import detect_disease, detection_page
 
urlpatterns = [
    path('detect/', detect_disease, name='detect_disease'),
    path('page/', detection_page, name='detection_page'),
] 