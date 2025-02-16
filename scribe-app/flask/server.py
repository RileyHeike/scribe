from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api, Resource
from app import collect_messages
import pandas as pd
from pymongo import MongoClient
from langchain_community.embeddings import OpenAIEmbeddings 
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


def query_data_chat(query):
    docs = vectorStore.similarity_search(query, K=1)
    as_output = docs[0].page_content
    print(docs[0])

    llm = ChatOpenAI(openai_api_key=key_param.open_ai_api_key, temperature=0)

    retriever = vectorStore.as_retriever()

    qa = RetrievalQA.from_chain_type(llm, chain_type="stuff", retriever=retriever)

    retriever_output = qa.run(query)

    messages = [
        SystemMessage(content="You are a Santa Clara University Digital Archives Bot. You will answer questions based on the documents provided. If the provided document does not sufficiently, then tell the user that there is not an archived document on the topic. Be sure to include one quote from the document that best applies to the user's question."),
        HumanMessage(content=query),
        AIMessage(content=as_output)
    ]

    return as_output, retriever_output

def query_data(query):
    docs = vectorStore.similarity_search(query, K=1)
    as_output = docs[0].page_content
    print(docs[0])

    llm = ChatOpenAI(openai_api_key=key_param.open_ai_api_key, temperature=0)
    retriever = vectorStore.as_retriever()
    qa = RetrievalQA.from_chain_type(llm, chain_type="stuff", retriever=retriever)
    retriever_output = qa.run(query)

    return as_output, retriever_output

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
        responseString = query_data_chat(rqs.get('prompt'))[1]
        response_context.append({'role': 'assistant', 'content': f'{responseString}'})
        response = jsonify({'context': response_context})

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