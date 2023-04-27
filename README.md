# 📝 Polynotes

A productivity and organization tool platform.

- Frontend: **React** + Emotion + ViteJS (swc)
- Backend: **Rust** + **Axum** + Mongodb driver
- Database: **MongoDB sharded cluster**

## How to start (dev)

1. **Fill [env file](.env)**

```shell
$ cp .env.dist .env
$ vim .env
```

Complete:

-`MONGO_USER` & `MONGO_PASSWORD`, it will be your credentials
to authenticate you to the mongo cluster
- The `SMTP_*` variables for the mail server (to send emails)
- `BACKEND_BASE_API` with something like `http://localhost:3001/api/v1`
- `FRONTEND_HOST` with `http://localhost:5173` (default port for vite)

2. **Start mongo cluster**

```shell
$ ./mongo/up.sh
```

If you are too lazy to remove all the volumes from the mongodbs,
I have created a script to remove them.

-> [here `destruct.sh`](./mongo/destruct.sh)

3. **Start [backend](./backend)**

```shell
$ cd backend
$ cargo r
```

4. **Start [frontend](./frontend)**

```shell
$ cd ../frontend
$ yarn dev
```

5. Go to [localhost:5173](http://localhost:5173) (or whichever you choose)

## About

Read my [Technical Architecture Document](https://github.com/lapsus-ord/polynotes/wiki).

## Documentation

- [Deploy a Sharded Cluster - MongoDB Manual](https://www.mongodb.com/docs/v6.0/tutorial/deploy-shard-cluster/)
- [Configuration File Options - MongoDB Manual](https://www.mongodb.com/docs/manual/reference/configuration-options)
