# HelloLater

# create message
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{"name" : "joe", "send_at" : "December 17, 3995 03:24:00", "address": "joe@joe.gov"}' http://localhost:5000

# list messages
curl -H "Accept: application/json" -H "Content-Type: application/json" http://localhost:5000
