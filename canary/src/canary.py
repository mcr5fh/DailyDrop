#!/usr/bin/env python
import unirest
import datetime
import canary_constants

print datetime.datetime.now()

base_url = "https://yyh6hsqj4g.execute-api.us-east-1.amazonaws.com/"

POST = "POST"
GET = "GET"
log_body = False
only_report_failures = False

failed_tests = []


def lambda_handler(event, context):
    domain = event['domain']
    api_gw_url = base_url + domain
    for request in canary_constants.INSERT_TESTS:
        try:
            test_endpoint(POST, api_gw_url, request)
        except Exception as e:
            print str(e)

    # GETS
    for request in canary_constants.GET_TESTS:
        test_endpoint(GET, api_gw_url, request)

    if len(failed_tests) > 0:
        # report test failure
        error_output = "Failed tests: "
        for failed in failed_tests:
            error_output += str(failed)
        return (False, error_output)
    return (True, "All tests passed")


def test_endpoint(method, url, request):
    response = ""
    if(method == POST):
        response = unirest.post(url + request["path"],
                                headers={"Accept": "application/json"},
                                params=request["params"])
    elif(method == GET):
        response = unirest.get(url + request["path"])

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
