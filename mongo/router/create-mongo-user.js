use admin

const user = process.env.MONGO_USER ?? 'root';
const pwd = process.env.MONGO_PASSWORD ?? 'root';

db.createUser({
    user,
    pwd,
    roles: ['root'],
});
