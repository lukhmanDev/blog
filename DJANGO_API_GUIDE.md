# Django REST Framework Backend Integration Guide for Lukman's Blogs

This React blog application is completely decoupled and configured to consume a Django REST Framework (DRF) API.

---

## 1. Quick Django Setup

In your Django directory or when creating your Django project:

```bash
# 1. Install dependencies
pip install django djangorestframework django-cors-headers

# 2. Start Django project & app
django-admin startproject backend .
python manage.py startapp blogs
```

---

## 2. Configure `settings.py`

Add `rest_framework`, `corsheaders`, and your `blogs` app to `INSTALLED_APPS`, and insert `CorsMiddleware` at the top of `MIDDLEWARE`:

```python
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'corsheaders',
    'blogs',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # MUST BE AT THE TOP
    'django.middleware.security.SecurityMiddleware',
    # ...
]

# Allow React Dev Server
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True
```

---

## 3. Blog Models (`blogs/models.py`)

```python
from django.db import models
from django.contrib.auth.models import User

class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    subtitle = models.TextField(blank=True)
    cover_image = models.URLField(max_length=500, blank=True)
    category = models.CharField(max_length=100)
    tags = models.JSONField(default=list)
    content = models.JSONField(default=list)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogs')
    published_at = models.DateTimeField(auto_now_add=True)
    read_time = models.CharField(max_length=50, default='5 min read')
    views_count = models.PositiveIntegerField(default=0)
    claps_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return self.title

class BlogComment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    author = models.CharField(max_length=100)
    avatar = models.URLField(max_length=500, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']
```

---

## 4. DRF Serializers (`blogs/serializers.py`)

```python
from rest_framework import serializers
from .models import BlogPost, BlogComment

class BlogCommentSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()

    class Meta:
        model = BlogComment
        fields = ['id', 'author', 'avatar', 'content', 'date', 'likes']

    def get_date(self, obj):
        return obj.created_at.strftime('%b %d, %Y')

class BlogPostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    comments = BlogCommentSerializer(many=True, read_only=True)
    publishedAt = serializers.SerializerMethodField()
    readTime = serializers.CharField(source='read_time')
    coverImage = serializers.CharField(source='cover_image')
    views = serializers.IntegerField(source='views_count')
    claps = serializers.IntegerField(source='claps_count')
    isFeatured = serializers.BooleanField(source='is_featured')

    class Meta:
        model = BlogPost
        fields = [
            'id', 'slug', 'title', 'subtitle', 'coverImage',
            'category', 'tags', 'content', 'author', 'publishedAt',
            'readTime', 'views', 'claps', 'isFeatured', 'comments'
        ]

    def get_publishedAt(self, obj):
        return obj.published_at.strftime('%b %d, %Y')

    def get_author(self, obj):
        return {
            'name': obj.author.get_full_name() or obj.author.username,
            'role': 'Full Stack Engineer & System Architect',
            'avatar': f'https://api.dicebear.com/7.x/avataaars/svg?seed={obj.author.username}&backgroundColor=6366f1'
        }
```

---

## 5. ViewSet and Endpoints (`blogs/views.py`)

```python
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import BlogPost, BlogComment
from .serializers import BlogPostSerializer, BlogCommentSerializer

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'subtitle', 'category', 'tags']
    ordering_fields = ['published_at', 'claps_count', 'views_count']

    @action(detail=True, methods=['post'])
    def clap(self, request, slug=None):
        blog = self.get_object()
        blog.claps_count += 1
        blog.save(update_fields=['claps_count'])
        return Response({'claps': blog.claps_count})

    @action(detail=True, methods=['post'])
    def comments(self, request, slug=None):
        blog = self.get_object()
        author = request.data.get('author', 'Tech Reader')
        content = request.data.get('content', '')
        if not content:
            return Response({'error': 'Comment content cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

        comment = BlogComment.objects.create(
            post=blog,
            author=author,
            avatar=f"https://api.dicebear.com/7.x/avataaars/svg?seed={author}",
            content=content
        )
        return Response(BlogCommentSerializer(comment).data, status=status.HTTP_201_CREATED)
```

---

## 6. URL Routing (`blogs/urls.py` & `backend/urls.py`)

```python
# blogs/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet

router = DefaultRouter()
router.register(r'blogs', BlogPostViewSet, basename='blog')

urlpatterns = [
    path('api/', include(router.urls)),
]
```

---

## 7. Activating Django in this React App

In your React project root:
1. Create a `.env` file:
   ```env
   VITE_USE_DJANGO_API=true
   VITE_DJANGO_API_URL=http://127.0.0.1:8000/api/blogs/
   ```
2. Or simply click **"Connect Django API"** on the top banner in the React UI!
