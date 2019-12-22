const postcss = require('postcss');

function createLayout(declaration, gap) {
  const value = declaration.value;
  const repeat = /repeat\((.*?),\s*(.*?)\)/.exec(value);

  let columns = [];

  if (repeat) {
    for (let i = 0; i < Number(repeat[1]); i++) {
      columns.push(repeat[2]);
    }
  } else {
    columns = value.split(' ');
  }

  if (gap) {
    const columnsWithGap = [];

    for (let i = 0; i < columns.length; i++) {
      columnsWithGap.push(columns[i]);

      if (i !== columns.length - 1) {
        columnsWithGap.push(gap);
      }
    }

    return columnsWithGap.join(' ');
  }

  return columns.join(' ');
}

function parseGridSyntax(value) {
  if (value.indexOf('span')) {
    const regex = /(\d+)\s?\/\s?span\s?(\d+)(\s?\/\s?true)?/;
    const match = regex.exec(value);

    if (match) {
      const placement = {
        index: Number(match[1]),
        span: Number(match[2]),
      };

      if (!!match[3]) {
        placement.index = placement.index * 2 - 1;
        placement.span = placement.span * 2 - 1;
      }

      return placement;
    }
  }

  return {
    index: Number(value),
    span: 1
  };
}

function processContainer(declaration) {
  const horizontal = declaration.prop === 'grid-template-columns';

  const gap = declaration.parent.nodes.find(node => (
    horizontal
      ? node.prop === 'grid-gap' || node.prop === 'grid-column-gap'
      : node.prop === 'grid-gap' || node.prop === 'grid-row-gap'
  ));

  return {
    value: declaration.value,
    declarations: [
      postcss.decl({
        prop: horizontal ? '-ms-grid-columns' : '-ms-grid-rows',
        value: createLayout(declaration, gap && gap.value)
      })
    ]
  };
}

function processElement(declaration) {
  const placement = parseGridSyntax(declaration.value);
  const horizontal = declaration.prop === 'grid-column';

  return {
    value: declaration.value.replace(' / true', ''),
    declarations: [
      postcss.decl({
        prop: horizontal ? '-ms-grid-column' : '-ms-grid-row',
        value: placement.index
      }),
      postcss.decl({
        prop: horizontal ? '-ms-grid-column-span' : '-ms-grid-row-span',
        value: placement.span
      })
    ]
  };
}

const plugin = postcss.plugin('postcss-ms-grid', (options) => {
  return (css) => {
    css.walkDecls(declaration => {
      switch (declaration.prop) {
        case 'grid-template-columns':
        case 'grid-template-rows': {
          const processed = processContainer(declaration);
          declaration.parent.insertBefore(declaration, processed.declarations[0]);
          break;
        }
        case 'grid-column':
        case 'grid-row': {
          const processed = processElement(declaration);
          declaration.parent.insertBefore(declaration, processed.declarations[0]);
          declaration.parent.insertBefore(declaration, processed.declarations[1]);
          declaration.value = processed.value;
          break;
        }
        case 'display':
          if (declaration.value === 'grid') {
            declaration.parent.prepend(postcss.decl({ prop: 'display', value: '-ms-grid' }));
          }
      }
    });
  };
});

module.exports = plugin;
