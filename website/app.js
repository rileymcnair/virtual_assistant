
const submitButton = document.getElementById('submitButton');
const assistantInput = document.getElementById('assistantInput');
const assistantOutput = document.getElementById('assistantOutput');


//voice button
document.getElementById('voiceButton').addEventListener('click', voiceHandler);
//var voiceEnabled = 'false';


submitButton.onclick = userSubmitEventHandler;
assistantInput.onkeyup = userSubmitEventHandler;

//when voice button is clicked
function voiceHandler() {
    document.getElementById('loadingGif').style.display = 'block';
    assistantOutput.innerText = 'Listening...';
//    voiceEnabled = 'true';
    askAssistant('true');
}

function userSubmitEventHandler(event) {
    if (
        (event.keyCode && event.keyCode === 13) ||
        event.type === 'click'
    ) {
        assistantOutput.innerText = 'Thinking...';
        askAssistant(assistantInput.value);
    }
}

function askAssistant(userInput) {
    document.getElementById('loadingGif').style.display = 'block';
//    console.log(userInput);
//    if(voiceEnabled == 'true')
//        userInput = 'true';
    const myRequest = new Request('/', {
        method: 'POST',
        body: userInput
    });

    fetch(myRequest).then(function(response) {
        if (!response.ok) {
            throw new Error('HTTP error, status = ' + response.status);
        } else {
            return response.text();
        }
    }).then(function(text) {
        assistantInput.value = '';
        assistantOutput.innerText = text;
        document.getElementById('loadingGif').style.display = 'none';
    }).catch((err) => {
        console.error(err);
        assistantInput.value = '';
        assistantOutput.innerText = 'ERROR OCCURRED. PLEASE TRY AGAIN';
        document.getElementById('loadingGif').style.display = 'none';
    });
}




    
