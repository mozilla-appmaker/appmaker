PORT=2003
SERVER=162.243.75.232
echo "appmaker.app_published 400 `date +%s`" | nc ${SERVER} ${PORT};
