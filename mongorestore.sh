#!/bin/sh
 
#
# Daniele Brugnara 
#
# usage:
# appname directory
#

read mongo_auth <<< $(meteor mongo $1.meteor.com --url)
 
dbname=`echo $mongo_auth | awk '{split($0,array,"/")} END{print array[4]}'`
ar=`echo $mongo_auth | tr '//' '\n' | grep client | tr ':' '\n' | head -n 2 | tr '@' '\n' | tr '\n' ':'`
 
username=`echo $ar | awk '{split($0,array,":")} END{print array[1]}'`
password=`echo $ar | awk '{split($0,array,":")} END{print array[2]}'`
host=`echo $ar | awk '{split($0,array,":")} END{print array[3]}'`

#echo $host
#echo $username
#echo $password
#echo $dbname

../../../Downloads/mongodb-osx-x86_64-2.6.6/bin/mongorestore -u $username  -p $password  -h $host --port 27017 -db $dbname $2