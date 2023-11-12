interface IQueue {
  obj: Record<string, any>;
  target: Record<string, any>;
}

export default function convertCamelToSnakeCaseKeys(obj: Record<string, any>) {
  if (obj === null || typeof obj !== 'object') {
    console.log('Invalid object');
    return; // Return the input unchanged if it's not an object
  }

  const snakeCaseObject = {};
  const queue: IQueue[] = [{ obj, target: snakeCaseObject }];
  while (queue.length > 0) {
    const resp = queue.pop();
    if (resp) {
      const { obj, target } = resp;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            const value = Array.isArray(obj[key]) ? [] : {};
            target[snakeCaseKey] = value;
            queue.push({ obj: obj[key], target: target[snakeCaseKey] });
          } else {
            target[snakeCaseKey] = obj[key];
          }
        }
      }
    }
  }

  return snakeCaseObject;
}
