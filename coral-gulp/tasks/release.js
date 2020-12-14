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

module.exports = function (gulp) {
  const fs = require('fs');
  const exec = require('child_process').exec;
  const spawn = require('child_process').spawn;
  const inq = require('inquirer');
  const semver = require('semver');
  const plumb = require('./plumb')
  const argv = require('minimist')(process.argv.slice(2));
  const git = require('gulp-git');
  const bump = require('gulp-bump');
  const PluginError = require('plugin-error');
  const util = require('../helpers/util');
  const root = util.getRoot();
  const CWD = process.cwd();

  let modulePackageJson = util.getPackageJSON();

  // The version we'll actually release
  let releaseVersion;

  gulp.task('check-root-folder', function (done) {
    if (CWD !== root) {
      done(new PluginError('release', 'Release aborted: not in root folder.'));
    }

    done();
  });

  // Push current branch commits to origin
  gulp.task('push', function (done) {
    // Get the current branch name
    exec('git rev-parse --abbrev-ref HEAD', function (err, stdout, stderr) {
      if (err) {
        done(new PluginError('release', stderr));
      } else {
        const currentBranch = stdout.trim();

        git.push('origin', currentBranch, function (err) {
          if (err) {
            done(new PluginError('release', err.message));
          }

          done();
        });
      }
    });
  });

  // Tag and push release
  gulp.task('tag-release', function (done) {
    // Read updated package.json
    modulePackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    releaseVersion = 'v' + modulePackageJson.version;

    const releaseMessage = `releng - Release ${releaseVersion}`;

    git.tag(releaseVersion, releaseMessage, function (err) {
      if (err) {
        done(new PluginError('release', err.message));
      }

      git.push('origin', releaseVersion, function (err) {
        if (err) {
          done(new PluginError('release', err.message));
        }

        done();
      });
    });
  });

  // Increase release version based on user choice
  gulp.task('bump-version', function (done) {
    const doVersionBump = () => {
      gulp.src([`${CWD}/package.json`, `${CWD}/package-lock.json`])
        .pipe(plumb())
        .pipe(bump({version: releaseVersion}))
        .pipe(gulp.dest('./'))
        .pipe(git.commit(`releng - Release ${releaseVersion}`))
        .on('end', () => {
          done();
        });
    };

    const currentVersion = modulePackageJson.version;

    // Potential versions
    const patchVersion = semver.inc(currentVersion, 'patch');
    const minorVersion = semver.inc(currentVersion, 'minor');
    const majorVersion = semver.inc(currentVersion, 'major');
    const preVersion = semver.inc(currentVersion, 'prerelease', 'beta');
    const preMajorVersion = semver.inc(currentVersion, 'premajor', 'beta');
    const preMinorVersion = semver.inc(currentVersion, 'preminor', 'beta');
    const prePatchVersion = semver.inc(currentVersion, 'prepatch', 'beta');

    // Command line bump shortcuts
    if (argv.pre) {
      releaseVersion = preVersion;
    } else if (argv.patch) {
      releaseVersion = patchVersion;
    } else if (argv.minor) {
      releaseVersion = minorVersion;
    } else if (argv.major) {
      releaseVersion = majorVersion;
    } else if (argv.prepatch) {
      releaseVersion = prePatchVersion;
    } else if (argv.preMinorVersion) {
      releaseVersion = prePatchVersion;
    } else if (argv.preMajorVersion) {
      releaseVersion = prePatchVersion;
    } else if (argv.releaseVersion) {
      releaseVersion = argv.releaseVersion;
    }

    if (releaseVersion) {
      doVersionBump();
    } else {
      let choices = [];

      if (currentVersion.match('-beta')) {
        choices = choices.concat([
          {
            name: 'prerelease - ' + preVersion,
            value: preVersion
          }
        ]);
      }

      if (patchVersion !== majorVersion) {
        // Only provide these options if they're not identical
        // These options will be identical if the current version is a beta of a major version
        choices = choices.concat([
          {
            name: 'patch - ' + patchVersion,
            value: patchVersion
          },
          {
            name: 'minor - ' + minorVersion,
            value: minorVersion
          },
          {
            name: 'major - ' + majorVersion,
            value: majorVersion
          }
        ]);
      } else {
        // Provide only the major version if the current version if a beta of a major version
        choices = choices.concat([
          {
            name: 'major - ' + patchVersion,
            value: patchVersion
          }
        ]);
      }

      choices = choices.concat([
        {
          name: 'prepatch - ' + prePatchVersion,
          value: prePatchVersion
        },
        {
          name: 'preminor - ' + preMinorVersion,
          value: preMinorVersion
        },
        {
          name: 'premajor - ' + preMajorVersion,
          value: preMajorVersion
        },
        {
          name: 'custom',
          value: 'custom'
        }
      ]);

      inq.prompt([{
        type: 'list',
        name: 'version',
        message: `The current version is ${currentVersion}. What version would you like to release ?`,
        choices: choices
      }])
        .then(function (res) {
          if (res.version === 'custom') {
            inq.prompt([{
              type: 'input',
              name: 'version',
              message: 'What version would you like?'
            }])
              .then(function (res) {
                releaseVersion = res.version;
                doVersionBump();
              });
          } else {
            releaseVersion = res.version;
            doVersionBump();
          }
        });
    }
  });

  gulp.task('perform-release', function (done) {
    const release = () => {
      spawn(`
        gulp build &&
        gulp karma &&
        gulp examples &&
        gulp axe &&
        gulp minify-css && gulp minify-js &&
        cd coral-component-playground && gulp build && cd .. &&
        gulp playground &&
        gulp docs &&
        gulp push &&
        gulp tag-release &&
        npm publish --access public
      `, [], {shell: true, stdio: 'inherit'});

      done();
    };

    // Command line shortcut
    if (argv.confirm) {
      release();
    } else {
      inq.prompt({
        type: 'confirm',
        name: 'confirmed',
        message: `Release ${releaseVersion} ?`
      })
        .then(function (res) {
          if (res.confirmed) {
            release();
          }
        });
    }
  });

  // Full release task
  gulp.task('release',
    gulp.series(
      'check-root-folder',
      'bump-version',
      'perform-release'
    )
  );
};
