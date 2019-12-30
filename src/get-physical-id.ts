import CloudFormation from "aws-sdk/clients/cloudformation";
import "source-map-support/register";

const cloudFormation = new CloudFormation();

(async function foo() {
  const result = await cloudFormation.listStackResources({
    StackName: "coffeeshop"
  }).promise();
  const matches = result.StackResourceSummaries
    .filter(_ => _.ResourceType === "AWS::S3::Bucket");
  console.log(matches[0].PhysicalResourceId);
})().catch(error => {
  throw error;
});
