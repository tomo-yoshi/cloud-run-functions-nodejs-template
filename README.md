# Cloud Run Function Template

This is a template for Google Cloud Run functions using Node.js and TypeScript, following GitHub Flow for development.

## Features

- TypeScript support
- Local development environment
- Automated testing with Jest
- CI/CD with GitHub Actions
- PR-specific deployments
- Production deployment on main branch

## Prerequisites

- Node.js 22+
- yarn
- Google Cloud SDK
- GitHub account

## Setup

1. Clone this repository
2. Install dependencies: `yarn install`
3. Set up Google Cloud credentials
4. Configure GitHub repository secrets:
   - `GCP_SA_KEY`: Google Cloud service account key (JSON)
   - `CLOUD_RUN_REGION`: Your Cloud Run region (e.g., us-central1)

## Development Workflow

### Local Development

```bash
# Start the function locally
yarn dev
```


The function will be available at http://localhost:8080

### GitHub Flow

1. Create a feature branch from `main`
2. Make your changes
3. Open a Pull Request to `main`
4. GitHub Actions will automatically deploy a unique instance for your PR
5. Review, test, and merge the PR
6. GitHub Actions will deploy to production when merged to `main`

## Testing

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch
```

## Deployment

Deployments are handled automatically by GitHub Actions:

- PR deployments: A unique instance is created for each PR
- Production: Deployed when changes are merged to the main branch

# Setting up Google Cloud

To make this template work, you'll need to set up your Google Cloud environment. Follow these step-by-step instructions:

## 1. Create a Google Cloud project

```bash
# Create a new Google Cloud project
gcloud projects create PROJECT_ID --name="PROJECT_NAME"

# Set the project as your default
gcloud config set project PROJECT_ID
```

Replace `PROJECT_ID` and `PROJECT_NAME` with your desired values.

## 2. Enable the required APIs

```bash
# Enable the Cloud Run API
gcloud services enable run.googleapis.com

# Enable the Cloud Functions API
gcloud services enable cloudfunctions.googleapis.com

# Enable the IAM API
gcloud services enable iam.googleapis.com
```

## 3. Create a service account and key

```bash
# Create a service account for GitHub Actions
gcloud iam service-accounts create github-actions-sa \
--display-name="GitHub Actions Service Account"

# Grant the necessary permissions to the service account
gcloud projects add-iam-policy-binding PROJECT_ID \
--member="serviceAccount:github-actions-sa@PROJECT_ID.iam.gserviceaccount.com" \
--role="roles/run.admin"
gcloud projects add-iam-policy-binding PROJECT_ID \
--member="serviceAccount:github-actions-sa@PROJECT_ID.iam.gserviceaccount.com" \
--role="roles/iam.serviceAccountUser"
gcloud projects add-iam-policy-binding PROJECT_ID \
--member="serviceAccount:github-actions-sa@PROJECT_ID.iam.gserviceaccount.com" \
--role="roles/storage.admin"

# Create and download the service account key
gcloud iam service-accounts keys create key.json \
--iam-account=github-actions-sa@PROJECT_ID.iam.gserviceaccount.com
```

## 4. Set up GitHub Secrets

Add the following secrets to your GitHub repository:

1. `GCP_SA_KEY`: The entire contents of the `key.json` file
2. `CLOUD_RUN_REGION`: Your preferred Cloud Run region (e.g., `us-central1`)

## Local Development

For local development, you can use the `yarn dev` command which will start the function locally using the Functions Framework:

```bash
# Install dependencies
yarn install

# Start local development server
yarn dev
```

The function will be available at http://localhost:8080

## GitHub Flow Implementation

This template implements GitHub Flow as follows:

1. Developers create feature branches from `main`
   ```bash
   git checkout -b feature/new-feature
   ```

2. When a PR is opened, GitHub Actions automatically deploys a unique instance of the function
   ```bash
   git add .
   git commit -m "Add new feature"
   git push -u origin feature/new-feature
   # Then create a PR on GitHub
   ```

3. The PR can be reviewed and tested using the unique deployment URL (provided in the PR comments)

4. When the PR is merged to `main`, GitHub Actions automatically deploys to production
   ```bash
   # After PR is approved and merged
   git checkout main
   git pull
   ```

5. Each PR gets its own isolated environment for testing

This setup ensures that:
- Each PR gets a unique function instance for testing
- Production is deployed automatically when new commits are detected on the main branch
- Local development is supported
- The entire CI/CD flow is managed in GitHub Actions