// const req = new URL('../../assets/icons/svg', false, /\.svg$/).href;
// console.log('requireContext', requireContext);

// const requireAll = (requireContext) => requireContext.keys();

const re = /\.\/(.*)\.svg/;

// const icons = requireAll(req).map((i) => {
//   return i.match(re)[1];
// });
const req = import.meta.glob('@/assets/icons/svg/*.svg'); // vite

const modules: any = [];

const requireAll = (files: any) => {
  // Object.keys(files).forEach((key) => {
  //   // return key.match(re)[1];
  //   debugger;
  //   // if (Object.prototype.hasOwnProperty.call(files, key)) {
  //   //   modules[key.replace(/(\.\/|\.svg)/g, '')] = files[key].name;
  //   // }
  // });
  // eslint-disable-next-line no-restricted-syntax
  for (const key in files) {
    if (Object.prototype.hasOwnProperty.call(files, key)) {
      const index = key.lastIndexOf('/');
      const str = key
        .replace(/(\.\/|\.svg)/g, '')
        .substring(index + 1, key.length);
      modules.push(str);
    }
  }
};
console.log('modules', modules);

requireAll(req);
// const re = /\.\/(.*)\.svg/;
// console.log(requireAll(files));
// debugger;

// const icons = files.map((i) => {
//   return i.name.match(re)[1];
// });
debugger;
export default modules;
