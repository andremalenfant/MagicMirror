#!/bin/bash
source env/bin/activate
gimme-iphotos -r -u andre@andremalenfant.com -p Lafuite2012 -d ~/Pictures/iphotos
for filename in /home/pi/Pictures/iphotos/*.HEIC; do
	name=${filename##*/}
	base=${name%.HEIC}.jpg
	#secho ${base}
	if ! [ -f /home/pi/Pictures/${base}  ]; then
		 heic-to-jpg -s ${filename} --keep
		 mv /home/pi/Pictures/iphotos/${base} /home/pi/Pictures/
	fi
done
cp /home/pi/Pictures/iphotos/*.jpg /home/pi/Pictures/
for filename in /home/pi/Pictures/*.jpg; do
	name=${filename##*/}
	base=${name%.jpg}.HEIC
	#echo ${base}
	if ! [ -f /home/pi/Pictures/iphotos/${base}  ]; then
		if ! [ -f /home/pi/Pictures/iphotos/${name}  ]; then
			rm ${filename}
		fi
	fi
done
