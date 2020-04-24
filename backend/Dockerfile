FROM python:3

WORKDIR /usr/app/

COPY . .
RUN pip install pipenv
RUN pipenv install --system --deploy --ignore-pipfile

CMD ["python", "manage.py", "runserver"]