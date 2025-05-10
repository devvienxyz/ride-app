FROM node:22.15.0-bookworm-slim AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci --verbose --ignore-scripts

COPY . .

# --- Development Stage ---
FROM base AS development


WORKDIR /app

# Copy deps and source from build stage
COPY --from=base /app /app

RUN npm install --save-dev --verbose

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# --- Production Stage ---
FROM base AS production

WORKDIR /app

# Copy built source from base stage
COPY --from=base /app /app

RUN npm run build --verbose

RUN npm install -g serve

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]