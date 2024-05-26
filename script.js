async function payWithMetamask() {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);

    try {
      const accounts = await web3.eth.requestAccounts();
      console.log(accounts); // Prompt the user to connect their Metamask wallet
      const userAddress = accounts[0];

      const tokenAddress = '0xef61Eb508DD2da8Ed460E3496191e61afa916565'; // Replace with your ERC20 token contract address
      const tokenAbi = [ 
        // Your ABI JSON here
      ];

      const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
      const amount = web3.utils.toWei('100', 'ether'); // Convert 100 tokens to wei

      // Call the transfer function of your ERC20 token contract
      const receipt = await tokenContract.methods.transfer('0x0dd1f70265Af6eBd50f6aB05AB35bE53dc08634E', amount)
        .send({ from: userAddress });

      console.log("Transaction receipt: ", receipt);
      alert("Transaction successful");
    } catch (error) {
      console.error("Error: ", error);
    }
  } else {
    console.error("Metamask is not installed.");
  }
}

document.getElementById("payButton").addEventListener("click", payWithMetamask);

function updateThingSpeakManually(fieldValue) {
  const apiKey = "IXX3CR9AYZH9XQOW";
  let url = "";
  if (fieldValue === 1) {
    url = `https://api.thingspeak.com/update?api_key=${apiKey}&field3=1`;
  } else if (fieldValue === 0) {
    url = `https://api.thingspeak.com/update?api_key=${apiKey}&field3=0`;
  }
  window.open(url, '_blank'); // Open URL in a new tab
}

// Speech recognition functionality
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = function() {
    console.log('Speech recognition started');
  };

  recognition.onspeechend = function() {
    console.log('Speech recognition ended');
    recognition.stop();
  };

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log('Transcript: ', transcript);
    alert(`You said: ${transcript}`);

    if (transcript.includes("turn on")) {
      updateThingSpeakManually(1);
    } else if (transcript.includes("turn off")) {
      updateThingSpeakManually(0);
    }
  };

  recognition.onerror = function(event) {
    console.error('Speech recognition error: ', event.error);
  };

  document.querySelector('.btn.medium').addEventListener('click', function() {
    recognition.start();
  });
} else {
  console.error('Web Speech API is not supported by this browser.');
}
