const fs = require('fs-extra');
const concat = require('concat');

build = async () => {
    try {
        const files = [
            'dist/angular-formio-web-component/runtime.js',
            'dist/angular-formio-web-component/polyfills.js',
            //'dist/angular-formio-web-component/es2015-polyfills.js',
            'dist/angular-formio-web-component/scripts.js',
            'dist/angular-formio-web-component/main.js',
        ];
        await fs.ensureDir('web-component-scripts');
        await concat(files, 'web-component-scripts/formio-web-components.js');
    } catch (e) {
        console.log('Error happend while concatinating: ', e.message)
    }
}
build();