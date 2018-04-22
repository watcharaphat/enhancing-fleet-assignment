export default function(arr, filter) {
  const [key, value] = filter.split('=');

  const result = [];
  arr.forEach((item) => {
    if (item[key] === value) result.push(item);
  });

  return result;
}
