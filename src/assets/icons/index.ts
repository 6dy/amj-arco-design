/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
const files = import.meta.glob('./svg/*.svg'); // vite

const modules: any = {};

const requireAll = (files: any) => {
  for (const key in files) {
    if (Object.prototype.hasOwnProperty.call(files, key)) {
      modules[key.replace(/(\.\/|\.svg)/g, '')] = files[key].default;
    }
  }
};
requireAll(files);
console.log(1112233, requireAll(files));
