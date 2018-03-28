import boto3

apiClient = boto3.client('apigateway')
lambdaClient = boto3.client('lambda')

lambda_name = "arn:aws:lambda:us-east-1:688722815903:function:RDSApi:1"

response = apiClient.get_resources(
    restApiId='yyh6hsqj4g',
    limit=123
)


def add_permission(source_arn):
    #
    #"AWS:SourceArn": "arn:aws:execute-api:us-east-1:688722815903:yyh6hsqj4g/*/GET/v1/groups/*/info-sorted"

    response = client.add_permission(
        FunctionName=lambda_name,
        StatementId=source_arn + '1',
        Action='lambda:InvokeFunction',
        Principal='apigateway.amazonaws.com',
        SourceArn="",
        SourceAccount='string',
        EventSourceToken='string',
        Qualifier='string',
        RevisionId='string'
    )


print response['items'][0]

for item in response['items']:
    path = item['path']
    print path
