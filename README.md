## OPENMUSIC APP Queue Consumer

### Usage
- Clone
```shell
git clone git@github.com:PetengDedet/openmusic-api.git
```

- Set ENV vars
```shell
cp .env.example .env
```

Note: Pastikan semua environment terisi dengan benar dan sesuai
```HOST=localhost
PORT=5000

PGUSER=postgres
PGHOST=localhost
PGPASSWORD=
PGDATABASE=openmusic_api
PGPORT=5432

ACCESS_TOKEN_KEY=2021070920410640d3085a57c6ab68fb7f0e3f09648442
REFRESH_TOKEN_KEY=2021070920410640d3085a57c6ab68fb7f0e3f09648442
ACCESS_TOKEN_AGE=1800

RABBITMQ_SERVER=amqp://localhost
PLAYLIST_CHANNEL=export:playlists

REDIS_SERVER=localhost
PLAYLIST_CACHE_EXP=3600
PLAYLIST_CACHE_PREFIX=playlists:
```


- Install Dependencies
```shell
npm install
```

- Run
```shell
npm run start-dev
```
