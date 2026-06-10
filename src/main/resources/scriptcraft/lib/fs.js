'use strict';

/**
 * A Node.js-compatible 'fs' module for ScriptCraft using java.nio.file.
 */

var Files = java.nio.file.Files;
var Paths = java.nio.file.Paths;
var StandardOpenOption = java.nio.file.StandardOpenOption;
var Charset = java.nio.charset.Charset;

var UTF8 = Charset.forName('UTF-8');

function toPath(p) {
    return Paths.get(p);
}

var fs = {
    readFileSync: function(path, options) {
        var bytes = Files.readAllBytes(toPath(path));
        var encoding = (typeof options === 'string' ? options : (options && options.encoding));
        if (encoding) {
            return new java.lang.String(bytes, Charset.forName(encoding)).toString();
        }
        return bytes; // Returns a byte array if no encoding specified
    },

    writeFileSync: function(path, data, options) {
        var bytes = (typeof data === 'string') ? new java.lang.String(data).getBytes(UTF8) : data;
        Files.write(toPath(path), bytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
    },

    appendFileSync: function(path, data) {
        var bytes = (typeof data === 'string') ? new java.lang.String(data).getBytes(UTF8) : data;
        Files.write(toPath(path), bytes, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
    },

    existsSync: function(path) {
        return Files.exists(toPath(path));
    },

    mkdirSync: function(path, options) {
        var recursive = (options && options.recursive);
        if (recursive) {
            Files.createDirectories(toPath(path));
        } else {
            Files.createDirectory(toPath(path));
        }
    },

    readdirSync: function(path) {
        var stream = Files.newDirectoryStream(toPath(path));
        var files = [];
        var iterator = stream.iterator();
        while (iterator.hasNext()) {
            files.push(iterator.next().getFileName().toString());
        }
        stream.close();
        return files;
    },

    unlinkSync: function(path) {
        Files.delete(toPath(path));
    },

    statSync: function(path) {
        var p = toPath(path);
        var attrs = Files.readAttributes(p, "basic:*");
        return {
            isFile: function() { return !Files.isDirectory(p); },
            isDirectory: function() { return Files.isDirectory(p); },
            size: attrs.get("size"),
            mtime: new Date(attrs.get("lastModifiedTime").toMillis())
        };
    }
};

fs.promises = {
    readFile: function(path, options) {
        return new Promise(function(resolve, reject) {
            try {
                resolve(fs.readFileSync(path, options));
            } catch (e) {
                reject(e);
            }
        });
    },
    writeFile: function(path, data, options) {
        return new Promise(function(resolve, reject) {
            try {
                fs.writeFileSync(path, data, options);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    },
    readdir: function(path) {
        return new Promise(function(resolve, reject) {
            try {
                resolve(fs.readdirSync(path));
            } catch (e) {
                reject(e);
            }
        });
    },
    mkdir: function(path, options) {
        return new Promise(function(resolve, reject) {
            try {
                fs.mkdirSync(path, options);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    },
    unlink: function(path) {
        return new Promise(function(resolve, reject) {
            try {
                fs.unlinkSync(path);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    },
    stat: function(path) {
        return new Promise(function(resolve, reject) {
            try {
                resolve(fs.statSync(path));
            } catch (e) {
                reject(e);
            }
        });
    }
};

module.exports = fs;
