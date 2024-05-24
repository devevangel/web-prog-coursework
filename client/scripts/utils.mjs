/**
 * Fetches data from the specified URL.
 *
 * @async
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} The JSON data from the response.
 * @throws Will log an error to the console if the fetch operation fails.
 */
export async function fetchData(url) {
  try {
    const res = await fetch(url); // Fetch data from the URL
    const data = await res.json(); // Parse the response as JSON
    return data; // Return the parsed data
  } catch (error) {
    console.log(error); // Log any errors to the console
  }
}

/**
 * Sends data to the specified URL using the provided HTTP method.
 *
 * @async
 * @param {string} url - The URL to send data to.
 * @param {Object} body - The data to send in the request body.
 * @param {string} httpVerb - The HTTP method to use (e.g., POST, PUT, PATCH).
 * @returns {Promise<Object>} The JSON data from the response.
 * @throws Will log an error to the console if the fetch operation fails.
 */
export async function postData(url, body, httpVerb) {
  try {
    const options = {
      method: httpVerb, // Set the HTTP method
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(body), // Stringify the body object
    };

    const res = await fetch(url, options); // Send the request with options
    const data = await res.json(); // Parse the response as JSON
    return data; // Return the parsed data
  } catch (error) {
    console.log(error); // Log any errors to the console
  }
}

/**
 * Deletes data from the specified URL.
 *
 * @async
 * @param {string} url - The URL to delete data from.
 * @returns {Promise<Object>} The JSON data from the response.
 * @throws Will log an error to the console if the fetch operation fails.
 */
export async function deleteData(url) {
  try {
    const options = {
      method: 'DELETE', // Set the HTTP method to DELETE
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    };

    const res = await fetch(url, options); // Send the DELETE request
    const data = await res.json(); // Parse the response as JSON
    return data; // Return the parsed data
  } catch (error) {
    console.log(error); // Log any errors to the console
  }
}
