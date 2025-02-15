import pandas as pd

def addCollection(csvName, collectionTag):
    df = pd.read_csv(csvName)
    df['collection'] = collectionTag 
    df.to_csv(csvName, index=False)

def removeChar(csvName, columnTitle, char):
    df = pd.read_csv(csvName)
    df[columnTitle] = df[columnTitle].str.replace(char, '', regex=False)
    df.to_csv(csvName, index=False)

def renameColumn(csvName, columnName, newName):
    df = pd.read_csv(csvName)
    df = df.rename(columns={columnName: newName})
    df.to_csv(csvName, index=False)
        
addCollection('./scu_msc.csv', 'Cultural')
addCollection('./scu_artifacts.csv', 'artifacts')
addCollection('./scu_oral_histories_docs.csv', 'p17268coll11')
addCollection('./student_news.csv', 'broncoseg')

# removeChar('./student_news.csv', 'text', '■')
renameColumn('./scu_artifacts.csv', 'description', 'text')
renameColumn('./scu_oral_histories_docs.csv', 'description', 'text')
renameColumn('./student_news.csv', 'description', 'text')
renameColumn('./scu_msc.csv', 'description', 'text')

