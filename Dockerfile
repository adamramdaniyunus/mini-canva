# Setup Project
FROM node:18-alpine

# Define working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build ARGS dari github
ARG GOOGLE_CLIENT_SECRET
ARG GOOGLE_CLIENT_ID
ARG NEXTAUTH_SECRET
ARG NODE_ENV
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# lalu export agar bisa dipakai nextjs
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app ./

# Expose application port
EXPOSE 3000
CMD ["npm", "start"]