function scloadJSON(filename) {
    var File = java.io.File,
        FileReader = java.io.FileReader,
        BufferedReader = java.io.BufferedReader;

    var result = null,
        file = filename,
        r,
        reader,
        br,
        contents;

    if (!(filename instanceof File)) {
        file = new File(filename);
    }
    var canonizedFilename = file.getCanonicalPath();

    if (file.exists()) {
        reader = new FileReader(file);
        br = new BufferedReader(reader);
        contents = '';
        try {
            while ((r = br.readLine()) !== null) {
                contents += r + '\n';
            }
            result = JSON.parse(contents);
        } catch (e) {
            console.error('Error evaluating ' + canonizedFilename + ', ' + e);
        } finally {
            try {
                reader.close();
            } catch (re) {
                // fail silently on reader close error
            }
        }
    }
    return result;
}
