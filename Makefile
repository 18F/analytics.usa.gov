scss ?= sass/public_analytics.css.scss
css ?= css/public_analytics.css

all: styles

styles:
	sass $(scss):$(css)

watch:
	sass --watch $(scss):$(css)

clean:
	rm -f $(css)
