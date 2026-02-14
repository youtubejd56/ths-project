import google.generativeai as genai
import os

genai.configure(api_key='AIzaSyCxzID0d5Wb5mqh7qMW-AKAxLIDlsmgilc')

print("Available models:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f" - {m.name}")
