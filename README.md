# postcss-ms-grid
Simple and clean postcss plugin for adding css-grid fallback for ie.

## Install
```bash
npm install -D postcss-ms-grid
```

## Usage
Register postcss plugin in *postcss.config.js*
```js
module.exports = {
  plugins: [
    require('postcss-ms-grid')
  ]
};
```

Create grid layout using css grid:
```css
.container {
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 1fr 200px 300px;
  grid-column-gap: 10px;
  grid-row-gap: 20px;
}

.column1 {
  grid-column: 1 / span 2 / true;
  grid-row: 1 / span 3 / true;
}

.column2 {
  grid-column: 3 / span 1 / true;
  grid-row: 1 / span 3 / true;
}
```

As you can see from the example you can use css grid as you would do it without this plugin. This plugin takes care of adding correct `-ms` prefixes for IE11 and handles additional columns when row/column gap is defined. Every gap is treated as an additional row/column. You don't have to take this under consideration when defining `grid-column` or `grid-row`. Plugin takes care of it automatically.

The only thing you have to remember when using `grid-column` and `grid-row` is that you have to add additional `/ true` at the end of rule if your container is using either `grid-column-gap` or `grid-row-gap`.

## Notes
Please note that this plugin does not support `grid-template-areas`. Supporting it would add more complexity and final css bundle would be significantly bigger depending of amount elements using css grid in your codebase. This plugin aims for as cleaner and lightweight IE11 css grid implementation as possible, therefor it doesn't support `grid-template-areas`.