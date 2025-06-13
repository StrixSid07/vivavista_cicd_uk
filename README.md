# Viva Vista Vacations UK

This is the official repository for Viva Vista Vacations UK, a comprehensive travel booking platform.

## Project Structure

The project is organized into three main components:
- `vivavistauk/` - Main customer-facing website (React)
- `vivavistaukadmin/` - Admin panel for content management
- `vivavistaukbackend/` - Backend API server

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Caching**: Redis
- **Storage**: AWS S3
- **External APIs**: TripAdvisor API

## Live URLs

- Main Site: https://vivavistavacations.co.uk
- Admin Panel: https://admin.vivavistavacations.co.uk
- API: https://api.vivavistavacations.co.uk

## SEO-Friendly URLs Implementation

The platform implements SEO-friendly URLs for deal pages using a hybrid approach:

### URL Structure
- Old format: `/deals/684b3b340e9f84242a4e52ec` (ID-based)
- New format: `/deals/sun-kissed-dalaman-7-nights-of-luxury-leisure` (SEO-friendly)

### Implementation Details

1. **Backend Changes**:
   - Deal model includes a `slug` field generated from the deal title
   - Universal `/deals/:param` endpoint handles both ID and slug-based URLs
   - Automatic slug generation on deal creation/update
   - Slug uniqueness validation

2. **Frontend Integration**:
   - All deal links use SEO-friendly slugs
   - Fallback to ID-based routing if slug not found
   - Automatic redirection from ID-based to slug-based URLs

## Environment Configuration

Create `.env` files in each project directory with the following variables:

```env
# Backend .env
MONGODB_URI=mongodb://localhost:27017/vivavista
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
TRIPADVISOR_API_KEY=your_api_key

# Frontend .env
REACT_APP_API_URL=https://api.vivavistavacations.co.uk
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vivavista_cicd_uk.git
cd vivavista_cicd_uk
```

2. Install dependencies for each component:
```bash
# Backend
cd vivavistaukbackend
npm install

# Frontend
cd ../vivavistauk
npm install

# Admin Panel
cd ../vivavistaukadmin
npm install
```

3. Start development servers:
```bash
# Backend
cd vivavistaukbackend
npm run dev

# Frontend
cd ../vivavistauk
npm start

# Admin Panel
cd ../vivavistaukadmin
npm start
```

## API Endpoints

### Deals
- `GET /deals` - List all deals
- `GET /deals/:param` - Get deal by ID or slug
- `POST /deals` - Create new deal
- `PUT /deals/:id` - Update deal
- `DELETE /deals/:id` - Delete deal

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings/:id` - Get booking details
- `GET /bookings/user/:userId` - Get user bookings

## Deployment

The application is deployed across multiple domains:

1. **Frontend**: Hosted on AWS S3 + CloudFront
2. **Backend**: Running on AWS EC2
3. **Admin Panel**: Separate AWS S3 bucket + CloudFront
4. **Database**: MongoDB Atlas
5. **Caching**: AWS ElastiCache (Redis)

## Admin Access

Contact the system administrator for admin panel credentials. Default admin credentials:
- Username: admin@vivavistavacations.co.uk
- Password: [Contact administrator]

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## Support

For technical support, contact:
- Email: tech@vivavistavacations.co.uk
- Phone: +44 (0) 123 456 7890
