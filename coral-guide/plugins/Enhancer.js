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

const fs = require('fs');

class Enhancer {
  onHandleDocs(ev) {
    for (const doc of ev.data.docs) {
      if (doc.description && doc.description.indexOf('\n\nnull') !== -1) {
        doc.description = doc.description.replace('\n\nnull', '');
      }

      if (doc.extends && doc.extends.length > 1) {
        const extendArr = doc.extends.slice();
        const buildExpression = () => extendArr.length === 1 ? extendArr.pop() : extendArr.pop() + '(' + buildExpression() + ')';
        doc.expressionExtends = buildExpression();
      }

      if (doc.unknown) {
        let isEnhanced = [];
        let baseTag;
        let tag;

        doc.unknown.forEach((item) => {
          if (item.tagName === '@class') {
            doc.importStyle = item.tagValue.split('.')[1];

            doc.examples = doc.examples || [];
            doc.examples.unshift('<caption>JS constructor</caption>\nnew ' + item.tagValue + '();');

            doc.see = doc.see || [];

            const component = doc.memberof.split('/')[1].replace('coral-', '').replace('component-', '');
            doc.see.push('../examples/#' + component);
          }

          if (item.tagName === '@base') {
            doc.importStyle = '';
          }

          if (item.tagName === '@htmlbasetag') {
            baseTag = item.tagValue;
          }

          if (item.tagName === '@htmltag') {
            tag = item.tagValue;
          }

          if (item.tagName === '@classdesc') {
            doc.description = item.tagValue;
          }

          if (item.tagName === '@readonly') {
            isEnhanced.push('<code>read-only</code>');
          }

          if (item.tagName === '@htmlattributereflected') {
            isEnhanced.push('<code>reflected</code>');
          }

          if (item.tagName === '@default') {
            isEnhanced.push('<code>' + item.tagValue + '</code> by default.');
          }

          if (item.tagName === '@contentzone') {
            isEnhanced.push('<code>content-zone</code>');
          }
        });

        if (tag) {
          doc.examples = doc.examples || [];
          const markup = baseTag ? `<${baseTag} is="${tag}"></${baseTag}>` : `<${tag}></${tag}>`;
          doc.examples.unshift(`<caption>Markup</caption>\n${markup}`);
        }

        if (isEnhanced.length) {
          doc.description = doc.description + '\n<ul><li>' + isEnhanced.join('</li><li>') + '</li></ul>';
        }
      }

      if (doc.importStyle && doc.importStyle.indexOf('{') === -1) {
        doc.importStyle = `{${doc.importStyle}}`;
      }
    }
  }
}

module.exports = new Enhancer();
