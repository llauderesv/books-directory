function convertCamelToSnakeCaseKeys(obj) {
  if (obj === null || typeof obj !== 'object') {
    console.log('Invalid object');
    return; // Return the input unchanged if it's not an object
  }

  const snakeCaseObject = {};
  const queue = [{ obj, target: snakeCaseObject }];
  while (queue.length > 0) {
    const resp = queue.pop();
    if (resp) {
      const { obj, target } = resp;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();

          if (typeof obj[key] === 'object' && obj[key] !== null) {
            let value;
            if (Array.isArray(obj[key])) {
              console.log(
                'Array',
                obj[key].map(item => convertCamelToSnakeCaseKeys(item))
              );
              value = obj[key].map(item => convertCamelToSnakeCaseKeys(item));
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              value = {};
            }
            target[snakeCaseKey] = value;
            console.log(obj[key], target[snakeCaseKey]);
            queue.push({ obj: obj[key], target: target[snakeCaseKey] });
          } else {
            console.log(obj[key]);
            target[snakeCaseKey] = obj[key];
          }
        }
      }
    }
  }

  return snakeCaseObject;
}

// const camelCaseObject = {
//   someKey: 'value',
//   anotherKey: {
//     nestedKey: 'nestedValue',
//   },
// };

// const snakeCaseObject = convertKeysToSnakeCase(camelCaseObject);

// console.log(snakeCaseObject);

const testObj = {
  firstName: 'Vince',
  lastName: 'Llauderes',
  address: [
    {
      streetName: {
        zipCode: 123,
      },
    },
  ],
};

console.log(convertCamelToSnakeCaseKeys(testObj));
