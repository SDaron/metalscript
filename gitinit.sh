#!/bin/bash
# Indique au système que l'argument qui suit est le programme utilisé pour exécuter ce fichier
# En règle générale, les "#" servent à mettre en commentaire le texte qui suit comme ici
git init
git add .
git commit -m "Initial commit"
echo Hello, who am I talking to?
read -p 'Adresse du dépot: (ex: git@github.com:user/project.git)' depot
git remote add origin $depot
git push -u origin master
