Lego data visualizer.

## Scripts

To download all of the data needed for this project, run the following:

```
cd scripts/
./do-all.sh
```
This will create a directory called `scriipts/downloads/`, in which residesl all of the csv data
and images needed for this web application. Note that this works on linux systems only. This scipt 
downloads a _lot_ of images, and could take up to 2-3 hours. Only run this if you can copy the data 
from someone else (Ben!). 

## Client setup

First, Make sure that you place the `download` directory in `client/`.
Start up a server to server the client webpage. Any server will do. If your running n your local 
machine, probably the easiest way is to `cd` into `client/` and the execute 
`python -m SimpleHTTPServer 8000`. This starts a server on localhost on port `8000`. To access the
content it is serving, go to `http://localhost:8000` in your web-browser.

## Server

Setting up the server requires several steps. First and foremost, you must have `nodejs`, `npm` 
(Node Package Manager), and `mongodb` installed on your system. Once youve done so, go through 
the following steps to get the server up-and-running on you rlocal machine.

- `cd` into `server/`
- Run `npm install` (installs all node library dependencies)
- Ensure that mongodb is running on your system. If it is not already running on your system, 
  open up a new terminal and run `mongod &` (for linux). 
- Load all of the lego data using the following command:

  ```
  nodejs load_data.js -s ../client/download/data/sets.csv -p ../client/download/data/pieces.csv -c ../client/download/data/colors.csv -e ../client/download/data/set_pieces.csv
  ```

  Once the script is finished processing all the data, exit.

- Start the server by running `nodejs server.js`.

Once you've done all this, navigate to `http://localhost:8000` in your web-browser, and you
should see the website.
