#!/bin/bash
ng build
#docker build -t controlpage-frontend .
docker build -t gitlab-registry.fischerserver.eu/controlpage/controlpage-releases/frontend:latest .
docker push gitlab-registry.fischerserver.eu/controlpage/controlpage-releases/frontend:latest
