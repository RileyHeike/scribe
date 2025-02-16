from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api, Resource
from app import collect_messages

app = Flask(__name__)
CORS(app, supports_credentials=True)

api = Api(app)


system_context = '''
    You are a helpful financial assistant. I may ask you questions about beudgeting, saving, investing, or other financial topics.
    Do your best to provide helpful financial advice.
'''

class ChatHandler(Resource):
    def __init__(self, **kwargs):
        self.context = [{"role": "system",
                        "content": system_context}]

    def get(self):
        response = jsonify(context=self.context)
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")

        return response

    # @cross_origin()
    def post(self):
        rqs = request.json
        prompt = rqs.get('prompt')
        context = rqs.get('context')

        response_data = collect_messages(prompt, context)
        response = jsonify(response_data)

        # Ensure CORS headers are set
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response
    
    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response


api.add_resource(ChatHandler, '/')

if __name__ == '__main__':
    app.run(debug=True, port=5005)