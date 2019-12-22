const postcss = require('postcss');
const processor = postcss([require('..')]);

describe('Testing grid polyfill', () => {
  it('Should parse regular template', () => {
    expect.assertions(1);

    const css = `
      .container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 100px 100px 100px;
      }
    `;

    const expected = `
      .container {
        display: -ms-grid;
        display: grid;
        -ms-grid-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        -ms-grid-rows: 100px 100px 100px;
        grid-template-rows: 100px 100px 100px;
      }
    `

    return processor.process(css)
      .then(result => {
        expect(result.css).toMatch(expected);
      });
  });

  it('Should parse regular template with gap', () => {
    expect.assertions(1);

    const css = `
      .container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-column-gap: 100px;
      }
    `;

    const expected = `
      .container {
        display: -ms-grid;
        display: grid;
        -ms-grid-columns: 1fr 100px 1fr 100px 1fr;
        grid-template-columns: 1fr 1fr 1fr;
        grid-column-gap: 100px;
      }
    `

    return processor.process(css)
      .then(result => {
        expect(result.css).toMatch(expected);
      });
  });

  it('Should parse repeat function', () => {
    expect.assertions(1);

    const css = `
      .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
      }
    `;

    const expected = `
      .container {
        display: -ms-grid;
        display: grid;
        -ms-grid-columns: 1fr 1fr 1fr;
        grid-template-columns: repeat(3, 1fr);
      }
    `

    return processor.process(css)
      .then(result => {
        expect(result.css).toMatch(expected);
      });
  });

  it('Should parse repeat function with gap', () => {
    expect.assertions(1);

    const css = `
      .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-column-gap: 100px;
      }
    `;

    const expected = `
      .container {
        display: -ms-grid;
        display: grid;
        -ms-grid-columns: 1fr 100px 1fr 100px 1fr;
        grid-template-columns: repeat(3, 1fr);
        grid-column-gap: 100px;
      }
    `

    return processor.process(css)
      .then(result => {
        expect(result.css).toMatch(expected);
      });
  });

  it('Should parse grid position', () => {
    expect.assertions(1);

    const css = `
      .element {
        grid-row: 1;
        grid-column: 2;
      }
    `;

    const expected = `
      .element {
        -ms-grid-row: 1;
        -ms-grid-row-span: 1;
        grid-row: 1;
        -ms-grid-column: 2;
        -ms-grid-column-span: 1;
        grid-column: 2;
      }
    `

    return processor.process(css)
      .then(result => {
        expect(result.css).toMatch(expected);
      });
  });

  it('Should parse grid position with span', () => {
    expect.assertions(1);

    const css = `
      .element {
        grid-row: 1 / span 2;
        grid-column: 2 / span 1;
      }
    `;

    const expected = `
      .element {
        -ms-grid-row: 1;
        -ms-grid-row-span: 2;
        grid-row: 1 / span 2;
        -ms-grid-column: 2;
        -ms-grid-column-span: 1;
        grid-column: 2 / span 1;
      }
    `

    return processor.process(css)
      .then(result => {
        expect(result.css).toMatch(expected);
      });
  });

  it('Should parse grid position with gap', () => {
    expect.assertions(1);

    const css = `
      .element {
        grid-row: 1 / span 2 / true;
        grid-column: 2 / span 1 / true;
      }
    `;

    const expected = `
      .element {
        -ms-grid-row: 1;
        -ms-grid-row-span: 3;
        grid-row: 1 / span 2;
        -ms-grid-column: 3;
        -ms-grid-column-span: 1;
        grid-column: 2 / span 1;
      }
    `

    return processor.process(css)
      .then(result => {
        expect(result.css).toMatch(expected);
      });
  });
});