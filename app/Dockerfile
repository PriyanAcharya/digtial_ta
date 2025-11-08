
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm i || true
COPY . .
RUN npx prisma generate && npm run build
ENV PORT=3000
EXPOSE 3000
CMD ["npm","start"]
