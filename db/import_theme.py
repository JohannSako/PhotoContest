from pymongo import MongoClient

# Connexion à la base de données MongoDB
uri = #Mettre la db ici
client = MongoClient(uri)

# Sélection de la base de données 'admin' et de la collection 'theme'
db = client.main
collection = db.theme

# Lecture du fichier 'unique_themes.txt' et insertion des documents dans la collection
index = 0
with open('unique_themes.txt', 'r', encoding='utf-8') as file:
    for line in file:
        title = line.strip()
        if title:
            document = {'title': title}
            result = collection.insert_one(document)
        index += 1
        print(index)

print("Les thèmes ont été insérés avec succès dans la collection 'theme' avec un champ 'id'.")