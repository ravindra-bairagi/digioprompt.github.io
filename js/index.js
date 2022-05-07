/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);
var isElectron = false;
var isOffline = false;

function findIp() {
    var findIP = new Promise(r => {
      var w = window,
        a = new (w.RTCPeerConnection ||
          w.mozRTCPeerConnection ||
          w.webkitRTCPeerConnection)({ iceServers: [] }),
        b = () => {};
      a.createDataChannel("");
      a.createOffer(c => a.setLocalDescription(c, b, b), b);
      a.onicecandidate = c => {
        try {
          c.candidate.candidate
            .match(
              /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
            )
            .forEach(r);
        } catch (e) {}
      };
    });
    return findIP;
  }


function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
   // document.getElementById('deviceready').classList.add('ready');
   if(navigator && navigator.splashscreen)
   {
    navigator.splashscreen.hide();
   }
   var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('electron/') > -1) {
        isElectron = true;
        setUIForElectron();
        document.addEventListener("online", function () {
            isOffline = false;
        }, false);
        document.addEventListener("online", function () {
            isOffline = true;
        }, false);
    } else {
        
    }
}
$(document).on("click", ".icon-file-text",function() {
    $("#file-selector").trigger('click');
});

function setUIForElectron() {

    // set navbar widrh and text align
    $('.navbar-brand').css({'text-align':'right', 'width':'50%'});

    // set navbar to footer
    $('nav').removeClass('fixed-top').addClass('fixed-bottom');
}

function onFileLoad(elementId, event) {
    // document.getElementById(elementId).innerText = event.target.result;
    $("#teleprompter").html(event.target.result);
  }

  function onChooseFile(event, onLoadFileHandler) {
      if (typeof window.FileReader !== 'function')
          throw ("The file API isn't supported on this browser.");
      let input = event.target;
      if (!input)
          throw ("The browser does not properly implement the event object");
      if (!input.files)
          throw ("This browser does not support the `files` property of the file input.");
      if (!input.files[0])
          return undefined;
      let file = input.files[0];
      let fr = new FileReader();
      fr.onload = function(event) {
        $("#teleprompter").html(event.target.result);
      };
      fr.readAsText(file);
  }

  $(document).on("click",".toggleBars",function() {
    $(".bsslider").toggle();
  });

  function toggleTimer() {
      if($('.timer').is(':visible')) {
        $('.toggleTimer').removeClass('btn-primary').addClass('btn-secondary');
      } else {
        $('.toggleTimer').removeClass('btn-secondary').addClass('btn-primary');
      }
      $('.timer').toggle()
  }
