from openai import OpenAI
import os

from dotenv import load_dotenv, find_dotenv

## Load the .env file
_ = load_dotenv(find_dotenv())
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
print("API Key: ", os.getenv('OPENAI_API_KEY'))


## Helper function
def get_completion(prompt, model="gpt-4o-mini", temperature=0):
    message = [{"role": "user",
                "content": prompt}]
    response = client.chat.completions.create(
        model=model,
        message=message,
        temperature=temperature,
    )
    return response.choices[0].message.content

## Helper function, generates completion from messages
def get_completion_from_messages(messages, model="gpt-4o-mini", temperature=0):
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
    )
    return response.choices[0].message.content


def collect_messages(prompt: str, context: list, temperature=0):
    context.append({'role': 'user', 'content': f'{prompt}'})
    return context