## builder

### Setup

Download zip of components, and place them in a "builder" directory.
From appmaker root...:

    wget https://github.com/mozilla/appmaker-components/archive/master.zip
    unzip master.zip
    mv appmaker-components-master builder/appmaker-components
    rm master.zip

### Operation

The builder is activated by the publish route.

It takes an HTML file, similar to the index.html in the parent folder of the
builder folder, and it will generate a directory in `builder/output` with
the contents that could be zipped up and distributed in a store.

So things to note for server infrastructure:

* this setup saves uploaded HTML files in a temp directory. It tries to delete
that temp file when done.
* it generates new folders of content in the `output` directory. Currently it
**does not** clean up those directories.

### Tests

The start of some unit tests are in `test`. They are run with mocha:

    npm install -g mocha
    mocha

Run the mocha command from inside the builder directory.

The suitability of the generated output directory was tested by using the
Firefox OS Simulator and selecting the .webapp file in that generated output
directory to confirm it loaded up correctly.

### TODOs

* Firefox OS simulator says a 128 icon needs to be in the manifest, and in
general, the icons in `builder/style/icons` need to be better.
* While the app seems to load, as in, no 404s, there may be a race condition
with the ceci stuff that only shows up when all the content is local. While
clicking on Submit incremented a number, other things looked off in the UI.
* The `output` artifacts need to get cleaned up.
* It does not actually create a zip file. Hopefully that part is the easier
part of this builder -- take the directory made in `output` and zip up the
contents, doing the zip from inside the `appNNNNNNNNNNNNN-N` directory.
* There is probably a fancy stream way to do this such that the directory
in the `output` directory may not be needed, just stream all the files into
a zip stream that is then delivered to the caller of the API.
* there is no trimming of the contents in appmaker-components/assets, it just
trims out unused components files. The extractAssets/html could be expanded to
parse for img files, other references in the HTML, and an extractAssets/css
could be introduced to scan for `@import` and `url()` references. Similarly,
if there were nested JS dependencies, an extractAssets/js could be used,
probably along with the requirejs optimizer if modules are used, to find those
dependencies.
* The upload/form post could be expanded to accept metadata to insert into the
template.webapp manifest to generate the final webapp manifest.
