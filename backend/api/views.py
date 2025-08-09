'''from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer , UploadHistorySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
from django.contrib.auth import get_user_model
import os
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import requests
from django.conf import settings
import base64
from io import BytesIO

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
import mimetypes
from huggingface_hub import InferenceClient
from PIL import Image, UnidentifiedImageError
from rest_framework.decorators import parser_classes
from .models import UploadHistory
from django.core.files.base import ContentFile

from .serializers import UploadHistorySerializer




User = get_user_model()
queryset = User.objects.all()

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return JsonResponse(serializer.data, status=201)
        else:
            print("❌ Serializer errors:", serializer.errors)  # <--- add this
            return JsonResponse(serializer.errors, status=400)


load_dotenv()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def image_to_text_gemini(request):
    image_file = request.FILES.get('image')

    if not image_file:
        return Response({'error': 'No image uploaded'}, status=400)

    image = Image.open(image_file)
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": os.getenv("GEMINI_API_KEY")
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": img_str
                        }
                    },
                    {
                        "text": "Describe this image briefly"
                    }
                ]
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        gemini_data = response.json()

        caption = gemini_data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'No caption found')

        # Save to UploadHistory
        UploadHistory.objects.create(user=request.user, image=image_file, caption=caption)

        return Response({"caption": caption})
    except requests.exceptions.RequestException as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_history(request):
    user = request.user
    entries = UploadHistory.objects.filter(user=user).order_by('-uploaded_at')
    serializer = UploadHistorySerializer(entries, many=True, context={'request': request})
    return Response(serializer.data)'''