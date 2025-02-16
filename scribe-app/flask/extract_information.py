import pandas as pd
from pymongo import MongoClient
from langchain_community.embeddings import OpenAIEmbeddings 
from langchain_community.vectorstores import MongoDBAtlasVectorSearch  
from langchain_community.document_loaders import DirectoryLoader  
from langchain_community.llms import openai 
from langchain_openai import OpenAI
from langchain.chains import RetrievalQA
import gradio as gr
from gradio.themes.base import Base
from langchain.docstore.document import Document
import key_param

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
    docs = vectorStore.similarity_search(query, K=1)
    as_output = docs[0].page_content

    llm = OpenAI(openai_api_key=key_param.open_ai_api_key, temperature=0)
    retriever = vectorStore.as_retriever()
    qa = RetrievalQA.from_chain_type(llm, chain_type="stuff", retriever=retriever)
    retriever_output = qa.run(query)
    print(retriever_output)

    return as_output, retriever_output

q = "Tell me about Santa Clara and St. Mary's"
outputs = query_data(q)

print("Query: " + q)

print("=" * 20)

print("Output 1: ")
print(outputs[0])

print("=" * 20)

print("Output 2: ")
print(outputs[1])

