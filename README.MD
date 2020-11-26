# In order to run locally add a path to your hosts file locally
    1. Open code /etc/hosts
    2. At bottom add 127.0.0.1 ticketing.dev
    
# get credentials from gcloud for a kubernetes cluster
    1. run gcloud container clusters get-credentials ticketing-dev 
    2. Now you can go to docker > kubernetes and you can connect to the cluster in gcloud