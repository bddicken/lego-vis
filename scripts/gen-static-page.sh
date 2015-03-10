#!/bin/bash 

#
# Consolidte images into a single dir
#

# We want the script to fail on any error
set -o errexit
set -o nounset

wget https://raw.githubusercontent.com/tuupola/jquery_lazyload/master/jquery.lazyload.js

echo "<html>" >> index.html
echo "<head>" >> index.html
echo "<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js\"></script>" >> index.html
echo "<script type=\"text/javascript\" src=\"jquery.lazyload.js\"></script>" >> index.html
echo "</head>" >> index.html
echo "<body style=\"width:800px;margin-left:auto;margin-right:auto;text-align:center;\">" >> index.html

IMG_DIR_NAMES=$(find . | grep png)
for DIR in ${IMG_DIR_NAMES}; do
    echo "<img class=\"lazy\" data-original=\"${DIR}\" width=\"100\" height=\"75\">" >> index.html
done

echo "</body>" >> index.html
echo "<script>\$(\"img.lazy\").lazyload();</script>" >> index.html
echo "</html>" >> index.html

echo "DONE!"

