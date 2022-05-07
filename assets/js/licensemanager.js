// Import the functions you need from the SDKs you need
      // import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries
    
      // Your web app's Firebase configuration


      var LicenseManager = (function() {
      const firebaseConfig = {
        apiKey: "AIzaSyACqBVaxpT7LanFnyv5QxSAWzGOrZPGChM",
        authDomain: "digioprompter.firebaseapp.com",
        projectId: "digioprompter",
        storageBucket: "digioprompter.appspot.com",
        messagingSenderId: "46325015337",
        appId: "1:46325015337:web:94b24d63df09df97d54d38",
        databaseURL: "https://digioprompter-default-rtdb.asia-southeast1.firebasedatabase.app"
      };
      const localStorageKey = 'DigioLicense';
      const dateFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';
      var app = undefined;
      // Initialize Firebase
      function init() {
        const app = firebase.initializeApp(firebaseConfig);

        console.log('firebase: ', app);
      }

      function checkIfFirebaseIsOnline() {
        return new Promise(function (resolve,reject) {
          var connectedRef = firebase.database().ref(".info/connected");
          connectedRef.on("value", (snap) => {
            if (snap.val() === true) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });
      }
      function checkIfAppAddedToLicense(uniqueId, skipLocal) {

        let myPromise = new Promise(function(resolve, reject) {

        if(localStorage.getItem(localStorageKey) && !skipLocal) {
          resolve(JSON.parse(localStorage.getItem(localStorageKey)));
          return;
        }
        const dbRef = firebase.database().ref();
        const licensesRef = dbRef.child('licenses');

        licensesRef.orderByChild('licensekey')
        .equalTo(uniqueId).get().then((snapshot) => {
            if (snapshot.exists()) {
              //console.log(snapshot.val());
              // validate license
              var licenseObj = snapshot.val()[Object.keys(snapshot.val())[0]];
              licenseObj.installedon = moment(licenseObj.installedon, dateFormat).toDate();
              localStorage.setItem(localStorageKey, JSON.stringify(licenseObj));
              resolve(licenseObj);
            } else {
              console.log("No data available");
              // add license
                resolve(null);
            }
          }).catch((error) => {
            console.error(error);
          });
          });
         return myPromise;
      }
      function registerAppForLicense(licenseData) {
            const dbRef = firebase.database().ref();
            const licensesRef = dbRef.child('licenses');
            const date1 = moment().format(dateFormat);

            // Get a key for a new Post.
            var newPostKey = licensesRef.push().key;

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/licenses/' + newPostKey] = licenseData;
            localStorage.setItem(localStorageKey, JSON.stringify(licenseData));
            return firebase.database().ref().update(updates);
      }
      function validateLicense(date1,activateTill, date2) {
        var a = moment(date1);
        var b = moment(date2);
        return a.diff(b, 'days') >= activateTill * 1;
      }

      function showLicenseForm(uniqueId) {
        
        if(!uniqueId) {
          $('#ModalLoginForm #lkey').prop('disabled', null);
        } else {
          $('#ModalLoginForm #lkey').prop('disabled', true);
        }
        $('#ModalLoginForm #lkey').val(uniqueId);
        
        const modal = new Promise(function(resolve, reject){

          // lox
        if(localStorage.getItem(localStorageKey)) {
          resolve(JSON.parse(localStorage.getItem(localStorageKey)));
          return;
        }
        
          $('#ModalLoginForm').modal('show');
          $(document).on('click','#ModalLoginForm .btn-add', function(event){
            var form = $("#ModalLoginForm form");
        
            if (form[0].checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.addClass('was-validated');
            var licenceObj = {};
            var formElements = $(form).serializeArray();
            for(var i=0;i<formElements.length;i++) {
                licenceObj[formElements[i].name] = formElements[i].value;
            }
            licenceObj.concent = $('#lconcent').is(':checked');
            licenceObj.activateTill = 3;
            licenceObj.installedon = moment().format(dateFormat);
            $('#ModalLoginForm').modal('hide');
            resolve(licenceObj);
          });
          $(document).on('click', '#ModalLoginForm .btn-cancel', function(){
            $('#ModalLoginForm').modal('hide');
              reject(null);
          });
         });
         return modal;
      }

      /* Expose Select Control to Public TelePrompter Object */
  return {
    checkIfAppAddedToLicense: checkIfAppAddedToLicense,
    init: init,
    registerAppForLicense: registerAppForLicense,
    validateLicense:validateLicense,
    showLicenseForm: showLicenseForm,
    checkIfFirebaseIsOnline:checkIfFirebaseIsOnline
    }

 })();