all: \
	js/bundle.js \
	js/bundle.min.js

js/bundle.js: src/index-browserify.js
	node_modules/.bin/browserify $< > $@

js/%.min.js: js/%.js
	node_modules/.bin/uglifyjs $< > $@

clean:
	rm -f js/bundle*.js
