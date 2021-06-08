function find(dir, filter) {
    var File = Packages.java.io.File;
    var result = [];

    function recurse(dir, store) {
        var files;
        var dirfile = new File(dir);

        if (typeof filter == 'undefined') {
            files = dirfile.list();
        } else {
            files = dirfile.list(filter);
        }
        for (var i = 0; i < files.length; i++) {
            var file = new File(dir + '/' + files[i]);
            if (file.isDirectory()) {
                recurse(file.getCanonicalPath(), store);
            } else {
                store.push(('' + file.getCanonicalPath()).replace(/\\\\/g, '/'));
            }
        }
    }
    recurse(dir, result);
    return result;
};
