# To start = skaffold dev   
    1. The app is run in gcloud kubernetes or run locally using docker
    2. If there are connection errors when running skaffold dev then you need to enable port forwarding within nats-test. See readme for nats-test
    3. Note that the auth deployment did not succeed when starting the project from scratch on a computer that never had the container before. In this case navigate to auth directory > type "docker build -t tylerg509/auth:latest ."
# In order to run locally add a path to your hosts file locally
    1. run sudo nano /etc/hosts
    2. At bottom add 127.0.0.1 ticketing.dev = if running locally
    3. At bottom add 34.94.77.30 ticketing.dev = this is the load balancer address - one that this project once set up in google cloud
    
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

# Create new project
1. After creating a new project such as orders project
2. Go into the directory where there should be a docker file
3. The build docker     docker build -t tylerg509/tylerposts:latest .  
4. Docker push tylerg509/tylerposts
    - you might have to login = docker login
5. Then create yaml-depl file
6. Then update skaffold.yaml with the new project
7. Then skaffold dev to run the project and should work without error. If error try shut down skaffold and restart
8. Update ingress-srv.yaml with routing rules


# Notes
1. A deployment manages one or more pods. You can update all pods through the deployment

# The kubernetes pods used this command to create a jwt secret for signing jwt
1. kubectl create secret generic jwt-secret --from-literal=JWT_KEY={INSERT SECRET HERE AND DO NOT USE CURLY BRACE} 
- you can use whatever secret you decide 
2. use kubectl get secrets to show secrets in your env


# Dealing with cross namespace communication
1. "kubectl get namespace" - all namespaces within the kubernes cluser
    By default you are working in the defualt namespace
2. For ex. kubectl get services - returns all services in the default namespace
    There are other services within the cluster under namespaces other than the default namespace
3. kubectl get services -n ingress-nginx will show the details services within the nginx namespace.
4. This is how we determined this base path for server side rendering
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',


# skaffold dev does not start project = maybe nginx issue
1. kubectl get namespace
2. to view logs $ kubectl get pods -n <namespace-of-ingress-controller>
3. $ kubectl logs -n <namespace> nginx-ingress-controller-67956bf89d-fv58j

# first time starting app you need to deploy nginx manually - if nginx is not created in a pod the app will not start when visiting ticketing.dev
# if you were to ever start a new project using nginx you would also need to do this
1. navigate to infra/k8s
2. navigate to https://kubernetes.github.io/ingress-nginx/deploy/#provider-specific-steps and follow the install step to install nginx within the cluster
3. If this is first time setting up you need to build out the ingress-srv file to deploy the ingress controller
4. kubectle apply -f ingress-srv.yaml
5. If you are using a custom domain like ticketing.dev make sure to add to the hosts file
    see the above instructions on adding ticketing.dev to host file locally