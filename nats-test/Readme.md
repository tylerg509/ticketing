This service sits outside of the kubernetes cluster that the rest of the app is in

1. Need to enable port forwarding to connect. Otherwise will receive could not connect to server: error: connect econnrefused
2. run kubectl get pods to get all pods in the cluster
3. find nats-depl
4. run kubectl port-forward nats-depl-XXXXXXX 4222:4222 to set up port forwarding