function usageSize() {
  const used = process.memoryUsage().heapUsed;
  return Math.round((used / 1024 / 1024) * 100) / 100 + 'M';
}

global.gc();

console.log(usageSize()); // 3.33M

let arr = new Array(10 * 1024 * 1024);
const map = new WeakMap();

map.set(arr, 1);
global.gc();

console.log(usageSize()); // 83.34M

arr = null;
global.gc();

console.log(usageSize()); // 3.34M