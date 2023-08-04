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

Classic model

- retuns a lot of HTTP responses
- POST redirects to the original
  URL which does another set of GET requests

Single-page apps

- only sends a single HTTP request

jQuery

- one of the JS libraries that contains tools that are easy to work with

# HTTP responses (ChatGPT)

The correct status codes for errors in HTTP methods are as follows:

1. GET:

   - 200 OK: The request was successful, and the response contains the requested data.
   - 404 Not Found: The requested resource could not be found on the server.
   - 400 Bad Request: The server cannot or will not process the request due to a client error (e.g., malformed request syntax, invalid parameters).
   - 500 Internal Server Error: The server encountered an unexpected condition that prevented it from fulfilling the request.

2. PUT:

   - 200 OK: The request was successful, and the resource has been updated.
   - 204 No Content: The request was successful, and there is no additional information to send in the response (typically used for successful updates where no data is returned).
   - 404 Not Found: The requested resource to update could not be found on the server.
   - 400 Bad Request: The server cannot or will not process the request due to a client error (e.g., malformed request syntax, invalid parameters).
   - 500 Internal Server Error: The server encountered an unexpected condition that prevented it from fulfilling the request.

3. DELETE:
   - 200 OK: The request was successful, and the resource has been deleted.
   - 204 No Content: The request was successful, and there is no additional information to send in the response (typically used for successful deletions where no data is returned).
   - 404 Not Found: The requested resource to delete could not be found on the server.
   - 400 Bad Request: The server cannot or will not process the request due to a client error (e.g., malformed request syntax, invalid parameters).
   - 500 Internal Server Error: The server encountered an unexpected condition that prevented it from fulfilling the request.

It's important to note that these are general guidelines, and the appropriate status codes may vary based on the specific use case and the API design. For example, in some cases, you might choose to use other status codes like 201 Created for successful POST requests or 422 Unprocessable Entity for cases where the server understands the request but cannot process it due to semantic errors. Always refer to the HTTP specification and consider the context of your application when choosing status codes for your API responses.
