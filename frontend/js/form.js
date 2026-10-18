const form = document.getElementById('contact-form');
const messageSendFeedback = document.querySelector('#messageSendFeedback'); 


form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const enteredName = document.getElementById('name').value.trim();
    const enteredEmail = document.getElementById('e-mail').value.trim();
    const enteredMessage = document.getElementById('message').value.trim();

    const messageSendFeedback = document.getElementById('messageSendFeedback');


    let isValid = true;

    if (enteredName === "" || enteredEmail === "" || enteredMessage === "") {
        messageSendFeedback.textContent = "Please enter all fields";    
        isValid = false;
    } else if (/\d/.test(enteredName)) {
        messageSendFeedback.textContent = "Name can't contain numbers";
        isValid = false;
    } else if (!(/\@/.test(enteredEmail))) {
         messageSendFeedback.textContent = "E-mail should contain a @ sign";
         isValid = false;
    }

    if (isValid) {
        messageSendFeedback.textContent = "Sending message...";

     try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {'Accept' : 'application/json'}
        });
    

    if (response.ok) {
          messageSendFeedback.textContent = "Message successfully sent! Thank you!";
          messageSendFeedback.classList.add('success');
          messageSendFeedback.classList.remove('error');
          form.reset();
        } else {
          messageSendFeedback.textContent = "Oops Something went wrong. Try again.";
          messageSendFeedback.classList.add('error');
          messageSendFeedback.classList.remove('success');
        }
      } catch (error) {
        messageSendFeedback.textContent = "Network error. Please try again later.";
        messageSendFeedback.classList.add('error');
      }

    } else {
      messageSendFeedback.classList.add('error');
      messageSendFeedback.classList.remove('success');
    }


});





