var global : any = this;

//@ts-ignore
const JavaFile : any = Java.type("java.io.File");
//@ts-ignore
const JavaBufferedWriter   = Java.type("java.io.BufferedWriter");
//@ts-ignore
const JavaFileWriter  = Java.type("java.io.FileWriter");


function readFileSync(path: string){
    if(typeof path !== "string") throw new Error("Path needs to be a string");
    let file : any = new JavaFile(path);
    if(!file.exists())  throw new Error("File Does Not Exist");
    if(!file.isFile())  throw new Error("File Specified Is Not A JavaFile");
    if(!file.canRead()) throw new Error("File Can Not Be Read");
    return file;
}


function writeFileSync(path : string, data : any){
    if(typeof path !== "string") throw new Error("Path needs to be a string");
    let file = new JavaFile(path);
    // if it does not exist then create it anyways
    if (!file.exists()) file.createNewFile();

    let fw = new JavaFileWriter(file);
    let bw = new JavaBufferedWriter(fw);

    bw.write(data);
    bw.close();    
}

function rmSync(){

}

function readdirSync(){

}

function mkdirSync(){

}

function rmdirSync(){

}

function stat(){

}



export  {
    readFileSync,
    writeFileSync,
    rmSync,
    readdirSync,
    mkdirSync,
    rmdirSync,
    stat,
}