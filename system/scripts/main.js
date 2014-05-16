var final_transcript = '';
var recognizing = false;

var language = 'en-GB';

function speak(speech){
    $("#result").html(speech);
    var utterance = new SpeechSynthesisUtterance(speech);
    window.speechSynthesis.speak(utterance);
}

function showPosition(position){
    speak("Your current location is Latitude: " + Math.round(position.coords.latitude * 1000) / 1000 + " Longitude: " + Math.round(position.coords.longitude * 1000) / 1000);    
}

function operation(task){
    url = "http://api.wolframalpha.com/v2/query?appid=T2797K-8UUKL2XHA5&input="+task+"&format=plaintext";
    $.get( url, function( data ) {
        alert( data );
    });
    /*
    var inDatabase = false;
    var country_list = ["Afghanistan","Albania","Algeria",
    "Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina",
    "Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain",
    "Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; 
    Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","
    Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands",
    "Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti",
    "Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia",
    "Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies",
    "Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala",
    "Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
    if(task.search('capital')!=-1){
        for(i=0;i<country_list.length;i++){
            country_name=country_list[i].toLowerCase();
            if(task.search(country_name)!=-1){
                speak("The capital of "+country_list[i]+" is");
                inDatabase = true;
                break;
            }
        }
    }
    if(task.search('where')!=-1){
        if(task.search('i right now')!=-1){
            navigator.geolocation.getCurrentPosition(showPosition); 
            inDatabase = true;
        }else 
        if(task.search('paris')!=-1){
            speak("Paris is in France.");
            inDatabase = true;
        }
    }
    if(task.search('what')!=-1){
        if(task.search('current location')!=-1){
             navigator.geolocation.getCurrentPosition(showPosition); 
             inDatabase = true;
        }
        if(task.search('apple')!=-1){
            speak("An Apple is a red coloured fruit.");
            inDatabase = true;
        }
    }
    if(!inDatabase){
        console.log("Not in Database");
        speak("Searching google for "+task);
        var win = window.open('https://www.google.com/search?q='+task,"_new");
        win.focus();
    }*/
}

$(document).ready(function() {
    //speak("Welcome User");
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your Browser does not support the Speech API");

    } else {

       console.log("Create the recognition object and define four event handlers (onstart, onerror, onend, onresult)");
       var recognition = new webkitSpeechRecognition();
       recognition.continuous = true;
       recognition.interimResults = true;
       recognition.lang = language;

       recognition.onstart = function() {
            recognizing = true;
            $('#instructions').html('Speak slowly and clearly');
            $('#start_button').html('<img src="system/images/microphone_active.png" id="">');
        };

        recognition.onerror = function(event) {
            $('#instructions').html('There was a recognition error...');
            console.log("There was a recognition error...");
            //alert("There was a recognition error...\n\n* Check if your internet connection is working\n* Check your microphone for problems");
            speak("Error! Check your microphone for faults. Also check if your internet connection is working.");
            recognition.stop();
            $('#start_button').html('<img src="system/images/microphone_error.png" id="">');
            recognizing = false;
        };

        recognition.onend = function() {
            recognizing = false;
            //$('#instructions').html('Done');
            $("#start_button").css("border","2px solid #ccc");
        };

        recognition.onresult = function(event) {
            var interim_transcript = '';
            $("#loading").fadeIn();
            console.log("Assemble the transcript from the array of results");
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                    operation(final_transcript);
                    
                    setTimeout(function(){
                        $("#start_button").css("border","2px solid #ccc");
                        $("#loading").fadeOut();
                        recognition.stop();
                        $('#start_button').html('<img src="system/images/microphone_idle.png" id="">');
                        recognizing = false;
                    },1000);
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }

            console.log("interim:  " + interim_transcript);
            console.log("final:    " + final_transcript);
            console.log("update the web page");
            if(final_transcript.length > 0) {
                $('#transcript').html(final_transcript);
            }
        };


        $("#start_button").click(function(e) {
            $("#result").html('&nbsp;');
            e.preventDefault();
            if (recognizing) {
                $("#start_button").css("border","2px solid #ccc");
                recognition.stop();
                $('#start_button').html('Click to Start Again');
                recognizing = false;
            } else {
                $("#start_button").css("border","2px solid #29c");
                final_transcript = '';

                console.log("Request access to the User's microphone and Start recognizing voice input");
                recognition.start();

                $('#instructions').html('Allow the browser to use your Microphone');
                //$('#start_button').html('waiting');
                $('#transcript').html('&nbsp;');
            }
        });
    }
});
