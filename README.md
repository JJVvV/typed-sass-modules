Creates TypeScript type definition files from SASS files.

It is a refactoring for [awesome-typed-css-modules](https://github.com/Feiyang1/awesome-typed-sass-modules).

## CLI

```sh
npm install -g awesome-typed-sass-modules
```

see all options

```sh
atsm -h
```

```
atsm -p example/**/*.scss
```

## API

```javascript
import Creator from "@jjvvv/typed-sass-modules";

const ins = new Creator({
  verbose: true
});
ins.create("css/**/*.scss");
ins.watch();
```
