var uglify = require("uglify-js"),
    browser = (typeof window === "object"),
    http = browser
      ? require("http")
      : require("https"),
    async = require("async"),
    url = require("url"),
    atob = require("atob"),
    zlib = require("zlib"),
    version = require("../package.json").version;

module.exports = {
  version: version,
  grab: grab,
  pack: pack,
  gzip: function(files, done) {
    return async.map(files, function(file, next) {
      zlib.gzip(file.content, function(error, zipped) {
        if (error) return next(error);
        file.zipped = String(zipped);
        next(null, file);
      });
    }, done);
  }
};

function grab(path, done) {
  var bits = path.split("/");
  if (bits.length < 3) {
    throw new Error("Invalid GitHub path: " + path + " (expected user/repo/path)");
  }

  var req = [
    "https://api.github.com/repos",
    bits[0], 
    bits[1],
    "contents",
    bits.slice(2).join("/")
  ].join("/");

  console.log("fetching:", req);

  req = url.parse(req);
  req.withCredentials = false;
  req.headers = {
    "User-Agent": "DAP snippet generator v" + version
  };

  http.get(req, function(res) {
    if (res.statusCode !== 200) {
      var error = [res.statusCode, res.statusText].join(": ");
      return done(error);
    }

    var buffer = [];
    res.on("data", function(chunk) {
      buffer.push(chunk);
    })
    .on("end", function() {
      var body = buffer.join(""),
          data = JSON.parse(body),
          body = atob(data.content);
      return done(null, body);
    });
  })
  .on("error", done)
  .end();
}

function pack(source, filename, callback) {
  return async.waterfall([
    function minify(next) {
      var minifiedFilename = filename.replace(/(\.js)$/, ".min$1"),
          sourceMapFilename = minifiedFilename + ".map",
          ast = uglify.parse(source, {filename: filename});

      // NB: this is required, otherwise ast.transform()
      // throws errors
      ast.figure_out_scope();

      var compressor = uglify.Compressor({}),
          minified = ast.transform(compressor),
          map = uglify.SourceMap({file: filename}),
          stream = uglify.OutputStream({source_map: map});

      minified.print(stream);

      return next(null, [
        {name: filename, content: source},
        {name: minifiedFilename, content: stream.toString()},
        {name: sourceMapFilename, content: map.toString()}
      ]);
    }
  ], callback);
}
