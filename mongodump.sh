#!/bin/sh
 
#
# Daniele Brugnara 
#
# usage:
# meteor mongo xyz.meteor.com --url | ./do.sh
#

read mongo_auth <<< $(meteor mongo $1.meteor.com --url)
 
dbname=`echo $mongo_auth | awk '{split($0,array,"/")} END{print array[4]}'`
ar=`echo $mongo_auth | tr '//' '\n' | grep client | tr ':' '\n' | head -n 2 | tr '@' '\n' | tr '\n' ':'`
 
username=`echo $ar | awk '{split($0,array,":")} END{print array[1]}'`
password=`echo $ar | awk '{split($0,array,":")} END{print array[2]}'`
host=`echo $ar | awk '{split($0,array,":")} END{print array[3]}'`
DATE=`date +%Y%m%d_%H%M%S`

#echo $host
#echo $username
#echo $password
#echo $dbname
#echo $DATE

../../../Downloads/mongodb-osx-x86_64-2.6.6/bin/mongodump -h $host --port 27017 --username $username --password $password -d $dbname -o meteor/dump_$dbname.$DATE