# Lego-vis

A LEGO data visualizer.

## Dependencies

Install all of these onto your system before proceeding.

- UNIX realpath

## Scripts

Before you can start using this web application, you need to obtain all of the necessary data files.

We created a series of scripts to automatically scrape/download most of the necessary data files and
images from the web. The script downloaded csv and image files from rebrickable.com. However, since
the creation of this application, Rebrickable has changed their website and the schema of their CSV
data, so the download scripts are out-of-date. If they _were_ up-to-date, you would do the following:

### Obsolete script usage

To download all of the data needed for this project, run the following:

```
cd scripts/
./do-all.sh
```

This will create a directory called `scripts/download/`, in which resides all of the csv data
and images needed for this web application. Note that this works on linux systems only. This script 
downloads a _lot_ of images, and could take up to 2-3 hours. Only run this if you can't copy the data 
from someone else. 

Once all of the data is downloaded, copy the `download` directory into `client`.
There is still one more file to generate: `tsne.json`.
To generate this:

* Start up a localhost web server to run the client (see the Client setup section)
* Navigate to `localhost:XXXX/gen-tsne.html`.
* Open up the Javascript console on this page to see the progress logs.
* After running for 1-2 minutes, the `tsne.js` file will be ready, and the page will ask you were
  you would like to save it to.
* Place `tsne.js` in `client/download`.

### Pre-packaged Data

Because the download scripts are obsolete, all of the data (including `tsne.json`) is available
as a Google Drive download. The link is below (you might need to request access):

TODO

Download, unzip, name the directory `download`, and place it in `client`.

## Client setup

First, Make sure that you place the `download` directory  created by running the aforementioned scripts into `client/`.
Start up an http server to see the client web-page. Any server will do. If your running n your local 
machine, probably the easiest way is to `cd` into `client/` and the execute 
`python -m SimpleHTTPServer 8000`. This starts a server on localhost on port `8000`. To access the
content it is serving, go to `http://localhost:8000` in your web-browser.

## Client Files and Directories

* `index.html` - The main homepage of the web application. Load this to see LEGO-vis!
* `gen-tsne.html` - Use to generate `tsne.json`, which is used by the application.
* `download` - the CSV, JSON, and image files used by the application.
* `lib` - Place to keep (mostly js) libraries.
* `style` - Place to keep style (CSS) and image resources.
* `old` - Old code that is probably not necessary to keep around anymore, but we do anyways.
* `vis` - HTML and JS files that show alternate LEGO visualizations.
          At least one of these does not work properly.

## Live

See this live [here](http://apps.benjdd.com/lego-vis/client/)

