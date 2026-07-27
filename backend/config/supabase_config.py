from supabase import create_client
from config.env_config import envConfig




supabase = create_client(
    envConfig.SUPABASE_URL,
    envConfig.SUPABASE_KEY
)




