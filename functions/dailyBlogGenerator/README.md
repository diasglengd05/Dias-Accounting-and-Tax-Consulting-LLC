# UAE Financial Trends 24-Hour Blog Generator Cloud Function

This Google Cloud Function autonomously generates SEO-optimized, schema-grounded blog articles for Dias Accounting & Tax Consulting every 24 hours.

## Architecture

1. **Trigger**: Google Cloud Scheduler invokes the HTTP endpoint every 24 hours (Cron: `0 6 * * *` at 06:00 GST).
2. **Search Grounding**: Queries Google Search Grounding to identify today's active UAE financial, corporate tax, and regulatory updates (FTA announcements, Cabinet Decisions, QFZP rules).
3. **Synthesis Engine**: Uses `gemini-3.8-flash` to author authoritative blog posts adhering strictly to Glen Dias's professional voice.
4. **Schema Injection**: Generates Google Search JSON-LD schema markup (`Schema.org/BlogPosting`).
5. **Persistence**: Saves the article directly to Google Cloud Firestore in the `/blog_posts` collection.

## Deployment Options

### Option A: Use the Integrated Endpoint (Zero Setup Required)
Your app is already running an integrated HTTP trigger endpoint:
```
POST https://YOUR-APP-URL/api/cloud-functions/daily-blog-generator
```

To schedule this in Google Cloud Scheduler:
```bash
gcloud scheduler jobs create http uae-daily-blog-trigger \
    --schedule="0 6 * * *" \
    --time-zone="Asia/Dubai" \
    --uri="https://YOUR-APP-URL/api/cloud-functions/daily-blog-generator" \
    --http-method=POST \
    --headers="Content-Type=application/json" \
    --oidc-service-account-email="YOUR_SERVICE_ACCOUNT@YOUR_PROJECT.iam.gserviceaccount.com"
```

### Option B: Deploy as a Standalone Google Cloud Function (2nd Gen)
Navigate to `functions/dailyBlogGenerator` and run:

```bash
gcloud functions deploy dailyBlogGenerator \
    --gen2 \
    --runtime=nodejs20 \
    --region=europe-west3 \
    --source=. \
    --entry-point=dailyBlogGenerator \
    --trigger-http \
    --allow-unauthenticated=false \
    --set-env-vars=GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

Then attach Cloud Scheduler:
```bash
gcloud scheduler jobs create http uae-daily-blog-function-cron \
    --schedule="0 6 * * *" \
    --time-zone="Asia/Dubai" \
    --uri="https://europe-west3-YOUR_PROJECT.cloudfunctions.net/dailyBlogGenerator" \
    --http-method=POST \
    --oidc-service-account-email="YOUR_SERVICE_ACCOUNT@YOUR_PROJECT.iam.gserviceaccount.com"
```
