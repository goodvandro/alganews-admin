export default function formatPhone(
  phoneNumber: string
): string {
  const numberArray = phoneNumber.split('');
  const ddd = numberArray.slice(0, 2).join('');
  const firstSlice = numberArray.slice(2, 7).join('');
  const lastSliced = numberArray.slice(7, 11).join('');

  return `(${ddd}) ${firstSlice}-${lastSliced}`;
}
