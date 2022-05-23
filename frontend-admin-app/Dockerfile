# STEP 1 build static website

FROM node:10.19-alpine as builder
RUN apk update && apk add --no-cache make git

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g @angular/cli

# Copy project files into the docker image
COPY . .

RUN ng build --prod

# STEP 2 build a small nginx image with static website

FROM nginx:alpine

# From 'builder' copy website to default apache public folder

# COPY --from=builder /app/dist/fe /usr/local/apache2/htdocs/
COPY --from=builder /app/dist/fe /usr/share/nginx/html

RUN mkdir /etc/nginx/ssl

EXPOSE 80 443 9000

# CMD apachectl -DFOREGROUND
CMD ["nginx", "-g", "daemon off;"]
