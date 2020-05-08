FROM python:3

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
COPY Pipfile Pipfile.lock /usr/src/app/
RUN pip install pipenv && pipenv install --system

COPY . /usr/src/app/
