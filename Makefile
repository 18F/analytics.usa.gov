SASS_DIR=sass
CSS_DIR=css
scss ?= $(SASS_DIR)/public_analytics.css.scss
css ?= $(CSS_DIR)/public_analytics.css

# These targets don't actually build a file.
.PHONY: all watch clean

all: $(css)

$(CSS_DIR)/%.css: $(SASS_DIR)/%.css.scss
	sass $<:$@

watch:
	sass --watch $(scss):$(css)

clean:
	rm -f $(css)
