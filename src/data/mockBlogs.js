export const CATEGORIES = [
  'All Articles',
  'Full Stack',
  'Django & Python',
  'React & UI/UX',
  'AI Engineering',
  'System Architecture'
];

export const INITIAL_BLOGS = [
  {
    id: 1,
    slug: 'architecting-scalable-react-django-apps',
    title: 'Architecting Scalable React Frontends with Django REST Framework',
    subtitle: 'A production-grade guide to seamless JWT authentication, optimized serialization, and caching strategies between Django and React.',
    coverImage: '/images/django-react.jpg',
    category: 'Full Stack',
    tags: ['Django', 'React', 'REST API', 'Architecture', 'Python'],
    isFeatured: true,
    publishedAt: 'Oct 10, 2026',
    readTime: '8 min read',
    views: 3420,
    claps: 268,
    author: {
      name: 'Lukman',
      role: 'Full Stack & Cloud Architect',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LukmanArchitect&backgroundColor=6366f1'
    },
    tableOfContents: [
      { id: 'introduction', title: '1. The Decoupled Architecture Paradigm' },
      { id: 'api-contract', title: '2. Designing Strict API Contracts with DRF' },
      { id: 'authentication', title: '3. Bulletproof JWT & CSRF Management' },
      { id: 'performance', title: '4. Caching & Query Optimization' },
      { id: 'takeaways', title: '5. Key Engineering Takeaways' }
    ],
    content: [
      {
        type: 'heading',
        id: 'introduction',
        text: '1. The Decoupled Architecture Paradigm'
      },
      {
        type: 'paragraph',
        text: 'When building enterprise-scale web applications, decoupling your presentation layer from business logic is a fundamental milestone. Pairing Django’s robust ORM and security infrastructure with React’s expressive component ecosystem yields an unrivaled balance of velocity, maintainability, and end-user performance.'
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Architectural Principle',
        text: 'Treat your Django backend as a headless core. Your React application is simply one consumer among many potential clients (mobile apps, CLI utilities, third-party webhook integrations).'
      },
      {
        type: 'heading',
        id: 'api-contract',
        text: '2. Designing Strict API Contracts with DRF'
      },
      {
        type: 'paragraph',
        text: 'A clean RESTful interface begins with intentional serializers. Over-fetching is the silent killer of mobile client response times. Always use select_related and prefetch_related in Django QuerySets to eliminate the dreaded N+1 query vulnerability before exposing data to React hooks.'
      },
      {
        type: 'code',
        language: 'python',
        filename: 'blog/serializers.py',
        code: `# Django REST Framework Serializer with Nested Author and Tag Aggregates
from rest_framework import serializers
from .models import BlogPost, Tag

class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    tags = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )
    read_time_minutes = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'slug', 'title', 'subtitle', 'cover_image',
            'category', 'tags', 'author_name', 'read_time_minutes',
            'published_at', 'views_count', 'claps_count'
        ]

    def get_read_time_minutes(self, obj):
        words_per_minute = 200
        return max(1, len(obj.content.split()) // words_per_minute)`
      },
      {
        type: 'heading',
        id: 'authentication',
        text: '3. Bulletproof JWT & CSRF Management'
      },
      {
        type: 'paragraph',
        text: 'Storing raw JWT tokens in browser localStorage leaves your application susceptible to Cross-Site Scripting (XSS). In production setups, leverage HttpOnly, SameSite=Strict cookies combined with rotating refresh tokens to guarantee bank-grade session security.'
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'src/api/client.js',
        code: `// React Axios Client with Automatic Token Refresh Interceptors
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
  withCredentials: true, // Crucial for HttpOnly cookie authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      await axios.post('/api/auth/token/refresh/', {}, { withCredentials: true });
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);`
      },
      {
        type: 'heading',
        id: 'performance',
        text: '4. Caching & Query Optimization'
      },
      {
        type: 'paragraph',
        text: 'Pair Django’s low-level cache API backed by Redis with HTTP ETag headers. When React makes repetitive requests, the backend responds with 304 Not Modified in less than 4ms, reducing bandwidth by over 80%.'
      },
      {
        type: 'heading',
        id: 'takeaways',
        text: '5. Key Engineering Takeaways'
      },
      {
        type: 'list',
        items: [
          'Use Django viewsets and routers to adhere strictly to REST conventions.',
          'Enforce strict TypeScript/JSDoc types mirroring your DRF serializers.',
          'Handle optimistic UI updates in React when users clap or bookmark articles.',
          'Serve static media assets via cloud CDN (Cloudflare / S3) rather than through Django WSGI.'
        ]
      }
    ],
    comments: [
      {
        id: 101,
        author: 'Alex Vance',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        date: '2 days ago',
        content: 'The HttpOnly cookie advice for DRF + React authentication saved me hours of debugging cross-origin sessions. Phenomenal writeup, Lukman!',
        likes: 14
      },
      {
        id: 102,
        author: 'Devon Moore',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Devon',
        date: '1 day ago',
        content: 'How do you handle Server-Side Rendering (SSR) if SEO is paramount? Would you prefer Next.js on top of Django DRF?',
        likes: 8
      }
    ]
  },
  {
    id: 2,
    slug: 'building-autonomous-ai-agent-pipelines-python',
    title: 'Building Autonomous AI Agent Pipelines with Python & Vector Databases',
    subtitle: 'From prompt chains to self-correcting agent swarms: engineering deterministic tool calling, memory stores, and evaluation frameworks.',
    coverImage: '/images/ai-agents.jpg',
    category: 'AI Engineering',
    tags: ['Python', 'AI Agents', 'LLM', 'Vector DB', 'RAG'],
    isFeatured: false,
    publishedAt: 'Oct 07, 2026',
    readTime: '11 min read',
    views: 4890,
    claps: 412,
    author: {
      name: 'Lukman',
      role: 'Full Stack & AI Engineer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LukmanArchitect&backgroundColor=6366f1'
    },
    tableOfContents: [
      { id: 'foundations', title: '1. Beyond Simple LLM Completion' },
      { id: 'tool-calling', title: '2. Deterministic Function Calling' },
      { id: 'memory', title: '3. Vector Embeddings & Hierarchical Memory' },
      { id: 'architecture', title: '4. Production Deployment Blueprint' }
    ],
    content: [
      {
        type: 'heading',
        id: 'foundations',
        text: '1. Beyond Simple LLM Completion'
      },
      {
        type: 'paragraph',
        text: 'While single-prompt LLM wrappers dominated early generative software, production-grade applications demand autonomous workflows that can plan, execute code, observe results, and iterate until a verified condition is satisfied.'
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Core Philosophy',
        text: 'Agents are loops: Model -> Reason -> Tool Execution -> State Update -> Reflection. The key to high reliability is keeping tools atomic and validating inputs strictly with Pydantic.'
      },
      {
        type: 'heading',
        id: 'tool-calling',
        text: '2. Deterministic Function Calling'
      },
      {
        type: 'paragraph',
        text: 'Providing an LLM with arbitrary shell execution invites instability. Instead, define strongly typed schema definitions using Python dataclasses or Pydantic models with exhaustive docstrings.'
      },
      {
        type: 'code',
        language: 'python',
        filename: 'agents/tools.py',
        code: `from pydantic import BaseModel, Field
from typing import List, Optional

class SearchQuery(BaseModel):
    query: str = Field(description="Search term to lookup in technical documentation")
    filters: Optional[dict] = Field(default=None, description="Metadata filter tags")
    top_k: int = Field(default=5, ge=1, le=20)

def search_knowledge_base(params: SearchQuery) -> List[dict]:
    """Queries Qdrant vector index using hybrid dense + sparse embeddings."""
    return vector_store.similarity_search(params.query, k=params.top_k)`
      },
      {
        type: 'heading',
        id: 'memory',
        text: '3. Vector Embeddings & Hierarchical Memory'
      },
      {
        type: 'paragraph',
        text: 'Long conversational trajectories quickly saturate token windows. By segmenting short-term conversational context from long-term factual memories indexed in vector databases, agents can retain institutional context across months of interactions.'
      }
    ],
    comments: [
      {
        id: 201,
        author: 'Elena Rostova',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
        date: '3 days ago',
        content: 'The section on Pydantic schemas for deterministic tool calling is pure gold. Solved my schema hallucination issues completely.',
        likes: 19
      }
    ]
  },
  {
    id: 3,
    slug: 'engineering-fluid-design-systems-micro-interactions',
    title: 'The Engineering Behind Ultra-Fluid Design Systems & Micro-Interactions',
    subtitle: 'Crafting 60fps animations, accessible color palettes, glassmorphic lighting, and tokenized design systems without CSS bloat.',
    coverImage: '/images/ui-design.jpg',
    category: 'React & UI/UX',
    tags: ['CSS', 'Design Systems', 'UX', 'Animation', 'Frontend'],
    isFeatured: false,
    publishedAt: 'Oct 03, 2026',
    readTime: '6 min read',
    views: 2850,
    claps: 310,
    author: {
      name: 'Lukman',
      role: 'Full Stack & UI/UX Specialist',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LukmanArchitect&backgroundColor=6366f1'
    },
    tableOfContents: [
      { id: 'foundations-ui', title: '1. Modern CSS Variables & Design Tokens' },
      { id: 'micro-interactions', title: '2. Micro-Interactions that Delight' },
      { id: 'accessibility', title: '3. Contrast Ratios & A11y Standards' }
    ],
    content: [
      {
        type: 'heading',
        id: 'foundations-ui',
        text: '1. Modern CSS Variables & Design Tokens'
      },
      {
        type: 'paragraph',
        text: 'A design system is far more than a button library; it is a shared language between typography, spacing scales, depth elevations, and color theory. By building on native CSS Custom Properties, we achieve dynamic theme switching without runtime overhead.'
      },
      {
        type: 'code',
        language: 'css',
        filename: 'styles/design-tokens.css',
        code: `:root {
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-display: 'Plus Jakarta Sans', sans-serif;
  --color-primary: hsl(239, 84%, 67%);
  --color-primary-glow: hsla(239, 84%, 67%, 0.35);
  --glass-surface: rgba(17, 24, 39, 0.7);
  --glass-border: rgba(255, 255, 255, 0.08);
  --shadow-neon: 0 8px 32px 0 rgba(99, 102, 241, 0.25);
  --transition-smooth: cubic-bezier(0.16, 1, 0.3, 1);
}`
      },
      {
        type: 'heading',
        id: 'micro-interactions',
        text: '2. Micro-Interactions that Delight'
      },
      {
        type: 'paragraph',
        text: 'Micro-animations bridge cognitive gaps. When a user bookmarks a post or gives a clap, subtle physics-based spring transitions provide tactile confirmation that their action succeeded.'
      }
    ],
    comments: [
      {
        id: 301,
        author: 'Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen',
        date: '5 days ago',
        content: 'The glassmorphic lighting tokens and cubic-bezier easing formulas in this article are wonderful.',
        likes: 11
      }
    ]
  },
  {
    id: 4,
    slug: 'high-throughput-database-optimization-django-postgres',
    title: 'High-Throughput Database Optimization: Django ORM, Redis & Postgres at Scale',
    subtitle: 'Techniques for scaling relational architectures to 10,000+ requests per second with connection pooling, index tuning, and materialized views.',
    coverImage: '/images/backend-cloud.jpg',
    category: 'System Architecture',
    tags: ['Django', 'PostgreSQL', 'Redis', 'Performance', 'DevOps'],
    isFeatured: false,
    publishedAt: 'Sep 27, 2026',
    readTime: '9 min read',
    views: 5210,
    claps: 540,
    author: {
      name: 'Lukman',
      role: 'Full Stack & Cloud Architect',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LukmanArchitect&backgroundColor=6366f1'
    },
    tableOfContents: [
      { id: 'indexing', title: '1. Index Strategies in PostgreSQL' },
      { id: 'orm-gotchas', title: '2. Django ORM Hidden Bottlenecks' },
      { id: 'caching-layer', title: '3. Multi-Tier Redis Caching' }
    ],
    content: [
      {
        type: 'heading',
        id: 'indexing',
        text: '1. Index Strategies in PostgreSQL'
      },
      {
        type: 'paragraph',
        text: 'B-Tree indexes are suitable for equality lookups, but high-throughput systems require GiST, GIN, and partial indexes tailored to your specific analytical queries and full-text search operators.'
      },
      {
        type: 'code',
        language: 'python',
        filename: 'blog/models.py',
        code: `from django.db import models
from django.contrib.postgres.indexes import GinIndex

class Article(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, db_index=True)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            # Partial index for fast queries on live published articles
            models.Index(
                fields=['created_at'],
                name='idx_published_articles',
                condition=models.Q(published=True)
            )
        ]`
      },
      {
        type: 'heading',
        id: 'orm-gotchas',
        text: '2. Django ORM Hidden Bottlenecks'
      },
      {
        type: 'paragraph',
        text: 'Never use `.count()` on large tables inside hot loops when `.exists()` is all that is required. Combine iterator() for bulk data ingestion to prevent excessive memory ballooning.'
      }
    ],
    comments: [
      {
        id: 401,
        author: 'Marcus Brody',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
        date: '1 week ago',
        content: 'Partial indexes saved our database CPU from spiking above 90% during peak traffic. Essential reading for every Django backend engineer.',
        likes: 22
      }
    ]
  }
];
