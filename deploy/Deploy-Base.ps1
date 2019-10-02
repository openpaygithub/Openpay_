$artifactsBucket = $(aws cloudformation list-exports --query "Exports[?Name=='ArtifactsBucket'].Value" --no-paginate --output text)

aws cloudformation package `
    --template-file "$PSScriptRoot/base/master.yaml" `
    --s3-bucket $artifactsBucket `
    --s3-prefix OpenpayWeb-Base `
    --output-template-file "$PSScriptRoot/base/packaged-master.yaml"

aws cloudformation deploy `
    --template-file "$PSScriptRoot/base/packaged-master.yaml" `
    --stack-name OpenpayWeb-Base `
    --capabilities CAPABILITY_NAMED_IAM `
    --tags project=OpenpayWeb