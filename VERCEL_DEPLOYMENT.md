# Vercel Deployment Guide

## Files Created for Vercel Deployment

### 1. `vercel.json` - Vercel Configuration
- Configures Vercel to use Node.js runtime
- Routes all requests to `app.js`
- Sets production environment

### 2. `.vercelignore` - Deployment Exclusions
- Excludes development files and sensitive data
- Reduces deployment size

### 3. Updated `package.json`
- Added `build` and `vercel-build` scripts

## Required Environment Variables in Vercel

Configure these environment variables in your Vercel dashboard:

### Database Configuration
```
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASSWORD=your-database-password
```

### JWT Configuration
```
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
```

### Email Configuration (if using password reset)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Node Environment
```
NODE_ENV=production
```

## Database Considerations

**Important**: Since Vercel is serverless, you need an external PostgreSQL database. Consider:

1. **Vercel Postgres** (recommended for simplicity)
2. **Railway** (good free tier)
3. **Supabase** (includes additional features)
4. **PlanetScale** (MySQL alternative)
5. **AWS RDS** (if you need more control)

## Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

## Post-Deployment

After deployment, you'll need to run migrations on your external database:
```bash
# Connect to your external database and run:
npx knex migrate:latest
npx knex seed:run
```

## Notes

- Vercel functions have a 10-second timeout limit
- Database connections should use connection pooling
- Consider adding database connection retry logic for production