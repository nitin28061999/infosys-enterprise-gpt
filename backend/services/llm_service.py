from config.llm_config import client


class GeminiService:

    def __init__(self):
        self.client = client

    def generate(self, prompt: str):
        for model in self.client.models.list():
            print(model.name)
        response = self.client.models.generate_content(
            model="models/gemini-3.5-flash-lite",
            contents=prompt,
        )

        return response.text