## OPENMUSIC APP Queue Consumer

### Usage
- Clone
```shell
git clone git@github.com:PetengDedet/openmusicapp_consumer.git
```

- Set ENV vars
```shell
cp .env.example .env
```

Note: Pastikan semua environment terisi dengan benar dan sesuai
```
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=
PGDATABASE=
PGPORT=5432

MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_ADDRESS=
MAIL_PASSWORD=

RABBITMQ_SERVER=amqp://localhost
PLAYLIST_CHANNEL=export:playlists
```


- Install Dependencies
```shell
npm install
```

- Run
```shell
npm run start-dev
```
