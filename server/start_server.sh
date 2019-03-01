cd server
while ! (mysqladmin ping --host=$MYSQL_HOST --user=$MYSQL_USER --password=$MYSQL_PASSWORD > /dev/null 2>&1); do
    echo "mysql not yet ready";
    sleep 3;
done;
yarn prepare-db
yarn start
