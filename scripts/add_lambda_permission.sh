aws lambda add-permission \
--function-name arn:aws:lambda:us-east-1:688722815903:function:RDSApi:$1 \
--source-arn 'arn:aws:execute-api:us-east-1:688722815903:yyh6hsqj4g/*' \
--principal apigateway.amazonaws.com \
--statement-id 'api-gateway-execute' \
 --action 'lambda:InvokeFunction'

