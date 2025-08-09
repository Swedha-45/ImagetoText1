from django.urls import path
from . import views
from .views import image_to_text_gemini, get_user_history

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path('image-to-text-gemini/',image_to_text_gemini, name='upload_image'),
    path('get-history/', views.get_user_history, name='upload-history'),
    ]