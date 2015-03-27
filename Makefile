scss ?= sass/public_analytics.css.scss
css ?= css/public_analytics.css

all: styles

styles:
	sass $(scss):$(css)

watch:
	sass --watch $(scss):$(css)

serve:
	make all && python -m SimpleHTTPServer 8000

clean:
	rm -f $(css)
