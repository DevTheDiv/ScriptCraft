function scsave(objToSave, filename) {
    var File = java.io.File,
        FileWriter = java.io.FileWriter;
        PrintWriter = java.io.PrintWriter;
    var objectToStr = null,
        f,
        out;
    try {
        objectToStr = JSON.stringify(objToSave, null, 2);
    } catch (e) {
        console.error('ERROR: ' + e.getMessage() + ' while saving ' + filename);
        return;
    }
    f = filename instanceof File ? filename : new File(filename);
    out = new PrintWriter(new FileWriter(f));
    out.println(objectToStr);
    out.close();
}
