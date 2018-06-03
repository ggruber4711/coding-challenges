const path = require('path')
const fs = require('fs');


//==variables to count the files==//

let totalFiles = 0;
let dir = 0;
let dirSize = 0;
const mbConst = 1048576;

const results = {
    'imageFiles': {count: 0, size :0},
    'documentFiles': {count: 0, size: 0},
    'audioFiles': {count: 0, size: 0},
    'videoFiles': {count: 0, size: 0},
    'otherFiles': {count: 0, size: 0}
};


//==Start of Method to find percentage==//

function findPercentage(currentValue, totalValue){
    
    return Math.round((currentValue/totalValue)*100)
}

//==End of Method to find percentage==//


//==Start of Method to convert Bytes to Mbs==//

function convertBytesToMb(value){
    
    var result = Math.trunc(value/mbConst);
    if(result <= 0){
        return "less than 1";
    }
    else{
        return result;
    }
}

//==End of Method to convert Bytes to Mbs==//


//==Start of Method to update file counter==//

function updateFileCounter(filename, fileStatus){
    totalFiles++;
    switch(path.extname(filename)){                          //switch to check the file type and incrementing counter accordingly.
        case '.jpeg':
        case '.jpg' :
        case '.png' :
        case '.gif' :
        case '.svg' :
            results['imageFiles'].count++;
            results['imageFiles'].size += fileStatus.size;
            break;

        case '.doc':
        case '.docs':
        case '.pdf':
        case '.html':
        case '.odt':
        case '.ppt':
        case '.pptx':
        case '.txt':
            results['documentFiles'].count++;
            results['documentFiles'].size += fileStatus.size;
            break;

        case '.mp3':
        case '.wav':
        case '.aac':
        case '.wma':
            results['audioFiles'].count++;
            results['audioFiles'].size += fileStatus.size;
            break;

        case '.mp4':
        case '.mpg':
        case '.avi':
        case '.wmv':
            results['videoFiles'].count++;
            results['videoFiles'].size += fileStatus.size;
            break;

        default:
            results['otherFiles'].count++;
            results['otherFiles'].size += fileStatus.size;
            break;
    }
}



//==End of Method to update file counter==//



//==Start of Method to analyze the directory==//

function analyzingDir(startPath){

    const files = fs.readdirSync(startPath);        //reading the files in that directory.
    let filename = null;
    let fileStatus = null;

    files.forEach((file) => {
        filename=path.join(startPath,file);         //joining the path + filename.
        fileStatus = fs.lstatSync(filename);            //getting status of joined file.

        dirSize += fileStatus.size;                         //adding all files size
        
        if (fileStatus.isDirectory()){                      //checking wheather it is a diretory? then incrementing the countDirectory
                                                            //and passing the whole path again to the Analyzing method.
            dir++;                                          //incrementing diretory count
            analyzingDir(filename);                         //recursive call
        }
        else{
            updateFileCounter(filename, fileStatus);        //else if its a file, update file counter is called
        };
    });
};


//==End of Method to analyze the directory==//



//==Start of Main Method RUN ==//

function run(currentPath){

    const startTime =new Date().getTime();              //getting Start time of analyzing
    analyzingDir(currentPath);                          //calling analyzing method
    const endTime =new Date().getTime();                //getting end time of analyzing

    console.log("\nProcess Time in millisecond: ",endTime-startTime);
    console.log(`Found ${totalFiles} files in ${currentPath} within ${dir} folders of size ${convertBytesToMb(dirSize)}mb with`);

    Object.keys(results).forEach((key) => {
        console.log(`${findPercentage(results[key].count,totalFiles)}% ${key} of size ${convertBytesToMb(results[key].size)}mb (${results[key].count} files)`);
    });
}

//==End of Main Method RUN ==//



const currentPath = process.argv[2];
if (!fs.existsSync(currentPath)){         //if didn't find this file path it will return with "no such dir".
    console.log("No such dir :",currentPath);
    return;
}


run(currentPath);           //if path exists then run main function


