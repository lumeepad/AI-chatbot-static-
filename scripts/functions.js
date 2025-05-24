

function redirectToChatPage(){
    console.log('Dom is fully loaded')
    window.location.href = 'chat.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('RedirectButton');
    if (button) {
        button.addEventListener('click', redirectToChatPage);
        console.log('chat button clicked...');
    }
    
    // Trigger file input when the Upload PDF button is clicked
    document.getElementById('upload-btn').addEventListener('click', function() {
        console.log('upload button clicked...');
        document.getElementById('pdf-file').click();
    });
    
    // Handle file selection
    document.getElementById('pdf-file').addEventListener('change', function(event) {
        const file = event.target.files[0];  // Get the uploaded file
        
        
        
        if (file) {
            const formData = new FormData();
            formData.append('pdf', file);  // Append the PDF file to the form data
        
            // Send the file to the backend using Fetch
            console.log('fetching...');
            fetch('/upload_pdf', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Handle the response (for example, display the extracted text)
                console.log(data);
                alert('PDF Uploaded!');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to upload PDF.');
            });
        }
    });  

    const halfPdfButton = document.getElementById("halfpdf");
  const fullScreenButton = document.getElementById("fullscreen");
  const iframeContainer = document.querySelector(".iframe-container");

  // Hide the iframe container by default
  iframeContainer.style.display = "none";

  let isRightSide = false;

  // Show or move iframe container when halfpdf button is clicked
  halfPdfButton.addEventListener("click", function () {
    iframeContainer.style.display = "block";

    if (!isRightSide) {
      iframeContainer.style.position = "absolute";
      iframeContainer.style.right = "0";
      iframeContainer.style.top = "0";
      iframeContainer.style.width = "50%";
      iframeContainer.style.height = "100vh";
    } else {
      iframeContainer.style.position = "static";
      iframeContainer.style.width = "100%";
      iframeContainer.style.height = "auto";
    }

    isRightSide = !isRightSide;
  });

  // Remove iframe container when fullscreen button is clicked
  fullScreenButton.addEventListener("click", function () {
    iframeContainer.style.display = "none";  // Hide the element
    isRightSide = false;
  });
});



function autoExpand(textarea) {
    // Reset the height to let the content determine the height
    textarea.style.height = "auto";
    // Set the height to match the scroll height
    textarea.style.height = textarea.scrollHeight + "px";
}

const textarea = document.getElementById('textArea');

textarea.addEventListener('input', () => {
    // Temporarily set width to "auto" to measure content width
    textarea.style.width = 'auto';
    // Adjust width based on scroll width to fit content
    textarea.style.width = `${textarea.scrollWidth}px`;
});
document.querySelector('.submit').addEventListener('click', function() {
    console.log('submit button clicked...');
    const textarea = document.getElementById('textArea');
    const message = textarea.value;
    
    if (message.trim()) {
        // create div container
        const createDivElement = document.createElement('div');
        createDivElement.classList.add('container-row');
        
        // Create a new <p> element for the message
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        
        // Add a 'sent' class to align the message to the right
        messageElement.classList.add('sent');

        
        // Append the new message to the <div> with id 'chat-messages'
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.appendChild(createDivElement);
        
        // append the <p>
        createDivElement.appendChild(messageElement);
        
        // Optionally, clear the textarea after sending
        textarea.value = '';
        
        autoExpand(textarea); // Reapply the textarea resizing
        
        // Show loading message while waiting for AI response
        const createDivElement_Ai = document.createElement('div');
        createDivElement_Ai.classList.add('container-row');
        chatMessages.appendChild(createDivElement_Ai);

        const loadingMessage = document.createElement('p');
        console.log('loading response...');
        loadingMessage.textContent = 'Loading...';
        loadingMessage.classList.add('loading'); // You can style this class to make it look like a loading indicator

        createDivElement_Ai.appendChild(loadingMessage);
        
        // Scroll to the bottom to show the loading message
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Send the user input to the backend for AI processing
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            // Remove the loading message
            createDivElement_Ai.removeChild(loadingMessage);
            
            // Create and display the AI response
            const aiMessage = document.createElement('p');
            aiMessage.textContent = data.response; // The AI's response
            aiMessage.classList.add('received');
            
            // Apply any special formatting to the AI response text (optional)
            aiMessage.innerHTML = formatAIResponse(data.response); // Format response if needed
            createDivElement_Ai.appendChild(aiMessage);
            
            
            // Scroll to the bottom of the chat container to show the latest message
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error occurred while fetching AI response.");
        });
    }
});

function formatAIResponse(response) {
    // Split the response into paragraphs (if applicable)
    return response.replace(/\n/g, "<br />"); // Replace line breaks with HTML <br> tags
}




