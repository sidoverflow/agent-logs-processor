#!/bin/bash
cd public
file_name=$1
unzip $file_name
folder_name=${file_name%.*}
cd $folder_name
sed -i '1d;$d' *
zip processed_logs *
mv processed_logs.zip ../
