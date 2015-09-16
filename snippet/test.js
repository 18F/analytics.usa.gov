var snippet = require("./src"),
    fs = require("fs"),
    async = require("async");

snippet.grab("GSA/DAP-Gov-wide-GA-Code/Universal-Federated-Analytics.1.0.js", function(error, source) {
  if (error) return console.error("Error: " + error);

  console.log("we got source:", source.length, "chars");

  snippet.pack(source, "dap.js", function(error, files) {
    if (error) return console.error("Pack error:", error);

    console.log("packed", files.length, "files:");
    files.forEach(function(file, i) {
      console.log((i + 1) + ".", file.name, "@", file.content.length, "chars");
    });

    async.forEach(files, function(file, next) {
      console.log("writing:", file.name);
      fs.writeFile(file.name, file.content, {encoding: "utf8"}, next);
    }, function(error) {
      if (error) return console.error("Write error: " + error);
      console.log("all done!");
    });
  });
});
