export default function sortBy(arr, key) {
  arr.sort((a, b) => {
    if (b[key] < a[key])
      return -1;
    if (b[key] > a[key])
      return 1;
    return 0;
  });
}
