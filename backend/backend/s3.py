
import os
import logging
import boto3
from django.http import JsonResponse, HttpResponseServerError
from botocore.exceptions import ClientError
from datetime import datetime
import ulid

BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET')
DEFAULT_EXPIRATION = 3600

def create_presigned_post(request, extension):
    if extension == 'jpeg':
        extension = 'jpg'

    from IPython import embed; embed()

    s3_client = boto3.client('s3')
    object_name = 'photo_{}.{}'.format(ulid.new(), extension)

    try:
        response = s3_client.generate_presigned_post(
            Bucket=BUCKET_NAME,
            Key=object_name,
            ExpiresIn=DEFAULT_EXPIRATION,
        )

    except ClientError as e:
        logging.error(e)
        return HttpResponseServerError()

    return JsonResponse(response)

def create_presigned_url(object_name):
    s3_client = boto3.client('s3')

    try:
        response = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': BUCKET_NAME,
                'Key': object_name
            },
            ExpiresIn=DEFAULT_EXPIRATION
        )
    except ClientError as e:
        logging.error(e)
        return None

    return response
