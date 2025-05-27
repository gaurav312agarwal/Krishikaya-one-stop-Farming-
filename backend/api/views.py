from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import google.generativeai as genai
import json

# Create your views here.

@api_view(['GET'])
def test_api(request):
    return Response({"message": "API is working!"})

def root(request):
    return JsonResponse({"message": "Welcome to the KrishiKaya API!"})

@csrf_exempt
@api_view(['POST'])
def chatbot_view(request):
    data = json.loads(request.body)
    question = data.get("question")
    if not question:
        return Response({"error": "No question provided"}, status=400)
    genai.configure(api_key="AIzaSyBBxujGCCu3yuGRaCf8yLjgF3DTZ2qdoHw")
    model = genai.GenerativeModel("gemini-2.5-pro-exp-03-25")
    response = model.generate_content(question)
    return Response({"answer": response.text})
