FROM python:3.7-slim-buster
WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
COPY Pipfile Pipfile.lock /usr/src/app/
RUN pip install pipenv && pipenv install --system
COPY . /usr/src/app/

ENTRYPOINT ["gunicorn"]
CMD ["backend.wsgi:application", "--bind", "0.0.0.0:8000"]