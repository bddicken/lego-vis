Lego data visualizer.

## Dependencies

- realpath

Install all of these onto your system before proceeding.

## Scripts

To download all of the data needed for this project, run the following:

```
cd scripts/
./do-all.sh
```

This will create a directory called `scriipts/downloads/`, in which resides all of the csv data
and images needed for this web application. Note that this works on linux systems only. This script 
downloads a _lot_ of images, and could take up to 2-3 hours. Only run this if you can't copy the data 
from someone else. 

TODO:  add more details here.

## Client setup

First, Make sure that you place the `download` directory  created by running the aforementioned scripts into `client/`.
Start up an http server to see the client webpage. Any server will do. If your running n your local 
machine, probably the easiest way is to `cd` into `client/` and the execute 
`python -m SimpleHTTPServer 8000`. This starts a server on localhost on port `8000`. To access the
content it is serving, go to `http://localhost:8000` in your web-browser.

## Live

See this live [here](http://benjdd.com/projects/lego-vis/client/)

