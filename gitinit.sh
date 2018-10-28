#!/bin/bash
# Indique au système que l'argument qui suit est le programme utilisé pour exécuter ce fichier
# En règle générale, les "#" servent à mettre en commentaire le texte qui suit comme ici
git init
git add .
git commit -m "Initial commit"
echo Hello, who am I talking to?

read -p "Do you want to add a remote origin?" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  read -p 'Repository URL: (ex: git@github.com:user/project.git)' url
  git remote add origin $url
  git push -u origin master
fi
