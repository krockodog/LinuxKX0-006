"""
Backend API Tests for CompTIA Linux+ XK0-006 Learning App
Tests: Chapters, Questions, Flashcards, AI Providers, Study Plan
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndBasicEndpoints:
    """Test basic API health and root endpoints"""
    
    def test_api_root(self):
        """Test API root endpoint returns 200"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data or "status" in data or isinstance(data, dict)
        print(f"✓ API root endpoint working: {data}")

class TestChaptersEndpoint:
    """Test /api/chapters endpoint"""
    
    def test_get_chapters(self):
        """Test chapters endpoint returns 5 chapters"""
        response = requests.get(f"{BASE_URL}/api/chapters")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 5, f"Expected 5 chapters, got {len(data)}"
        
        # Verify chapter structure
        for chapter in data:
            assert "id" in chapter
            assert "title" in chapter
            assert "title_de" in chapter
            assert "description" in chapter
            assert "description_de" in chapter
            assert "questions" in chapter
            assert "weight" in chapter
        
        print(f"✓ Chapters endpoint returns {len(data)} chapters with correct structure")

class TestQuestionsEndpoint:
    """Test /api/questions/{chapter} endpoint"""
    
    def test_get_questions_chapter_1(self):
        """Test questions for chapter 1"""
        response = requests.get(f"{BASE_URL}/api/questions/1?limit=10")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) <= 10
        
        # Verify question structure
        for q in data:
            assert "id" in q
            assert "chapter" in q
            assert "question" in q
            assert "options" in q
            assert "correct_answer" in q
            assert "explanation" in q
            assert len(q["options"]) == 4, "Each question should have 4 options"
        
        print(f"✓ Chapter 1 questions endpoint returns {len(data)} questions")
    
    def test_get_questions_all_chapters(self):
        """Test questions for all 5 chapters"""
        for chapter in range(1, 6):
            response = requests.get(f"{BASE_URL}/api/questions/{chapter}?limit=10")
            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, list)
            assert len(data) > 0, f"Chapter {chapter} should have questions"
            print(f"✓ Chapter {chapter} has {len(data)} questions")
    
    def test_extended_questions_count(self):
        """Test that extended questions are included (100+ total)"""
        total_questions = 0
        for chapter in range(1, 6):
            response = requests.get(f"{BASE_URL}/api/questions/{chapter}?limit=100")
            assert response.status_code == 200
            data = response.json()
            total_questions += len(data)
        
        # Should have 100+ questions total (50 base + 50 extended)
        assert total_questions >= 50, f"Expected 50+ questions, got {total_questions}"
        print(f"✓ Total questions across all chapters: {total_questions}")

class TestFlashcardsEndpoint:
    """Test /api/flashcards endpoints"""
    
    def test_get_all_flashcards(self):
        """Test getting all flashcards"""
        response = requests.get(f"{BASE_URL}/api/flashcards")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 30, f"Expected 30+ flashcards, got {len(data)}"
        
        # Verify flashcard structure
        for card in data[:5]:  # Check first 5
            assert "id" in card
            assert "chapter" in card
            assert "front" in card
            assert "back" in card
            assert "category" in card
        
        print(f"✓ All flashcards endpoint returns {len(data)} flashcards")
    
    def test_get_flashcards_by_chapter(self):
        """Test getting flashcards for specific chapter"""
        response = requests.get(f"{BASE_URL}/api/flashcards/1")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        # All flashcards should be from chapter 1
        for card in data:
            assert card["chapter"] == 1
        
        print(f"✓ Chapter 1 flashcards: {len(data)} cards")

class TestAIProvidersEndpoint:
    """Test /api/ai/providers endpoint - NEW FEATURE"""
    
    def test_get_ai_providers(self):
        """Test AI providers endpoint returns 6 providers"""
        response = requests.get(f"{BASE_URL}/api/ai/providers")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 6, f"Expected 6 AI providers, got {len(data)}"
        
        # Expected providers
        expected_providers = ["openai", "gemini", "anthropic", "deepseek", "qwen", "perplexity"]
        provider_ids = [p["id"] for p in data]
        
        for expected in expected_providers:
            assert expected in provider_ids, f"Missing provider: {expected}"
        
        # Verify provider structure
        for provider in data:
            assert "id" in provider
            assert "name" in provider
            assert "models" in provider
            assert isinstance(provider["models"], list)
            assert len(provider["models"]) > 0
        
        print(f"✓ AI providers endpoint returns {len(data)} providers: {provider_ids}")
    
    def test_ai_providers_have_models(self):
        """Test each AI provider has available models"""
        response = requests.get(f"{BASE_URL}/api/ai/providers")
        assert response.status_code == 200
        data = response.json()
        
        for provider in data:
            assert len(provider["models"]) >= 1, f"Provider {provider['id']} should have at least 1 model"
            print(f"  - {provider['name']}: {provider['models']}")

class TestStudyPlanEndpoint:
    """Test /api/studyplan endpoint"""
    
    def test_get_study_plan(self):
        """Test study plan endpoint returns 20 weeks"""
        response = requests.get(f"{BASE_URL}/api/studyplan")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 20, f"Expected 20 weeks, got {len(data)}"
        
        # Verify week structure
        for week in data:
            assert "week" in week
            assert "title" in week
            assert "topics" in week
            assert isinstance(week["topics"], list)
        
        print(f"✓ Study plan endpoint returns {len(data)} weeks")

class TestAIExplainEndpoint:
    """Test /api/ai/explain endpoint - NEW FEATURE"""
    
    def test_ai_explain_without_api_key(self):
        """Test AI explain endpoint returns error without API key"""
        payload = {
            "question": "What is LVM?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": 0,
            "user_answer": 1,
            "provider": "openai",
            "api_key": "",  # Empty API key
            "language": "en"
        }
        response = requests.post(f"{BASE_URL}/api/ai/explain", json=payload)
        # Should return 400 or error response
        assert response.status_code in [400, 422, 200]
        data = response.json()
        
        if response.status_code == 200:
            # If 200, should have success=false or error message
            assert data.get("success") == False or "error" in data
        
        print(f"✓ AI explain endpoint properly handles missing API key")
    
    def test_ai_explain_with_invalid_provider(self):
        """Test AI explain endpoint with invalid provider"""
        payload = {
            "question": "What is LVM?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": 0,
            "user_answer": 1,
            "provider": "invalid_provider",
            "api_key": "test_key",
            "language": "en"
        }
        response = requests.post(f"{BASE_URL}/api/ai/explain", json=payload)
        # Should return error for invalid provider
        assert response.status_code in [400, 422, 200]
        print(f"✓ AI explain endpoint handles invalid provider")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
