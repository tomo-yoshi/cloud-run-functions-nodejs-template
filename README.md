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
   - `WIF_PROVIDER`: Workload Identity Federation provider
   - `SERVICE_ACCOUNT`: Google Cloud service account email

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

## 3. Create a service account

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
--role="roles/cloudbuild.builds.editor"
```

## 4. Set up Workload Identity Federation for GitHub Actions

```bash
# Create a Workload Identity Pool
gcloud iam workload-identity-pools create "github-pool" \
--location="global" \
--display-name="GitHub Actions Pool"

# Get the Workload Identity Pool ID
export WORKLOAD_IDENTITY_POOL_ID=$(gcloud iam workload-identity-pools describe "github-pool" \
--location="global" \
--format="value(name)")

# Create a Workload Identity Provider in the pool
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
--location="global" \
--workload-identity-pool="github-pool" \
--display-name="GitHub provider" \
--attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
--issuer-uri="https://token.actions.githubusercontent.com"

# Get the Workload Identity Provider resource name
export WORKLOAD_PROVIDER=$(gcloud iam workload-identity-pools providers describe "github-provider" \
--location="global" \
--workload-identity-pool="github-pool" \
--format="value(name)")

# Allow authentications from the GitHub repository to impersonate the service account
gcloud iam service-accounts add-iam-policy-binding \
"github-actions-sa@PROJECT_ID.iam.gserviceaccount.com" \
--role="roles/iam.workloadIdentityUser" \
--member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/GITHUB_USERNAME/REPO_NAME"
```

Replace `PROJECT_ID`, `GITHUB_USERNAME`, and `REPO_NAME` with your values.

```bash
# Get the Workload Identity Provider resource name
echo $WORKLOAD_PROVIDER

# Get the service account email
echo "github-actions-sa@PROJECT_ID.iam.gserviceaccount.com"
```

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