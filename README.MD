# 1. Commit les changements
git add .
git commit -m "message"

# 2. Pousser vers GitHub (optionnel)
git push origin main

# 3. Pousser vers Gandi (branche master !)
git push gandi main:master

# 4. Déclencher le déploiement sur le serveur
ssh eee0a83c-7ce1-11f0-bd2b-00163eada87b@git.sd6.gpaas.net deploy default.git