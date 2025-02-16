from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api, Resource
from app import collect_messages
import pandas as pd
from pymongo import MongoClient
from langchain_community.embeddings import OpenAIEmbeddings 
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage, AIMessage
from langchain_community.vectorstores import MongoDBAtlasVectorSearch  
from langchain_community.document_loaders import DirectoryLoader  
from langchain_community.llms import openai 
from langchain_openai import OpenAI, ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage, AIMessage
from langchain.chains import RetrievalQA
from langchain.docstore.document import Document
import key_param
import nltk
nltk.download('punkt')  # Downloads the tokenizer

app = Flask(__name__)
CORS(app, supports_credentials=True)

api = Api(app)

client = MongoClient(key_param.MONGO_URI)
dbName = "archives_data"
collectionName = "csv_collection"
collection = client[dbName][collectionName]

embeddings = OpenAIEmbeddings(openai_api_key=key_param.open_ai_api_key)

vectorStore = MongoDBAtlasVectorSearch(
    embedding=embeddings,
    collection=collection
)

def query_data(query):
    docs = vectorStore.similarity_search(query, k=5)
    as_output1 = docs[0].page_content
    as_output2 = docs[1].page_content
    as_output3 = docs[2].page_content
    as_output4 = docs[3].page_content
    as_output5 = docs[4].page_content

    messages = [
        SystemMessage(content="You are a Santa Clara University Digital Archives Bot. You will answer questions based on the documents provided that are about the history of Santa Clara told through school newspaper articles. Be sure to include one quote from the document that best applies to the user's question."),
        SystemMessage(content="You will be provided with 5 documents, you do not need to include information from all of them. Use primarily the first document and then revise it with the documents after"),
        SystemMessage(content=as_output1),
        SystemMessage(content=as_output2),
        SystemMessage(content=as_output3),
        SystemMessage(content=as_output4),
        SystemMessage(content=as_output5),
        HumanMessage(content=query)
    ]

    llm = ChatOpenAI(
        openai_api_key=key_param.open_ai_api_key, 
        temperature=0,
        )
    
    response = llm.invoke(messages)
    relevant_docs = [{"id": docs[0].metadata['id'], "collection": docs[0].metadata['collection']}, {"id": docs[1].metadata['id'], "collection": docs[1].metadata['collection']}, {"id": docs[2].metadata['id'], "collection": docs[2].metadata['collection']}]

    return response.content, relevant_docs


system_context = '''You are a helpful assistant who is being given a document pertaining to Santa Clara Univeristy history. Answer the prompt, but do not reveal where you are getting your info from. If you cannot answer, just say you do not have enough information. Make sure to pay attention to dates both in the document and the prompt to make sure things align.'''

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

        if (not context):
            context = self.context

        response_context = collect_messages(prompt, context)
        responseString, doc_info = query_data(rqs.get('prompt'))
        response_context.append({'role': 'assistant', 'content': f'{responseString}'})
        response = jsonify({'context': response_context, 'docs': doc_info})

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