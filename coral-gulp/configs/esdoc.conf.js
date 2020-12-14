/**
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const path = require('path');
const util = require('../helpers/util');

const root = util.getRoot();

const config = {
  source: './src/scripts',
  destination: './dist/documentation',
  plugins: [
    {name: 'esdoc-external-ecmascript-plugin', option: {enable: false}},
    {name: path.join(root, 'coral-guide/plugins/Externals.js')},
    {
      name: 'esdoc-standard-plugin',
      option: {
        accessor: {access: ['public']},
        brand: {
          logo: path.join(root, 'coral-guide/assets/adobe_logo-2.svg'),
          title: 'Coral Spectrum',
          repository: 'https://github.com/adobe/coral-spectrum',
          site: 'http://opensource.adobe.com/coral-spectrum/documentation/'
        }
      }
    },
    {name: 'esdoc-member-plugin'},
    {
      name: 'esdoc-importpath-plugin',
      option: {
        stripPackageName: false,
        replaces: [
          {from: '.+', to: ''}
        ]
      }
    },
    {name: 'esdoc-lint-plugin', option: {enable: false}},
    {name: path.join(root, 'coral-guide/plugins/Enhancer.js')},
    {
      name: 'esdoc-inject-script-plugin',
      option: {
        enable: true,
        scripts: [path.join(root, 'coral-guide/scripts/typekit.js'), path.join(root, 'coral-guide/scripts/guide.js')]
      }
    },
    {
      name: 'esdoc-inject-style-plugin',
      option: {enable: true, styles: [path.join(root, 'coral-guide/styles/guide.css')]}
    }
  ]
};

// Document all components if we're in the top level builder
if (util.isTLB()) {
  config.source = '.';
  config.includes = ['^.external-ecmascript.js', '^coral-[a-z]+-[a-z]+/src/scripts', '^coral-[a-z]+/src/scripts'];
  config.excludes = ['^node_modules', '^dist', '^coral-component-playground', '^src/scripts/version.js'];

  config.plugins.find(plugin => plugin.name === 'esdoc-standard-plugin').option.manual = {
    index: path.join(root, 'index.md'),
    globalIndex: true,
    asset: path.join(root, 'coral-guide/assets'),
    'files': [
      path.join(root, 'README.md'),
      path.join(root, 'coral-guide/manual/overview.md'),
      path.join(root, 'coral-guide/manual/manual.md'),
      path.join(root, 'coral-guide/manual/upgrade.md'),
      path.join(root, 'coral-guide/manual/styles.md'),
      path.join(root, 'coral-guide/manual/architecture.md'),
      path.join(root, 'coral-guide/manual/contribution.md')
    ]
  };
}

module.exports = config;
