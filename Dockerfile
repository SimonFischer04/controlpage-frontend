FROM nginx:latest
COPY dist/controlpage-frontend /usr/share/nginx/html
EXPOSE 80
