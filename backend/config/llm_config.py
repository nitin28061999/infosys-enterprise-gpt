from google import genai
from .env_config import envConfig

client = genai.Client(api_key=envConfig.GEMINI_API_KEY)