# To start = skaffold dev   
    1. The app is run in gcloud kubernetes
# In order to run locally add a path to your hosts file locally
    1. Open code /etc/hosts
    2. At bottom add 127.0.0.1 ticketing.dev
    
# get credentials from gcloud for a kubernetes cluster
    1. run gcloud container clusters get-credentials ticketing-dev 
    2. Now you can go to docker > kubernetes and you can connect to the cluster in gcloud



# other docker helpers if needed
# CREATE
1. Create pod: kubectle apply -f posts.yaml (after creating run kubectl get pods to see status of pod)

# Update config file
1. Update event-bus.depl.yaml
2. In order to take effect run command kubectl apply -f posts-depl.yaml

# Update all config fiels
1. Update a file in infra/kubernetes
2. kubectl apply -f .

# UPDATE - method 1
1. Make a change to your project code
2. Rebuild the image specify a new version number (docker build -t tylerposts:0.0.5)
3. In the deployment config file (posts-depl.yaml) update the version of the image
4. run the command: kubectl apply -f posts-depl.yaml

# UPDATE - method 2
1. make change to code
2. Build the image from the app's directory
    docker build -t tylerg509/tylerposts:latest .  
3. Push image to docker hub
    docker push tylerg509/tylerposts   
4. Run deployment command
    kubectl rollout restart deployment posts-depl

Run container locally:
    kubectl get services = reveals the 5 digit port that you container is running on

    kubectl describe service posts-srv = get the details of a certain service

    

# Notes
1. A deployment manages one or more pods. You can update all pods through the deployment

