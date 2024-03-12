export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function fetchData(url) {
  const res = await fetch(url);
  const data = res.json();
  return data;
}
