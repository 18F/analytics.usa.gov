
## Projects
* [First minimum viable project](https://github.com/GSA/public_analytics/blob/master/MVP-1.md)

## Contributing

### Building the Stylesheets
1. Install [Sass](http://sass-lang.com/):

    ```sh
$ gem install sass
```
1. To watch the Sass source for changes and build the stylesheets automatically, run:

    ```sh
$ make watch
```
1. To compile the Sass stylesheets once, run:

    ```sh
$ make clean all
# or:
$ make -B # -B tells make to run even if the .css file exists
```
