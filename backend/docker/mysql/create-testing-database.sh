#!/usr/bin/env bash
set -e

mysql --user=root --password="anstrongpass1" <<-EOSQL
CREATE DATABASE IF NOT EXISTS testing;
EOSQL

echo "Testing database created (if it didn't exist)"
