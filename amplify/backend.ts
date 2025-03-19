import { defineBackend, secret } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { defineFunction } from '@aws-amplify/backend-function';

const stripeCheckout = defineFunction({
  name: "stripeCheckout",
  entry: "./functions/stripeCheckout.ts",
  environment: {
    STRIPE_SECRET_KEY: secret("STRIPE_SECRET_KEY"),
  },
});

const stripeWebhook = defineFunction({
  name: "stripeWebhook",
  entry: "./functions/stripeWebhook.ts",
  environment: {
    STRIPE_SECRET_KEY: secret("STRIPE_SECRET_KEY"),
    STRIPE_WEBHOOK_SECRET: secret("STRIPE_WEBHOOK_SECRET"),
  },
})

const backend = defineBackend({
  auth,
  data,
  stripeCheckout,
  stripeWebhook,
});

const { groups } = backend.auth.resources

// https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam.IRole.html
groups["ADMINS"].role