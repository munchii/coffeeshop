import { CfnCloudFrontOriginAccessIdentity, CloudFrontWebDistribution, SecurityPolicyProtocol, SSLMethod } from "@aws-cdk/aws-cloudfront";
import { CanonicalUserPrincipal } from "@aws-cdk/aws-iam";
import { Bucket } from "@aws-cdk/aws-s3";
import { App, Construct, RemovalPolicy, Stack, StackProps } from "@aws-cdk/core";

class WebsiteStack extends Stack {
  constructor(scope: Construct, name: string, props: StackProps) {
    super(scope, name, props);

    // https://github.com/aws/aws-cdk/issues/941
    const contentAccessIdentity = new CfnCloudFrontOriginAccessIdentity(this, "ContentAccessIdentity", {
      cloudFrontOriginAccessIdentityConfig: {
        comment: "coffeeshop"
      }
    });

    const content = new Bucket(this, "Content", {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    content.grantRead(new CanonicalUserPrincipal(contentAccessIdentity.getAtt("S3CanonicalUserId").toString()));

    new CloudFrontWebDistribution(this, "Website", {
      comment: process.env.npm_config_domain_name,
      originConfigs: [{
        behaviors: [{ isDefaultBehavior: true }],
        s3OriginSource: {
          s3BucketSource: content,
          originAccessIdentityId: contentAccessIdentity.ref
        }
      }],
      aliasConfiguration: {
        names: ["coffeeshop.munchii.com"],
        acmCertRef: `arn:aws:acm:us-east-1:${this.account}:certificate/9b26d098-7f8a-46d8-be35-fc0e21cf1cf7`
      }
    });
  }
}

const app = new App();
new WebsiteStack(app, "coffeeshop", {
  env: {
    region: "us-west-2"
  }
});
app.synth();
