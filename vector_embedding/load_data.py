import pandas as pd
from pymongo import MongoClient
from langchain_community.embeddings import OpenAIEmbeddings  
from langchain_community.vectorstores import MongoDBAtlasVectorSearch  
from langchain_community.document_loaders import DirectoryLoader 
from langchain_community.llms import openai  
from langchain.chains import RetrievalQA
import gradio as gr
from gradio.themes.base import Base
from langchain.docstore.document import Document
import key_param
import nltk
import tiktoken

df = pd.read_csv('./csv_files/student_news.csv')

start_num = 29000
end_num = 29100
df = df.iloc[start_num:end_num]


def chunk_text(text, max_tokens=512):
    tokenizer = tiktoken.get_encoding("cl100k_base") 
    tokens = tokenizer.encode(text)
    chunks = []
    current_chunk = []

    for token in tokens:
        if len(current_chunk) + 1 > max_tokens: 
            chunks.append(tokenizer.decode(current_chunk))
            current_chunk = [token] 
        else:
            current_chunk.append(token) 

    if current_chunk:
        chunks.append(tokenizer.decode(current_chunk)) 

    return chunks


embeddings = OpenAIEmbeddings(openai_api_key=key_param.open_ai_api_key)

client = MongoClient(key_param.MONGO_URI)
dbName = "archives_data"
collectionName = "csv_collection"
collection = client[dbName][collectionName]

documents = []
row_count = 0
for _, row in df.iterrows():
    text_chunks = chunk_text(row['text'])
    embedding_texts = []

    for chunk in text_chunks:
        embedding_text = 'Title: ' + row['title'] + ', ' +  'Date: ' + str(row['date']) + ', ' + 'Page Number: ' + str(row['pageNumber']) + ', ' + 'Text: ' + chunk
        embedding_texts.append(embedding_text)
    
    vector_embeddings = embeddings.embed_documents(embedding_texts)
    for i in range(len(vector_embeddings)):
        document = Document(
            page_content=embedding_texts[i],
            metadata={
                'id': row['id'],
                'parentId': row['parentId'],
                'title': row['title'],
                'date': row['date'],
                'volume': row['volume'],
                'issue': row['issue'],
                'imageUri': row['imageUri'],
                'pageNumber': row['pageNumber'],
                'collection': row['collection'],
                'text': text_chunks[i]
            },
            embedding=vector_embeddings[i] 
        )
        documents.append(document)

    vectorstore = MongoDBAtlasVectorSearch.from_documents(
    documents,
    embedding=embeddings,
    collection=collection
    )
    print("Row Completed: " + str(row_count + start_num))
    row_count += 1
    documents = []




