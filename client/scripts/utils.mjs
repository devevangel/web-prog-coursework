export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function fetchData(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function postData(url, body, httpVerb) {
  try {
    const options = {
      method: httpVerb,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteData(url) {
  try {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
