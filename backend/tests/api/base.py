import json
from django.test import RequestFactory
from graphene_django.views import GraphQLView
from django.test import Client
from tests.base import TestCaseBase

req_factory = RequestFactory(SERVER_NAME='localhost')
graphql_resource = GraphQLView.as_view()

class GraphQLTestCaseBase(TestCaseBase):
    @classmethod
    def setUpTestData(cls):
        cls.client = Client()

    def send_query(self, query, variables=None, check_200=True):
        payload = {
            'query': query,
            'variables': variables,
            'operationName': '',
        }

        request = req_factory.post('/example', data=json.dumps(payload), content_type='application/json') #, auth_token=self.jwt)


        resp = graphql_resource(request)
        resp_data = json.loads(resp.content)

        if check_200:
            self.assertOkResponse(resp)

        return resp, resp_data