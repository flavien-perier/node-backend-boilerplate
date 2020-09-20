# Node Backend Boilerplate

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
docker-compose up -d
docker logs -f app-test
```

Start project:

```bash
npm start
```

## Environment variables

- `NODE_ID`: Node identifier (random if empty)
- `PORT`: Server port
- `LOG`: Log level
- `SALT`: Password salt
- `JWT_TOKEN`: JWT token
- `REDIS_URL`: Redis url
- `POSTGRES_URL`: PostgreSQL url

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
  --header 'authorization: Basic ZmxhdmllbjpwYXNzd29yZA==' \
  --header 'content-type: application/json'
```

- Test app:

```bash
curl --request GET \
  --url http://127.0.0.1:8080/api/ping \
  --header 'authorization: Bearer ********'
```
