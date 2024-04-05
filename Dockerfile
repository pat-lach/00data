FROM nginx:alpine-slim

COPY dockerConfig/install.sh /install.sh
RUN /install.sh
COPY WebSite /usr/share/nginx/html/
