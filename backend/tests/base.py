from django.test import TestCase

class TestCaseBase(TestCase):
    def assertOkResponse(self, response):
        self.assertGreaterEqual(response.status_code, 200,
                                'Expected an ok status code, but response code was {}'.format(response.status_code))
        self.assertLess(response.status_code, 300,
                        'Expected an ok status code, but response code was {}'.format(response.status_code))