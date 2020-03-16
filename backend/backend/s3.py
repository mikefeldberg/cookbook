import logging
import boto3
from django.http import JsonResponse, HttpResponseServerError
from botocore.exceptions import ClientError
from datetime import datetime
import uuid


def create_presigned_post(request):
    bucket_name = 'cookbook-test-bucket'
    object_name = 'photo_{}.jpg'.format(uuid.uuid4())
    expiration = 3600

    s3_client = boto3.client('s3')

    try:
        response = s3_client.generate_presigned_post(
            Bucket=bucket_name,
            Key=object_name,
            ExpiresIn=expiration
        )

    except ClientError as e:
        logging.error(e)
        return HttpResponseServerError()

    return JsonResponse(response)
