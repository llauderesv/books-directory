export const random = (range: number = 10, withPadStart: boolean = true): string => {
  let rnd = Math.ceil(Math.random() * range).toString();
  if (withPadStart) {
    const inputLength = String(range).length;
    while (rnd.length < inputLength) {
      rnd = '0' + rnd;
    }
  }

  return rnd;
};

export const shuffleArray = <T>(array: Array<T>): Array<T> => {
  let newArray: Array<T> = [];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    newArray = [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
  }

  return newArray;
};
