#!/usr/bin/env python
import unirest
import datetime
import canary_constants

print datetime.datetime.now()

base_url = "https://yyh6hsqj4g.execute-api.us-east-1.amazonaws.com/Beta"

POST = "POST"
GET = "GET"
# PUT = "PUT"
# insert_group_path = "/v1/groups"
log_body = False
only_report_failures = False

failed_tests = []


def test_endpoint(method, request):
    response = ""
    if(method == POST):
        response = unirest.post(base_url + request["path"],
                                headers={"Accept": "application/json"},
                                params=request["params"])
    elif(method == GET):
        response = unirest.get(base_url + request["path"])

    # We want to make sure we get some sort of 200 back
    print "-----------------------------------------------------------------------"
    if(response.code / 2 != 100):
        print "ERROR: Recieved %s for a %s request to %s" % (str(response.code), method, request["path"])
        failed_tests.append({"req": request, "res": str(response.body)})
    elif(not only_report_failures):
        print "SUCCESS: Recieved %s for a %s request to %s" % (str(response.code), method, request["path"])
    if log_body:
        print "Response body: " + str(response.body)
    print "-----------------------------------------------------------------------"


for request in canary_constants.INSERT_TESTS:
    try:
        test_endpoint(POST, request)
    except Exception as e:
        print str(e)

# GETS
for request in canary_constants.GET_TESTS:
    test_endpoint(GET, request)
print "Failed tests: "
for failed in failed_tests:
    print(str(failed))
