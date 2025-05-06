FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# --- Development Stage ---
FROM base AS development

RUN npm install --save-dev

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# --- Production Stage ---
FROM base AS production

RUN npm run build

RUN npm install -g serve

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]