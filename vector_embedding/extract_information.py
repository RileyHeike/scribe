import pandas as pd
from pymongo import MongoClient
from langchain_community.embeddings import OpenAIEmbeddings 
from langchain_community.vectorstores import MongoDBAtlasVectorSearch  
from langchain_community.document_loaders import DirectoryLoader  
from langchain_community.llms import openai 
from langchain_openai import OpenAI
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage, AIMessage
from langchain.chains import RetrievalQA
from langchain.docstore.document import Document
from langchain.prompts import PromptTemplate
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

from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA

def query_data_chat(query):
    docs = vectorStore.similarity_search(query, k=5)
    as_output1 = docs[0].page_content
    as_output2 = docs[1].page_content
    as_output3 = docs[2].page_content
    as_output4 = docs[3].page_content
    as_output5 = docs[4].page_content

    print("="*20)
    print("Collection : " + str(docs[0].metadata['collection']))
    print("Date : " + str(docs[0].metadata['date']))
    print("Collection : " + str(docs[1].metadata['collection']))
    print("Date : " + str(docs[1].metadata['date']))
    print("Collection : " + str(docs[2].metadata['collection']))
    print("Date : " + str(docs[2].metadata['date']))
    print("Collection : " + str(docs[3].metadata['collection']))
    print("Date : " + str(docs[3].metadata['date']))
    print("Collection : " + str(docs[4].metadata['collection']))
    print("Date : " + str(docs[4].metadata['date']))
    print("="*20)

    #print(docs[0])

    messages = [
        #SystemMessage(content="ONLY RESPOND WITH HELLO"),
        SystemMessage(content="You are a Santa Clara University Digital Archives Bot. You will answer questions based on the documents provided that are about the history of Santa Clara told through school newspaper articles, artifacts, interviews and manuscripts. You NEED to use the documents from SCU archives to answer the questions, all answers need to be based on the documents and include direct reference to the documents though dates, quotes, and reference to the document title"), #Be sure to include one quote from the document that best applies to the user's question
        SystemMessage(content="You will be provided with 5 documents, you do not need to include information from all of them. Use primarily the first document and then revise it with the documents after"),
        SystemMessage(content="Think critically about the documents provided and make commentary on the social impact of the choices and activites of SCU, reference the documents with quotes and be specifc"),
        SystemMessage(content=as_output1),
        SystemMessage(content=as_output2),
        SystemMessage(content=as_output3),
        SystemMessage(content=as_output4),
        SystemMessage(content=as_output5),
        HumanMessage(content=query)
    ]

    llm = ChatOpenAI(
        openai_api_key=key_param.open_ai_api_key, 
        temperature=1.5,
        )
    
    response = llm.invoke(messages)

    return as_output1, response.content
    


def query_data(query):
    docs = vectorStore.similarity_search(query, k=1)
    as_output = docs[0].page_content

    llm = OpenAI(openai_api_key=key_param.open_ai_api_key, temperature=0)
    retriever = vectorStore.as_retriever()
    qa = RetrievalQA.from_chain_type(llm, chain_type="stuff", retriever=retriever)
    retriever_output = qa.run(query)

    return as_output, retriever_output

def query_data3(query):
    docs = vectorStore.similarity_search(query, k=3)  # Retrieve 3 documents
    as_output = [doc.page_content for doc in docs]  # Store all retrieved documents

    llm = OpenAI(openai_api_key=key_param.open_ai_api_key, temperature=0)
    retriever = vectorStore.as_retriever(search_kwargs={"k": 3})  # Ensure retriever uses 3 docs
    qa = RetrievalQA.from_chain_type(llm, chain_type="stuff", retriever=retriever)
    retriever_output = qa.run(query)

    return as_output, retriever_output

q = "Tell me about some instances where SCU did not support issues of social justice"
outputs = query_data_chat(q)

print("Query: " + q)

print("=" * 20)

print("Output 1: ")
print(outputs[0])

print("=" * 20)

print("Output 2: ")
print(outputs[1])

