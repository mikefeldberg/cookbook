#!/bin/sh

python manage.py test --settings=backend.settings.testing --keepdb

exec "$@"