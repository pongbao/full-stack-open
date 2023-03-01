# Event handlers

    xhttp.onreadystatechange = function ()

On this line, an event handler for the event _onreadystatechange_ is defined for the `xhttp` object doing the request

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // code that takes care of the server response
        }
    }

The function code checks that the _readyState_ equals 4 (which depicts the situation The operation is complete) and that the HTTP status code of the response is 200.

- typing `document` in the console gives you access to the _document_ object
- the `textContent` attribute of any element gives only the text it contains and does not include elements inside the parent element in comparison with `innerHTML`
