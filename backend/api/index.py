"""
Vercel Serverless entry-point for DemandFlow AI FastAPI backend.
Vercel Python runtime uses ASGI adapters — this file exports `app`
which Vercel wraps automatically via the @vercel/python builder.
"""
import sys
import os

# Ensure the backend/ directory root is on the Python path so that
# `from app.xxx import ...` resolves correctly regardless of Vercel's cwd.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app  # noqa: F401  — Vercel discovers `app` from here
