var FILES_DB = "teleprompterfiles";
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
function addFileToStorage(files) {
    localStorage.setItem(FILES_DB,JSON.stringify(files));
}

function getFilesFromStorage() {
   var files = localStorage.getItem(FILES_DB);
   files = files ? JSON.parse(files) : [];
   return files;
}

function createFile(file, content) {
    let myPromise = new Promise(function(resolve, reject) {
        var type = window.PERSISTENT;
        var size = 5*1024*1024;
        window.requestFileSystem(type, size, successCallback, errorCallback)
     
        function successCallback(fs) {
           fs.root.getFile(file, {create: true, exclusive: true}, function(fileEntry) {
             resolve(true);
           }, errorCallback);
        }
     
        function errorCallback(error) {
           alert("ERROR: " + error.code);
           resolve(false);
        }
    });

   return myPromise;     
 }

 function writeFile(file, content) {
    let myPromise = new Promise(function(resolve, reject) {
        var type = window.PERSISTENT;
        var size = 5*1024*1024;
        window.requestFileSystem(type, size, successCallback, errorCallback)
    
        function successCallback(fs) {
        fs.root.getFile(file, {create: true}, function(fileEntry) {
    
            fileEntry.createWriter(function(fileWriter) {
                fileWriter.onwriteend = function(e) {
                    resolve(true);
                };
    
                fileWriter.onerror = function(e) {
                    resolve(false);
                };
    
                var blob = new Blob([content], {type: 'text/plain'});
                fileWriter.write(blob);
            }, errorCallback);
        }, errorCallback);
        }
 
        function errorCallback(error) {
        alert("ERROR: " + error.code)
        }
    });

    return myPromise;
 }

 function readFile(file) {
   let myPromise = new Promise(function(resolve, reject) {
    var type = window.PERSISTENT;
    var size = 5*1024*1024;
    window.requestFileSystem(type, size, successCallback, errorCallback)
 
    function successCallback(fs) {
       fs.root.getFile(file, {}, function(fileEntry) {
 
          fileEntry.file(function(file) {
             var reader = new FileReader();
 
             reader.onloadend = function(e) {
               resolve(this.result);
             };
             reader.readAsText(file);
          }, errorCallback);
       }, errorCallback);
    }
 
    function errorCallback(error) {
       alert("ERROR: " + error.code)
       resolve(false);
    }
   });

   return myPromise;
 }	

 function removeFile(file) {
   let myPromise = new Promise(function(resolve, reject) {
    var type = window.PERSISTENT;
    var size = 5*1024*1024;
    window.requestFileSystem(type, size, successCallback, errorCallback)
 
    function successCallback(fs) {
       fs.root.getFile(file, {create: false}, function(fileEntry) {
 
          fileEntry.remove(function() {
            resolve(true);
          }, errorCallback);
       }, errorCallback);
    }
 
    function errorCallback(error) {
       resolve(false);
    }
   });

   return myPromise;
 }

 function addFileWToStorage(name) {
   var files = getFilesFromStorage();
   files.push(name);
   addFileToStorage(files);
 }

 function saveFile() {
   var filename = $('#filename').val();
   if(!filename) {
      alert('Please enter file name.');
      return;
   } 
var content = $("#teleprompter").html();
   writeFile(filename, content).then(function(status) {
      if(status) {
         addFileWToStorage(filename);
         refreshFileList();
         $("#modalclose").trigger('click');
         alert('File saved successfully!');
         $(".navbar-collapse").collapse('hide');
      }
   });
 }

 function refreshFileList() {
    var ul = document.getElementById("filesList");
    $(ul).empty();
    var files = getFilesFromStorage();
    for(var i=0;i<files.length;i++) {
      var li = document.createElement("li");
      li.className = 'list-group-item';
      li.textContent = files[i];
      li.onclick = function (e) {
         loadFileToPrompter(e);
      }
      ul.appendChild(li);
    }
 }

 function loadFileToPrompter(e) {
   console.log(e);
   var tfile = e.target.innerHTML;
   readFile(tfile).then(function(content) {
      if(content !== false) {
         $("#teleprompter").html(content);
         showHideFiles();
      }
   });
 }