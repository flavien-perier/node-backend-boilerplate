# CityFactory

## Commands

Install dependencies:

```bash
npm install
```

Build project:

```bash
npm run build
```

Start tests:

```bash
npm test
```

Start project:

```bash
npm start
```

## Environment variables

- `PORT`: Server port
- `LOG`: Log level
- `SALT`: Password salt
- `REDIS_URL`: Redis url

## Usage

- Create user:

```bash
curl --request POST \
  --url http://127.0.0.1:8080/account \
  --header 'content-type: application/json' \
  --data '{
        "name": "user",
        "password": "password"
    }'
```

- Login:

```bash
curl --request GET \
  --url http://127.0.0.1:8080/account/login \
  --header 'authorization: Basic Og==' \
  --header 'content-type: application/json' \
  --data '{
        "name": "user",
        "password": "password"
    }'
```

- Test app:

```bash
curl --request GET \
  --url http://127.0.0.1:8080/api/ping \
  --header 'authorization: Bearer ********'
```
