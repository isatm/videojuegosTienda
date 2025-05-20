FROM node:23.11-slim
WORKDIR /app
COPY . .
RUN npm install -g @nestjs/cli && npm install
EXPOSE 3000
CMD ["npm", "run", "start:dev"]