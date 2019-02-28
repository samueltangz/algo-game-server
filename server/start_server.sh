cd server
while ! (mysqladmin ping --host=mysql --user=algo-dev --password=development > /dev/null 2>&1); do
    echo "mysql not yet ready";
    sleep 3;
done;
yarn prepare-db
yarn start
