import { CfnCloudFrontOriginAccessIdentity, CloudFrontWebDistribution, SecurityPolicyProtocol, SSLMethod, OriginProtocolPolicy } from "@aws-cdk/aws-cloudfront";
import { CanonicalUserPrincipal } from "@aws-cdk/aws-iam";
import { Bucket } from "@aws-cdk/aws-s3";
import { App, Construct, RemovalPolicy, Stack, StackProps } from "@aws-cdk/core";

class WebsiteStack extends Stack {
  constructor(scope: Construct, name: string, props: StackProps) {
    super(scope, name, props);

    const content = new Bucket(this, "Content", {
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html"
    });

    new CloudFrontWebDistribution(this, "Website", {
      comment: process.env.npm_config_domain_name,
      originConfigs: [{
        behaviors: [{ isDefaultBehavior: true }],
        customOriginSource: {
          originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
          domainName: content.bucketWebsiteDomainName,
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
