import os
from imgix import UrlBuilder

IMGIX_TOKEN = os.getenv("IMGIX_TOKEN")

ub = UrlBuilder("feldbergscookbook.imgix.net", sign_key=IMGIX_TOKEN, include_library_param=False)