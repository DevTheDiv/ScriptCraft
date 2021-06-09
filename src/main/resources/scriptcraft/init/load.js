function scload(filename, warnOnFileNotFound) {
    var File = java.io.File,
        FileReader = java.io.FileReader,
        BufferedReader = java.io.BufferedReader;

    var result = null,
        file = filename,
        r,
        reader,
        br,
        code,
        wrappedCode;

    if (!(filename instanceof File)) {
        file = new File(filename);
    }
    var canonizedFilename = file.getCanonicalPath();

    if (file.exists()) {
        reader = new FileReader(file);
        br = new BufferedReader(reader);
        code = '';
        try {
            while ((r = br.readLine()) !== null) {
                code += r + '\n';
            }
            wrappedCode = '(' + code + ')';
            result = eval(wrappedCode);
        } catch (e) {
            console.error('Error evaluating ' + canonizedFilename + ', ' + e);
        } finally {
            try {
                reader.close();
            } catch (re) {
                // fail silently on reader close error
            }
        }
    } else {
        if (warnOnFileNotFound) {
            console.error(canonizedFilename + ' not found');
        }
    }
    return result;
}
