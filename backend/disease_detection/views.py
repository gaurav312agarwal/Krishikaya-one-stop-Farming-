from django.shortcuts import render
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import numpy as np
import os
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
import torchvision.models as models
import pandas as pd
import requests
from bs4 import BeautifulSoup
from difflib import get_close_matches
import re

# Create your views here.
class CNN(nn.Module):
    def __init__(self, K):
        super(CNN, self).__init__()
        self.conv_layers = nn.Sequential(
            nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(32),
            nn.Conv2d(in_channels=32, out_channels=32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(32),
            nn.MaxPool2d(2),
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(64),
            nn.Conv2d(in_channels=64, out_channels=64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(64),
            nn.MaxPool2d(2),
            nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(128),
            nn.Conv2d(in_channels=128, out_channels=128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(128),
            nn.MaxPool2d(2),
            nn.Conv2d(in_channels=128, out_channels=256, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(256),
            nn.Conv2d(in_channels=256, out_channels=256, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(256),
            nn.MaxPool2d(2),
        )
        self.dense_layers = nn.Sequential(
            nn.Dropout(0.4),
            nn.Linear(50176, 1024),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(1024, 39),
        )
    def forward(self, X):
        out = self.conv_layers(X)
        out = out.view(-1, 50176)
        out = self.dense_layers(out)
        return out

idx_to_classes = {0: 'Apple___Apple_scab', 1: 'Apple___Black_rot', 2: 'Apple___Cedar_apple_rust', 3: 'Apple___healthy', 4: 'Background_without_leaves', 5: 'Blueberry___healthy', 6: 'Cherry___Powdery_mildew', 7: 'Cherry___healthy', 8: 'Corn___Cercospora_leaf_spot Gray_leaf_spot', 9: 'Corn___Common_rust', 10: 'Corn___Northern_Leaf_Blight', 11: 'Corn___healthy', 12: 'Grape___Black_rot', 13: 'Grape___Esca_(Black_Measles)', 14: 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 15: 'Grape___healthy', 16: 'Orange___Haunglongbing_(Citrus_greening)', 17: 'Peach___Bacterial_spot', 18: 'Peach___healthy', 19: 'Pepper,_bell___Bacterial_spot', 20: 'Pepper,_bell___healthy', 21: 'Potato___Early_blight', 22: 'Potato___Late_blight', 23: 'Potato___healthy', 24: 'Raspberry___healthy', 25: 'Soybean___healthy', 26: 'Squash___Powdery_mildew', 27: 'Strawberry___Leaf_scorch', 28: 'Strawberry___healthy', 29: 'Tomato___Bacterial_spot', 30: 'Tomato___Early_blight', 31: 'Tomato___Late_blight', 32: 'Tomato___Leaf_Mold', 33: 'Tomato___Septoria_leaf_spot', 34: 'Tomato___Spider_mites Two-spotted_spider_mite', 35: 'Tomato___Target_Spot', 36: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 37: 'Tomato___Tomato_mosaic_virus', 38: 'Tomato___healthy'}

# Load the model once
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
MODEL_PATH = os.path.join(settings.BASE_DIR, 'disease_detection/model/trained_model.pth')

# Load ResNet50 model for inference
model = models.resnet50(pretrained=False)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 39)  # 39 classes as in idx_to_classes
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()
model.to(device)

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Load CSVs once
DISEASE_INFO_PATH = os.path.join(settings.BASE_DIR, 'disease_detection/model/disease_info.csv')
SUPPLEMENT_INFO_PATH = os.path.join(settings.BASE_DIR, 'disease_detection/model/supplement_info.csv')
disease_info = pd.read_csv(DISEASE_INFO_PATH, encoding='cp1252')
supplement_info = pd.read_csv(SUPPLEMENT_INFO_PATH, encoding='cp1252')

def scrape_britannica_description_and_cure(disease):
    headers = {'User-Agent': 'Mozilla/5.0'}
    search_url = f"https://www.britannica.com/search?query={disease.replace(' ', '+')}"
    r = requests.get(search_url, headers=headers, timeout=5)
    soup = BeautifulSoup(r.text, 'html.parser')
    # Find the first article link
    article_link = None
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.startswith('/science/') or href.startswith('/plant/') or href.startswith('/topic/'):
            article_link = 'https://www.britannica.com' + href
            break
    desc = "Not found"
    cure = "Not found"
    if article_link:
        r2 = requests.get(article_link, headers=headers, timeout=5)
        soup2 = BeautifulSoup(r2.text, 'html.parser')
        # Get the first paragraph as description
        p = soup2.find('p')
        if p:
            desc = p.text
        # Try to find a cure/treatment section
        for h2 in soup2.find_all(['h2', 'h3']):
            if any(word in h2.text.lower() for word in ['control', 'treatment', 'management']):
                next_p = h2.find_next('p')
                if next_p:
                    cure = next_p.text
                    break
    return desc, cure

def scrape_supplement_link(disease):
    query = f"plant supplement for {disease}"
    url = f"https://www.amazon.in/s?k={query.replace(' ', '+')}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    r = requests.get(url, headers=headers, timeout=5)
    soup = BeautifulSoup(r.text, 'html.parser')
    link = None
    try:
        a_tag = soup.find('a', {'class': 'a-link-normal s-no-outline'})
        if a_tag and a_tag['href']:
            link = 'https://www.amazon.in' + a_tag['href']
    except Exception:
        pass
    return link

def find_best_match(name, choices):
    matches = get_close_matches(name, choices, n=1, cutoff=0.6)
    return matches[0] if matches else None

def normalize_disease_name(name):
    name = name.lower()
    name = re.sub(r'[^a-z0-9 ]', ' ', name)  # keep only letters, numbers, spaces
    name = re.sub(r'\s+', ' ', name)
    return name.strip()

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def detect_disease(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No image uploaded.'}, status=400)
    img_file = request.FILES['image']
    img = Image.open(img_file).convert('RGB')
    img = transform(img)
    img = img.unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(img)
        probs = torch.softmax(output, dim=1)
        confidence, pred_idx = torch.max(probs, 1)
        pred_idx = pred_idx.item()
        confidence = confidence.item()
    # Use the predicted index to fetch from CSV (CultiKure logic)
    try:
        disease_row = disease_info.iloc[pred_idx]
        disease_name = disease_row['disease_name']
        desc = disease_row['description']
        cure = disease_row['Possible Steps']
        image_url = disease_row['image_url']
    except Exception:
        disease_name = desc = cure = image_url = "Not found"
    try:
        supp_row = supplement_info.iloc[pred_idx]
        supplement_name = supp_row['supplement name']
        supplement_image_url = supp_row['supplement image']
        supplement_link = supp_row['buy link']
    except Exception:
        supplement_name = supplement_image_url = supplement_link = "Not found"
    return Response({
        'result': disease_name,
        'confidence': confidence,
        'description': desc,
        'cure': cure,
        'image_url': image_url,
        'supplement': supplement_name,
        'supplement_image_url': supplement_image_url,
        'supplement_link': supplement_link
    })

def detection_page(request):
    return render(request, 'detection.html')
