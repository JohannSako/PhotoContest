import json
from pymongo import MongoClient

# Connexion à la base de données MongoDB
uri = #Mettre la db ici
client = MongoClient(uri)

# Sélection de la base de données 'admin' et des collections 'theme' et 'category'
db = client.main
theme_collection = db.theme
category_collection = db.category

# Lecture du fichier 'unique_themes_with_categories.json'
with open('unique_themes_with_categories.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Création d'un dictionnaire pour regrouper les thèmes par catégorie
categories = {}

for item in data:
    theme_title = item['theme'].strip()
    category_title = item['category'].strip()

    # Récupération de l'ObjectId du thème dans la collection 'theme'
    theme = theme_collection.find_one({'title': theme_title})
    if theme:
        theme_id = theme['_id']
    else:
        # Si le thème n'existe pas, vous pouvez choisir de le créer ou de l'ignorer
        print(f"Le thème '{theme_title}' n'existe pas dans la collection 'theme'.")
        continue

    # Ajout de l'ObjectId du thème à la catégorie correspondante
    if category_title not in categories:
        categories[category_title] = {
            'title': category_title,
            'icon': category_title,
            'themes': [theme_id]
        }
    else:
        categories[category_title]['themes'].append(theme_id)

# Insertion des catégories dans la collection 'category'
for category_data in categories.values():
    category_collection.insert_one(category_data)

print("Les catégories ont été insérées avec succès dans la collection 'category'.")
