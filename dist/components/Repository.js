'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Requestable2 = require('./Requestable');

var _Requestable3 = _interopRequireDefault(_Requestable2);

var _utf = require('utf8');

var _utf2 = _interopRequireDefault(_utf);

var _jsBase = require('js-base64');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @copyright  2013 Michael Aufreiter (Development Seed) and 2016 Yahoo Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @license    Licensed under {@link https://spdx.org/licenses/BSD-3-Clause-Clear.html BSD-3-Clause-Clear}.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *             Github.js is freely distributable.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var log = (0, _debug2.default)('github:repository');

/**
 * Repository encapsulates the functionality to create, query, and modify files.
 */

var Repository = function (_Requestable) {
   _inherits(Repository, _Requestable);

   /**
    * Create a Repository.
    * @param {string} fullname - the full name of the repository
    * @param {Requestable.auth} [auth] - information required to authenticate to Github
    * @param {string} [apiBase=https://api.github.com] - the base Github API URL
    */
   function Repository(fullname, auth, apiBase) {
      _classCallCheck(this, Repository);

      var _this = _possibleConstructorReturn(this, (Repository.__proto__ || Object.getPrototypeOf(Repository)).call(this, auth, apiBase));

      _this.__fullname = fullname;
      _this.__currentTree = {
         branch: null,
         sha: null
      };
      return _this;
   }

   /**
    * Get a reference
    * @see https://developer.github.com/v3/git/refs/#get-a-reference
    * @param {string} ref - the reference to get
    * @param {Requestable.callback} [cb] - will receive the reference's refSpec or a list of refSpecs that match `ref`
    * @return {Promise} - the promise for the http request
    */


   _createClass(Repository, [{
      key: 'getRef',
      value: function getRef(ref, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/git/refs/' + ref, null, cb);
      }

      /**
       * Create a reference
       * @see https://developer.github.com/v3/git/refs/#create-a-reference
       * @param {Object} options - the object describing the ref
       * @param {Requestable.callback} [cb] - will receive the ref
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'createRef',
      value: function createRef(options, cb) {
         return this._request('POST', '/repos/' + this.__fullname + '/git/refs', options, cb);
      }

      /**
       * Delete a reference
       * @see https://developer.github.com/v3/git/refs/#delete-a-reference
       * @param {string} ref - the name of the ref to delte
       * @param {Requestable.callback} [cb] - will receive true if the request is successful
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'deleteRef',
      value: function deleteRef(ref, cb) {
         return this._request('DELETE', '/repos/' + this.__fullname + '/git/refs/' + ref, null, cb);
      }

      /**
       * Delete a repository
       * @see https://developer.github.com/v3/repos/#delete-a-repository
       * @param {Requestable.callback} [cb] - will receive true if the request is successful
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'deleteRepo',
      value: function deleteRepo(cb) {
         return this._request('DELETE', '/repos/' + this.__fullname, null, cb);
      }

      /**
       * List the tags on a repository
       * @see https://developer.github.com/v3/repos/#list-tags
       * @param {Requestable.callback} [cb] - will receive the tag data
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'listTags',
      value: function listTags(cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/tags', null, cb);
      }

      /**
       * List the open pull requests on the repository
       * @see https://developer.github.com/v3/pulls/#list-pull-requests
       * @param {Object} options - options to filter the search
       * @param {Requestable.callback} [cb] - will receive the list of PRs
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'listPullRequests',
      value: function listPullRequests(options, cb) {
         options = options || {};
         return this._request('GET', '/repos/' + this.__fullname + '/pulls', options, cb);
      }

      /**
       * Get information about a specific pull request
       * @see https://developer.github.com/v3/pulls/#get-a-single-pull-request
       * @param {number} number - the PR you wish to fetch
       * @param {Requestable.callback} [cb] - will receive the PR from the API
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getPullRequest',
      value: function getPullRequest(number, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/pulls/' + number, null, cb);
      }

      /**
       * List the files of a specific pull request
       * @see https://developer.github.com/v3/pulls/#list-pull-requests-files
       * @param {number|string} number - the PR you wish to fetch
       * @param {Requestable.callback} [cb] - will receive the list of files from the API
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'listPullRequestFiles',
      value: function listPullRequestFiles(number, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/pulls/' + number + '/files', null, cb);
      }

      /**
       * Compare two branches/commits/repositories
       * @see https://developer.github.com/v3/repos/commits/#compare-two-commits
       * @param {string} base - the base commit
       * @param {string} head - the head commit
       * @param {Requestable.callback} cb - will receive the comparison
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'compareBranches',
      value: function compareBranches(base, head, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/compare/' + base + '...' + head, null, cb);
      }

      /**
       * List all the branches for the repository
       * @see https://developer.github.com/v3/repos/#list-branches
       * @param {Requestable.callback} cb - will receive the list of branches
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'listBranches',
      value: function listBranches(cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/branches', null, cb);
      }

      /**
       * Get a raw blob from the repository
       * @see https://developer.github.com/v3/git/blobs/#get-a-blob
       * @param {string} sha - the sha of the blob to fetch
       * @param {Requestable.callback} cb - will receive the blob from the API
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getBlob',
      value: function getBlob(sha, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/git/blobs/' + sha, null, cb, 'raw');
      }

      /**
       * Get a single branch
       * @see https://developer.github.com/v3/repos/branches/#get-branch
       * @param {string} branch - the name of the branch to fetch
       * @param {Requestable.callback} cb - will receive the branch from the API
       * @returns {Promise} - the promise for the http request
       */

   }, {
      key: 'getBranch',
      value: function getBranch(branch, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/branches/' + branch, null, cb);
      }

      /**
       * Get a commit from the repository
       * @see https://developer.github.com/v3/repos/commits/#get-a-single-commit
       * @param {string} sha - the sha for the commit to fetch
       * @param {Requestable.callback} cb - will receive the commit data
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getCommit',
      value: function getCommit(sha, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/commits/' + sha, null, cb);
      }

      /**
       * List the commits on a repository, optionally filtering by path, author or time range
       * @see https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository
       * @param {Object} [options] - the filtering options for commits
       * @param {string} [options.sha] - the SHA or branch to start from
       * @param {string} [options.path] - the path to search on
       * @param {string} [options.author] - the commit author
       * @param {(Date|string)} [options.since] - only commits after this date will be returned
       * @param {(Date|string)} [options.until] - only commits before this date will be returned
       * @param {Requestable.callback} cb - will receive the list of commits found matching the criteria
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'listCommits',
      value: function listCommits(options, cb) {
         options = options || {};
         if (typeof options === 'function') {
            cb = options;
            options = {};
         }
         options.since = this._dateToISO(options.since);
         options.until = this._dateToISO(options.until);

         return this._request('GET', '/repos/' + this.__fullname + '/commits', options, cb);
      }

      /**
       * List the commits on a pull request
       * @see https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository
       * @param {number|string} number - the number of the pull request to list the commits
       * @param {Object} [options] - the filtering options for commits
       * @param {Requestable.callback} [cb] - will receive the commits information
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'listCommitsOnPR',
      value: function listCommitsOnPR(number, options, cb) {
         options = options || {};
         if (typeof options === 'function') {
            cb = options;
            options = {};
         }
         return this._request('GET', '/repos/' + this.__fullname + '/pulls/' + number + '/commits', options, cb);
      }

      /**
       * Gets a single commit information for a repository
       * @see https://developer.github.com/v3/repos/commits/#get-a-single-commit
       * @param {string} ref - the reference for the commit-ish
       * @param {Requestable.callback} cb - will receive the commit information
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getSingleCommit',
      value: function getSingleCommit(ref, cb) {
         ref = ref || '';
         return this._request('GET', '/repos/' + this.__fullname + '/commits/' + ref, null, cb);
      }

      /**
       * Get tha sha for a particular object in the repository. This is a convenience function
       * @see https://developer.github.com/v3/repos/contents/#get-contents
       * @param {string} [branch] - the branch to look in, or the repository's default branch if omitted
       * @param {string} path - the path of the file or directory
       * @param {Requestable.callback} cb - will receive a description of the requested object, including a `SHA` property
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getSha',
      value: function getSha(branch, path, cb) {
         branch = branch ? '?ref=' + branch : '';
         return this._request('GET', '/repos/' + this.__fullname + '/contents/' + path + branch, null, cb);
      }

      /**
       * List the commit statuses for a particular sha, branch, or tag
       * @see https://developer.github.com/v3/repos/statuses/#list-statuses-for-a-specific-ref
       * @param {string} sha - the sha, branch, or tag to get statuses for
       * @param {Requestable.callback} cb - will receive the list of statuses
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'listStatuses',
      value: function listStatuses(sha, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/commits/' + sha + '/statuses', null, cb);
      }

      /**
       * Get the combined view of commit statuses for a particular sha, branch, or tag
       * @see https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
       * @param {string} sha - the sha, branch, or tag to get the combined status for
       * @param {Requestable.callback} cb - will receive the combined status
       * @returns {Promise} - the promise for the http request
       */

   }, {
      key: 'getCombinedStatus',
      value: function getCombinedStatus(sha, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/commits/' + sha + '/status', null, cb);
      }

      /**
       * Get a description of a git tree
       * @see https://developer.github.com/v3/git/trees/#get-a-tree
       * @param {string} treeSHA - the SHA of the tree to fetch
       * @param {Requestable.callback} cb - will receive the callback data
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getTree',
      value: function getTree(treeSHA, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/git/trees/' + treeSHA, null, cb);
      }

      /**
       * Create a blob
       * @see https://developer.github.com/v3/git/blobs/#create-a-blob
       * @param {(string|Buffer|Blob)} content - the content to add to the repository
       * @param {Requestable.callback} cb - will receive the details of the created blob
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'createBlob',
      value: function createBlob(content, cb) {
         var postBody = this._getContentObject(content);

         log('sending content', postBody);
         return this._request('POST', '/repos/' + this.__fullname + '/git/blobs', postBody, cb);
      }

      /**
       * Get the object that represents the provided content
       * @param {string|Buffer|Blob} content - the content to send to the server
       * @return {Object} the representation of `content` for the GitHub API
       */

   }, {
      key: '_getContentObject',
      value: function _getContentObject(content) {
         if (typeof content === 'string') {
            log('contet is a string');
            return {
               content: _utf2.default.encode(content),
               encoding: 'utf-8'
            };
         } else if (typeof Buffer !== 'undefined' && content instanceof Buffer) {
            log('We appear to be in Node');
            return {
               content: content.toString('base64'),
               encoding: 'base64'
            };
         } else if (typeof Blob !== 'undefined' && content instanceof Blob) {
            log('We appear to be in the browser');
            return {
               content: _jsBase.Base64.encode(content),
               encoding: 'base64'
            };
         } else {
            // eslint-disable-line
            log('Not sure what this content is: ' + (typeof content === 'undefined' ? 'undefined' : _typeof(content)) + ', ' + JSON.stringify(content));
            throw new Error('Unknown content passed to postBlob. Must be string or Buffer (node) or Blob (web)');
         }
      }

      /**
       * Update a tree in Git
       * @see https://developer.github.com/v3/git/trees/#create-a-tree
       * @param {string} baseTreeSHA - the SHA of the tree to update
       * @param {string} path - the path for the new file
       * @param {string} blobSHA - the SHA for the blob to put at `path`
       * @param {Requestable.callback} cb - will receive the new tree that is created
       * @return {Promise} - the promise for the http request
       * @deprecated use {@link Repository#createTree} instead
       */

   }, {
      key: 'updateTree',
      value: function updateTree(baseTreeSHA, path, blobSHA, cb) {
         var newTree = {
            base_tree: baseTreeSHA, // eslint-disable-line
            tree: [{
               path: path,
               sha: blobSHA,
               mode: '100644',
               type: 'blob'
            }]
         };

         return this._request('POST', '/repos/' + this.__fullname + '/git/trees', newTree, cb);
      }

      /**
       * Create a new tree in git
       * @see https://developer.github.com/v3/git/trees/#create-a-tree
       * @param {Object} tree - the tree to create
       * @param {string} baseSHA - the root sha of the tree
       * @param {Requestable.callback} cb - will receive the new tree that is created
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'createTree',
      value: function createTree(tree, baseSHA, cb) {
         return this._request('POST', '/repos/' + this.__fullname + '/git/trees', {
            tree: tree,
            base_tree: baseSHA // eslint-disable-line camelcase
         }, cb);
      }

      /**
       * Add a commit to the repository
       * @see https://developer.github.com/v3/git/commits/#create-a-commit
       * @param {string} parent - the SHA of the parent commit
       * @param {string} tree - the SHA of the tree for this commit
       * @param {string} message - the commit message
       * @param {Object} [options] - commit options
       * @param {Object} [options.author] - the author of the commit
       * @param {Object} [options.commiter] - the committer
       * @param {Requestable.callback} cb - will receive the commit that is created
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'commit',
      value: function commit(parent, tree, message, options, cb) {
         var _this2 = this;

         if (typeof options === 'function') {
            cb = options;
            options = {};
         }

         var data = {
            message: message,
            tree: tree,
            parents: [parent]
         };

         data = Object.assign({}, options, data);

         return this._request('POST', '/repos/' + this.__fullname + '/git/commits', data, cb).then(function (response) {
            _this2.__currentTree.sha = response.data.sha; // Update latest commit
            return response;
         });
      }

      /**
       * Update a ref
       * @see https://developer.github.com/v3/git/refs/#update-a-reference
       * @param {string} ref - the ref to update
       * @param {string} commitSHA - the SHA to point the reference to
       * @param {boolean} force - indicates whether to force or ensure a fast-forward update
       * @param {Requestable.callback} cb - will receive the updated ref back
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'updateHead',
      value: function updateHead(ref, commitSHA, force, cb) {
         return this._request('PATCH', '/repos/' + this.__fullname + '/git/refs/' + ref, {
            sha: commitSHA,
            force: force
         }, cb);
      }

      /**
       * Update commit status
       * @see https://developer.github.com/v3/repos/statuses/
       * @param {string} commitSHA - the SHA of the commit that should be updated
       * @param {object} options - Commit status parameters
       * @param {string} options.state - The state of the status. Can be one of: pending, success, error, or failure.
       * @param {string} [options.target_url] - The target URL to associate with this status.
       * @param {string} [options.description] - A short description of the status.
       * @param {string} [options.context] - A string label to differentiate this status among CI systems.
       * @param {Requestable.callback} cb - will receive the updated commit back
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'updateStatus',
      value: function updateStatus(commitSHA, options, cb) {
         return this._request('POST', '/repos/' + this.__fullname + '/statuses/' + commitSHA, options, cb);
      }

      /**
       * Update repository information
       * @see https://developer.github.com/v3/repos/#edit
       * @param {object} options - New parameters that will be set to the repository
       * @param {string} options.name - Name of the repository
       * @param {string} [options.description] - A short description of the repository
       * @param {string} [options.homepage] - A URL with more information about the repository
       * @param {boolean} [options.private] - Either true to make the repository private, or false to make it public.
       * @param {boolean} [options.has_issues] - Either true to enable issues for this repository, false to disable them.
       * @param {boolean} [options.has_wiki] - Either true to enable the wiki for this repository, false to disable it.
       * @param {boolean} [options.has_downloads] - Either true to enable downloads, false to disable them.
       * @param {string} [options.default_branch] - Updates the default branch for this repository.
       * @param {Requestable.callback} cb - will receive the updated repository back
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'updateRepository',
      value: function updateRepository(options, cb) {
         return this._request('PATCH', '/repos/' + this.__fullname, options, cb);
      }

      /**
        * Get information about the repository
        * @see https://developer.github.com/v3/repos/#get
        * @param {Requestable.callback} cb - will receive the information about the repository
        * @return {Promise} - the promise for the http request
        */

   }, {
      key: 'getDetails',
      value: function getDetails(cb) {
         return this._request('GET', '/repos/' + this.__fullname, null, cb);
      }

      /**
       * List the contributors to the repository
       * @see https://developer.github.com/v3/repos/#list-contributors
       * @param {Requestable.callback} cb - will receive the list of contributors
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getContributors',
      value: function getContributors(cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/contributors', null, cb);
      }

      /**
       * List the contributor stats to the repository
       * @see https://developer.github.com/v3/repos/#list-contributors
       * @param {Requestable.callback} cb - will receive the list of contributors
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getContributorStats',
      value: function getContributorStats(cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/stats/contributors', null, cb);
      }

      /**
       * List the users who are collaborators on the repository. The currently authenticated user must have
       * push access to use this method
       * @see https://developer.github.com/v3/repos/collaborators/#list-collaborators
       * @param {Requestable.callback} cb - will receive the list of collaborators
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getCollaborators',
      value: function getCollaborators(cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/collaborators', null, cb);
      }

      /**
       * Check if a user is a collaborator on the repository
       * @see https://developer.github.com/v3/repos/collaborators/#check-if-a-user-is-a-collaborator
       * @param {string} username - the user to check
       * @param {Requestable.callback} cb - will receive true if the user is a collaborator and false if they are not
       * @return {Promise} - the promise for the http request {Boolean} [description]
       */

   }, {
      key: 'isCollaborator',
      value: function isCollaborator(username, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/collaborators/' + username, null, cb);
      }

      /**
       * Get the contents of a repository
       * @see https://developer.github.com/v3/repos/contents/#get-contents
       * @param {string} ref - the ref to check
       * @param {string} path - the path containing the content to fetch
       * @param {boolean} raw - `true` if the results should be returned raw instead of GitHub's normalized format
       * @param {Requestable.callback} cb - will receive the fetched data
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getContents',
      value: function getContents(ref, path, raw, cb) {
         path = path ? '' + encodeURI(path) : '';
         return this._request('GET', '/repos/' + this.__fullname + '/contents/' + path, {
            ref: ref
         }, cb, raw);
      }

      /**
       * Get the README of a repository
       * @see https://developer.github.com/v3/repos/contents/#get-the-readme
       * @param {string} ref - the ref to check
       * @param {boolean} raw - `true` if the results should be returned raw instead of GitHub's normalized format
       * @param {Requestable.callback} cb - will receive the fetched data
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getReadme',
      value: function getReadme(ref, raw, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/readme', {
            ref: ref
         }, cb, raw);
      }

      /**
       * Fork a repository
       * @see https://developer.github.com/v3/repos/forks/#create-a-fork
       * @param {Requestable.callback} cb - will receive the information about the newly created fork
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'fork',
      value: function fork(cb) {
         return this._request('POST', '/repos/' + this.__fullname + '/forks', null, cb);
      }

      /**
       * Fork a repository to an organization
       * @see https://developer.github.com/v3/repos/forks/#create-a-fork
       * @param {String} org - organization where you'd like to create the fork.
       * @param {Requestable.callback} cb - will receive the information about the newly created fork
       * @return {Promise} - the promise for the http request
       *
       */

   }, {
      key: 'forkToOrg',
      value: function forkToOrg(org, cb) {
         return this._request('POST', '/repos/' + this.__fullname + '/forks?organization=' + org, null, cb);
      }

      /**
       * List a repository's forks
       * @see https://developer.github.com/v3/repos/forks/#list-forks
       * @param {Requestable.callback} cb - will receive the list of repositories forked from this one
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'listForks',
      value: function listForks(cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/forks', null, cb);
      }

      /**
       * Create a new branch from an existing branch.
       * @param {string} [oldBranch=master] - the name of the existing branch
       * @param {string} newBranch - the name of the new branch
       * @param {Requestable.callback} cb - will receive the commit data for the head of the new branch
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'createBranch',
      value: function createBranch(oldBranch, newBranch, cb) {
         var _this3 = this;

         if (typeof newBranch === 'function') {
            cb = newBranch;
            newBranch = oldBranch;
            oldBranch = 'master';
         }

         return this.getRef('heads/' + oldBranch).then(function (response) {
            var sha = response.data.object.sha;
            return _this3.createRef({
               sha: sha,
               ref: 'refs/heads/' + newBranch
            }, cb);
         });
      }

      /**
       * Create a new pull request
       * @see https://developer.github.com/v3/pulls/#create-a-pull-request
       * @param {Object} options - the pull request description
       * @param {Requestable.callback} cb - will receive the new pull request
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'createPullRequest',
      value: function createPullRequest(options, cb) {
         return this._request('POST', '/repos/' + this.__fullname + '/pulls', options, cb);
      }

      /**
       * Update a pull request
       * @see https://developer.github.com/v3/pulls/#update-a-pull-request
       * @param {number|string} number - the number of the pull request to update
       * @param {Object} options - the pull request description
       * @param {Requestable.callback} [cb] - will receive the pull request information
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'updatePullRequest',
      value: function updatePullRequest(number, options, cb) {
         return this._request('PATCH', '/repos/' + this.__fullname + '/pulls/' + number, options, cb);
      }

      /**
       * List the hooks for the repository
       * @see https://developer.github.com/v3/repos/hooks/#list-hooks
       * @param {Requestable.callback} cb - will receive the list of hooks
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'listHooks',
      value: function listHooks(cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/hooks', null, cb);
      }

      /**
       * Get a hook for the repository
       * @see https://developer.github.com/v3/repos/hooks/#get-single-hook
       * @param {number} id - the id of the webook
       * @param {Requestable.callback} cb - will receive the details of the webook
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getHook',
      value: function getHook(id, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/hooks/' + id, null, cb);
      }

      /**
       * Add a new hook to the repository
       * @see https://developer.github.com/v3/repos/hooks/#create-a-hook
       * @param {Object} options - the configuration describing the new hook
       * @param {Requestable.callback} cb - will receive the new webhook
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'createHook',
      value: function createHook(options, cb) {
         return this._request('POST', '/repos/' + this.__fullname + '/hooks', options, cb);
      }

      /**
       * Edit an existing webhook
       * @see https://developer.github.com/v3/repos/hooks/#edit-a-hook
       * @param {number} id - the id of the webhook
       * @param {Object} options - the new description of the webhook
       * @param {Requestable.callback} cb - will receive the updated webhook
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'updateHook',
      value: function updateHook(id, options, cb) {
         return this._request('PATCH', '/repos/' + this.__fullname + '/hooks/' + id, options, cb);
      }

      /**
       * Delete a webhook
       * @see https://developer.github.com/v3/repos/hooks/#delete-a-hook
       * @param {number} id - the id of the webhook to be deleted
       * @param {Requestable.callback} cb - will receive true if the call is successful
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'deleteHook',
      value: function deleteHook(id, cb) {
         return this._request('DELETE', '/repos/' + this.__fullname + '/hooks/' + id, null, cb);
      }

      /**
       * List the deploy keys for the repository
       * @see https://developer.github.com/v3/repos/keys/#list-deploy-keys
       * @param {Requestable.callback} cb - will receive the list of deploy keys
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'listKeys',
      value: function listKeys(cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/keys', null, cb);
      }

      /**
       * Get a deploy key for the repository
       * @see https://developer.github.com/v3/repos/keys/#get-a-deploy-key
       * @param {number} id - the id of the deploy key
       * @param {Requestable.callback} cb - will receive the details of the deploy key
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getKey',
      value: function getKey(id, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/keys/' + id, null, cb);
      }

      /**
       * Add a new deploy key to the repository
       * @see https://developer.github.com/v3/repos/keys/#add-a-new-deploy-key
       * @param {Object} options - the configuration describing the new deploy key
       * @param {Requestable.callback} cb - will receive the new deploy key
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'createKey',
      value: function createKey(options, cb) {
         return this._request('POST', '/repos/' + this.__fullname + '/keys', options, cb);
      }

      /**
       * Delete a deploy key
       * @see https://developer.github.com/v3/repos/keys/#remove-a-deploy-key
       * @param {number} id - the id of the deploy key to be deleted
       * @param {Requestable.callback} cb - will receive true if the call is successful
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'deleteKey',
      value: function deleteKey(id, cb) {
         return this._request('DELETE', '/repos/' + this.__fullname + '/keys/' + id, null, cb);
      }

      /**
       * Delete a file from a branch
       * @see https://developer.github.com/v3/repos/contents/#delete-a-file
       * @param {string} branch - the branch to delete from, or the default branch if not specified
       * @param {string} path - the path of the file to remove
       * @param {Requestable.callback} cb - will receive the commit in which the delete occurred
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'deleteFile',
      value: function deleteFile(branch, path, cb) {
         var _this4 = this;

         return this.getSha(branch, path).then(function (response) {
            var deleteCommit = {
               message: 'Delete the file at \'' + path + '\'',
               sha: response.data.sha,
               branch: branch
            };
            return _this4._request('DELETE', '/repos/' + _this4.__fullname + '/contents/' + path, deleteCommit, cb);
         });
      }

      /**
       * Change all references in a repo from oldPath to new_path
       * @param {string} branch - the branch to carry out the reference change, or the default branch if not specified
       * @param {string} oldPath - original path
       * @param {string} newPath - new reference path
       * @param {Requestable.callback} cb - will receive the commit in which the move occurred
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'move',
      value: function move(branch, oldPath, newPath, cb) {
         var _this5 = this;

         var oldSha = void 0;
         return this.getRef('heads/' + branch).then(function (_ref) {
            var object = _ref.data.object;
            return _this5.getTree(object.sha + '?recursive=true');
         }).then(function (_ref2) {
            var _ref2$data = _ref2.data,
                tree = _ref2$data.tree,
                sha = _ref2$data.sha;

            oldSha = sha;
            var newTree = tree.map(function (ref) {
               if (ref.path === oldPath) {
                  ref.path = newPath;
               }
               if (ref.type === 'tree') {
                  delete ref.sha;
               }
               return ref;
            });
            return _this5.createTree(newTree);
         }).then(function (_ref3) {
            var tree = _ref3.data;
            return _this5.commit(oldSha, tree.sha, 'Renamed \'' + oldPath + '\' to \'' + newPath + '\'');
         }).then(function (_ref4) {
            var commit = _ref4.data;
            return _this5.updateHead('heads/' + branch, commit.sha, true, cb);
         });
      }

      /**
       * Write a file to the repository
       * @see https://developer.github.com/v3/repos/contents/#update-a-file
       * @param {string} branch - the name of the branch
       * @param {string} path - the path for the file
       * @param {string} content - the contents of the file
       * @param {string} message - the commit message
       * @param {Object} [options] - commit options
       * @param {Object} [options.author] - the author of the commit
       * @param {Object} [options.commiter] - the committer
       * @param {boolean} [options.encode] - true if the content should be base64 encoded
       * @param {Requestable.callback} cb - will receive the new commit
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'writeFile',
      value: function writeFile(branch, path, content, message, options, cb) {
         var _this6 = this;

         options = options || {};
         if (typeof options === 'function') {
            cb = options;
            options = {};
         }
         var filePath = path ? encodeURI(path) : '';
         var shouldEncode = options.encode !== false;
         var commit = {
            branch: branch,
            message: message,
            author: options.author,
            committer: options.committer,
            content: shouldEncode ? _jsBase.Base64.encode(content) : content
         };

         return this.getSha(branch, filePath).then(function (response) {
            commit.sha = response.data.sha;
            return _this6._request('PUT', '/repos/' + _this6.__fullname + '/contents/' + filePath, commit, cb);
         }, function () {
            return _this6._request('PUT', '/repos/' + _this6.__fullname + '/contents/' + filePath, commit, cb);
         });
      }

      /**
       * Check if a repository is starred by you
       * @see https://developer.github.com/v3/activity/starring/#check-if-you-are-starring-a-repository
       * @param {Requestable.callback} cb - will receive true if the repository is starred and false if the repository
       *                                  is not starred
       * @return {Promise} - the promise for the http request {Boolean} [description]
       */

   }, {
      key: 'isStarred',
      value: function isStarred(cb) {
         return this._request204or404('/user/starred/' + this.__fullname, null, cb);
      }

      /**
       * Star a repository
       * @see https://developer.github.com/v3/activity/starring/#star-a-repository
       * @param {Requestable.callback} cb - will receive true if the repository is starred
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'star',
      value: function star(cb) {
         return this._request('PUT', '/user/starred/' + this.__fullname, null, cb);
      }

      /**
       * Unstar a repository
       * @see https://developer.github.com/v3/activity/starring/#unstar-a-repository
       * @param {Requestable.callback} cb - will receive true if the repository is unstarred
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'unstar',
      value: function unstar(cb) {
         return this._request('DELETE', '/user/starred/' + this.__fullname, null, cb);
      }

      /**
       * Create a new release
       * @see https://developer.github.com/v3/repos/releases/#create-a-release
       * @param {Object} options - the description of the release
       * @param {Requestable.callback} cb - will receive the newly created release
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'createRelease',
      value: function createRelease(options, cb) {
         return this._request('POST', '/repos/' + this.__fullname + '/releases', options, cb);
      }

      /**
       * Edit a release
       * @see https://developer.github.com/v3/repos/releases/#edit-a-release
       * @param {string} id - the id of the release
       * @param {Object} options - the description of the release
       * @param {Requestable.callback} cb - will receive the modified release
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'updateRelease',
      value: function updateRelease(id, options, cb) {
         return this._request('PATCH', '/repos/' + this.__fullname + '/releases/' + id, options, cb);
      }

      /**
       * Get information about all releases
       * @see https://developer.github.com/v3/repos/releases/#list-releases-for-a-repository
       * @param {Requestable.callback} cb - will receive the release information
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'listReleases',
      value: function listReleases(cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/releases', null, cb);
      }

      /**
       * Get information about a release
       * @see https://developer.github.com/v3/repos/releases/#get-a-single-release
       * @param {string} id - the id of the release
       * @param {Requestable.callback} cb - will receive the release information
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'getRelease',
      value: function getRelease(id, cb) {
         return this._request('GET', '/repos/' + this.__fullname + '/releases/' + id, null, cb);
      }

      /**
       * Delete a release
       * @see https://developer.github.com/v3/repos/releases/#delete-a-release
       * @param {string} id - the release to be deleted
       * @param {Requestable.callback} cb - will receive true if the operation is successful
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'deleteRelease',
      value: function deleteRelease(id, cb) {
         return this._request('DELETE', '/repos/' + this.__fullname + '/releases/' + id, null, cb);
      }

      /**
       * Merge a pull request
       * @see https://developer.github.com/v3/pulls/#merge-a-pull-request-merge-button
       * @param {number|string} number - the number of the pull request to merge
       * @param {Object} options - the merge options for the pull request
       * @param {Requestable.callback} [cb] - will receive the merge information if the operation is successful
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'mergePullRequest',
      value: function mergePullRequest(number, options, cb) {
         return this._request('PUT', '/repos/' + this.__fullname + '/pulls/' + number + '/merge', options, cb);
      }

      /**
       * Get information about all projects
       * @see https://developer.github.com/v3/projects/#list-repository-projects
       * @param {Requestable.callback} [cb] - will receive the list of projects
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'listProjects',
      value: function listProjects(cb) {
         return this._requestAllPages('/repos/' + this.__fullname + '/projects', { AcceptHeader: 'inertia-preview' }, cb);
      }

      /**
       * Create a new project
       * @see https://developer.github.com/v3/projects/#create-a-repository-project
       * @param {Object} options - the description of the project
       * @param {Requestable.callback} cb - will receive the newly created project
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: 'createProject',
      value: function createProject(options, cb) {
         options = options || {};
         options.AcceptHeader = 'inertia-preview';
         return this._request('POST', '/repos/' + this.__fullname + '/projects', options, cb);
      }
   }]);

   return Repository;
}(_Requestable3.default);

module.exports = Repository;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlcG9zaXRvcnkuanMiXSwibmFtZXMiOlsibG9nIiwiUmVwb3NpdG9yeSIsImZ1bGxuYW1lIiwiYXV0aCIsImFwaUJhc2UiLCJfX2Z1bGxuYW1lIiwiX19jdXJyZW50VHJlZSIsImJyYW5jaCIsInNoYSIsInJlZiIsImNiIiwiX3JlcXVlc3QiLCJvcHRpb25zIiwibnVtYmVyIiwiYmFzZSIsImhlYWQiLCJzaW5jZSIsIl9kYXRlVG9JU08iLCJ1bnRpbCIsInBhdGgiLCJ0cmVlU0hBIiwiY29udGVudCIsInBvc3RCb2R5IiwiX2dldENvbnRlbnRPYmplY3QiLCJVdGY4IiwiZW5jb2RlIiwiZW5jb2RpbmciLCJCdWZmZXIiLCJ0b1N0cmluZyIsIkJsb2IiLCJCYXNlNjQiLCJKU09OIiwic3RyaW5naWZ5IiwiRXJyb3IiLCJiYXNlVHJlZVNIQSIsImJsb2JTSEEiLCJuZXdUcmVlIiwiYmFzZV90cmVlIiwidHJlZSIsIm1vZGUiLCJ0eXBlIiwiYmFzZVNIQSIsInBhcmVudCIsIm1lc3NhZ2UiLCJkYXRhIiwicGFyZW50cyIsIk9iamVjdCIsImFzc2lnbiIsInRoZW4iLCJyZXNwb25zZSIsImNvbW1pdFNIQSIsImZvcmNlIiwidXNlcm5hbWUiLCJyYXciLCJlbmNvZGVVUkkiLCJvcmciLCJvbGRCcmFuY2giLCJuZXdCcmFuY2giLCJnZXRSZWYiLCJvYmplY3QiLCJjcmVhdGVSZWYiLCJpZCIsImdldFNoYSIsImRlbGV0ZUNvbW1pdCIsIm9sZFBhdGgiLCJuZXdQYXRoIiwib2xkU2hhIiwiZ2V0VHJlZSIsIm1hcCIsImNyZWF0ZVRyZWUiLCJjb21taXQiLCJ1cGRhdGVIZWFkIiwiZmlsZVBhdGgiLCJzaG91bGRFbmNvZGUiLCJhdXRob3IiLCJjb21taXR0ZXIiLCJfcmVxdWVzdDIwNG9yNDA0IiwiX3JlcXVlc3RBbGxQYWdlcyIsIkFjY2VwdEhlYWRlciIsIlJlcXVlc3RhYmxlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBT0E7Ozs7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InNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIEBjb3B5cmlnaHQgIDIwMTMgTWljaGFlbCBBdWZyZWl0ZXIgKERldmVsb3BtZW50IFNlZWQpIGFuZCAyMDE2IFlhaG9vIEluYy5cbiAqIEBsaWNlbnNlICAgIExpY2Vuc2VkIHVuZGVyIHtAbGluayBodHRwczovL3NwZHgub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZS1DbGVhci5odG1sIEJTRC0zLUNsYXVzZS1DbGVhcn0uXG4gKiAgICAgICAgICAgICBHaXRodWIuanMgaXMgZnJlZWx5IGRpc3RyaWJ1dGFibGUuXG4gKi9cblxuaW1wb3J0IFJlcXVlc3RhYmxlIGZyb20gJy4vUmVxdWVzdGFibGUnO1xuaW1wb3J0IFV0ZjggZnJvbSAndXRmOCc7XG5pbXBvcnQge1xuICAgQmFzZTY0LFxufSBmcm9tICdqcy1iYXNlNjQnO1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmNvbnN0IGxvZyA9IGRlYnVnKCdnaXRodWI6cmVwb3NpdG9yeScpO1xuXG4vKipcbiAqIFJlcG9zaXRvcnkgZW5jYXBzdWxhdGVzIHRoZSBmdW5jdGlvbmFsaXR5IHRvIGNyZWF0ZSwgcXVlcnksIGFuZCBtb2RpZnkgZmlsZXMuXG4gKi9cbmNsYXNzIFJlcG9zaXRvcnkgZXh0ZW5kcyBSZXF1ZXN0YWJsZSB7XG4gICAvKipcbiAgICAqIENyZWF0ZSBhIFJlcG9zaXRvcnkuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gZnVsbG5hbWUgLSB0aGUgZnVsbCBuYW1lIG9mIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmF1dGh9IFthdXRoXSAtIGluZm9ybWF0aW9uIHJlcXVpcmVkIHRvIGF1dGhlbnRpY2F0ZSB0byBHaXRodWJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbYXBpQmFzZT1odHRwczovL2FwaS5naXRodWIuY29tXSAtIHRoZSBiYXNlIEdpdGh1YiBBUEkgVVJMXG4gICAgKi9cbiAgIGNvbnN0cnVjdG9yKGZ1bGxuYW1lLCBhdXRoLCBhcGlCYXNlKSB7XG4gICAgICBzdXBlcihhdXRoLCBhcGlCYXNlKTtcbiAgICAgIHRoaXMuX19mdWxsbmFtZSA9IGZ1bGxuYW1lO1xuICAgICAgdGhpcy5fX2N1cnJlbnRUcmVlID0ge1xuICAgICAgICAgYnJhbmNoOiBudWxsLFxuICAgICAgICAgc2hhOiBudWxsLFxuICAgICAgfTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgYSByZWZlcmVuY2VcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXQvcmVmcy8jZ2V0LWEtcmVmZXJlbmNlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcmVmIC0gdGhlIHJlZmVyZW5jZSB0byBnZXRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIHJlZmVyZW5jZSdzIHJlZlNwZWMgb3IgYSBsaXN0IG9mIHJlZlNwZWNzIHRoYXQgbWF0Y2ggYHJlZmBcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0UmVmKHJlZiwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9naXQvcmVmcy8ke3JlZn1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgcmVmZXJlbmNlXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2l0L3JlZnMvI2NyZWF0ZS1hLXJlZmVyZW5jZVxuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgb2JqZWN0IGRlc2NyaWJpbmcgdGhlIHJlZlxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgcmVmXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGNyZWF0ZVJlZihvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BPU1QnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9naXQvcmVmc2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBEZWxldGUgYSByZWZlcmVuY2VcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXQvcmVmcy8jZGVsZXRlLWEtcmVmZXJlbmNlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcmVmIC0gdGhlIG5hbWUgb2YgdGhlIHJlZiB0byBkZWx0ZVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSByZXF1ZXN0IGlzIHN1Y2Nlc3NmdWxcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZGVsZXRlUmVmKHJlZiwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdERUxFVEUnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9naXQvcmVmcy8ke3JlZn1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVsZXRlIGEgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zLyNkZWxldGUtYS1yZXBvc2l0b3J5XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIHJlcXVlc3QgaXMgc3VjY2Vzc2Z1bFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBkZWxldGVSZXBvKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTGlzdCB0aGUgdGFncyBvbiBhIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy8jbGlzdC10YWdzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSB0YWcgZGF0YVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0VGFncyhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3RhZ3NgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTGlzdCB0aGUgb3BlbiBwdWxsIHJlcXVlc3RzIG9uIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcHVsbHMvI2xpc3QtcHVsbC1yZXF1ZXN0c1xuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBvcHRpb25zIHRvIGZpbHRlciB0aGUgc2VhcmNoXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBsaXN0IG9mIFBSc1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0UHVsbFJlcXVlc3RzKG9wdGlvbnMsIGNiKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wdWxsc2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgaW5mb3JtYXRpb24gYWJvdXQgYSBzcGVjaWZpYyBwdWxsIHJlcXVlc3RcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9wdWxscy8jZ2V0LWEtc2luZ2xlLXB1bGwtcmVxdWVzdFxuICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIHRoZSBQUiB5b3Ugd2lzaCB0byBmZXRjaFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgUFIgZnJvbSB0aGUgQVBJXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldFB1bGxSZXF1ZXN0KG51bWJlciwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wdWxscy8ke251bWJlcn1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTGlzdCB0aGUgZmlsZXMgb2YgYSBzcGVjaWZpYyBwdWxsIHJlcXVlc3RcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9wdWxscy8jbGlzdC1wdWxsLXJlcXVlc3RzLWZpbGVzXG4gICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd9IG51bWJlciAtIHRoZSBQUiB5b3Ugd2lzaCB0byBmZXRjaFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBmaWxlcyBmcm9tIHRoZSBBUElcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbGlzdFB1bGxSZXF1ZXN0RmlsZXMobnVtYmVyLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3B1bGxzLyR7bnVtYmVyfS9maWxlc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDb21wYXJlIHR3byBicmFuY2hlcy9jb21taXRzL3JlcG9zaXRvcmllc1xuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2NvbW1pdHMvI2NvbXBhcmUtdHdvLWNvbW1pdHNcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlIC0gdGhlIGJhc2UgY29tbWl0XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gaGVhZCAtIHRoZSBoZWFkIGNvbW1pdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGNvbXBhcmlzb25cbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgY29tcGFyZUJyYW5jaGVzKGJhc2UsIGhlYWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vY29tcGFyZS8ke2Jhc2V9Li4uJHtoZWFkfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IGFsbCB0aGUgYnJhbmNoZXMgZm9yIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvI2xpc3QtYnJhbmNoZXNcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBsaXN0IG9mIGJyYW5jaGVzXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGxpc3RCcmFuY2hlcyhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2JyYW5jaGVzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBhIHJhdyBibG9iIGZyb20gdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXQvYmxvYnMvI2dldC1hLWJsb2JcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBzaGEgLSB0aGUgc2hhIG9mIHRoZSBibG9iIHRvIGZldGNoXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgYmxvYiBmcm9tIHRoZSBBUElcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0QmxvYihzaGEsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vZ2l0L2Jsb2JzLyR7c2hhfWAsIG51bGwsIGNiLCAncmF3Jyk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGEgc2luZ2xlIGJyYW5jaFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2JyYW5jaGVzLyNnZXQtYnJhbmNoXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gYnJhbmNoIC0gdGhlIG5hbWUgb2YgdGhlIGJyYW5jaCB0byBmZXRjaFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGJyYW5jaCBmcm9tIHRoZSBBUElcbiAgICAqIEByZXR1cm5zIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldEJyYW5jaChicmFuY2gsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vYnJhbmNoZXMvJHticmFuY2h9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBhIGNvbW1pdCBmcm9tIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29tbWl0cy8jZ2V0LWEtc2luZ2xlLWNvbW1pdFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHNoYSAtIHRoZSBzaGEgZm9yIHRoZSBjb21taXQgdG8gZmV0Y2hcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBjb21taXQgZGF0YVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRDb21taXQoc2hhLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2NvbW1pdHMvJHtzaGF9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgdGhlIGNvbW1pdHMgb24gYSByZXBvc2l0b3J5LCBvcHRpb25hbGx5IGZpbHRlcmluZyBieSBwYXRoLCBhdXRob3Igb3IgdGltZSByYW5nZVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2NvbW1pdHMvI2xpc3QtY29tbWl0cy1vbi1hLXJlcG9zaXRvcnlcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSB0aGUgZmlsdGVyaW5nIG9wdGlvbnMgZm9yIGNvbW1pdHNcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5zaGFdIC0gdGhlIFNIQSBvciBicmFuY2ggdG8gc3RhcnQgZnJvbVxuICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLnBhdGhdIC0gdGhlIHBhdGggdG8gc2VhcmNoIG9uXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuYXV0aG9yXSAtIHRoZSBjb21taXQgYXV0aG9yXG4gICAgKiBAcGFyYW0geyhEYXRlfHN0cmluZyl9IFtvcHRpb25zLnNpbmNlXSAtIG9ubHkgY29tbWl0cyBhZnRlciB0aGlzIGRhdGUgd2lsbCBiZSByZXR1cm5lZFxuICAgICogQHBhcmFtIHsoRGF0ZXxzdHJpbmcpfSBbb3B0aW9ucy51bnRpbF0gLSBvbmx5IGNvbW1pdHMgYmVmb3JlIHRoaXMgZGF0ZSB3aWxsIGJlIHJldHVybmVkXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBjb21taXRzIGZvdW5kIG1hdGNoaW5nIHRoZSBjcml0ZXJpYVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0Q29tbWl0cyhvcHRpb25zLCBjYikge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgIGNiID0gb3B0aW9ucztcbiAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMuc2luY2UgPSB0aGlzLl9kYXRlVG9JU08ob3B0aW9ucy5zaW5jZSk7XG4gICAgICBvcHRpb25zLnVudGlsID0gdGhpcy5fZGF0ZVRvSVNPKG9wdGlvbnMudW50aWwpO1xuXG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vY29tbWl0c2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IHRoZSBjb21taXRzIG9uIGEgcHVsbCByZXF1ZXN0XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29tbWl0cy8jbGlzdC1jb21taXRzLW9uLWEtcmVwb3NpdG9yeVxuICAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBudW1iZXIgLSB0aGUgbnVtYmVyIG9mIHRoZSBwdWxsIHJlcXVlc3QgdG8gbGlzdCB0aGUgY29tbWl0c1xuICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIHRoZSBmaWx0ZXJpbmcgb3B0aW9ucyBmb3IgY29tbWl0c1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgY29tbWl0cyBpbmZvcm1hdGlvblxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0Q29tbWl0c09uUFIobnVtYmVyLCBvcHRpb25zLCBjYikge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgIGNiID0gb3B0aW9ucztcbiAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wdWxscy8ke251bWJlcn0vY29tbWl0c2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBzaW5nbGUgY29tbWl0IGluZm9ybWF0aW9uIGZvciBhIHJlcG9zaXRvcnlcbiAgICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29tbWl0cy8jZ2V0LWEtc2luZ2xlLWNvbW1pdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWYgLSB0aGUgcmVmZXJlbmNlIGZvciB0aGUgY29tbWl0LWlzaFxuICAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBjb21taXQgaW5mb3JtYXRpb25cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgICovXG4gICBnZXRTaW5nbGVDb21taXQocmVmLCBjYikge1xuICAgICAgcmVmID0gcmVmIHx8ICcnO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2NvbW1pdHMvJHtyZWZ9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCB0aGEgc2hhIGZvciBhIHBhcnRpY3VsYXIgb2JqZWN0IGluIHRoZSByZXBvc2l0b3J5LiBUaGlzIGlzIGEgY29udmVuaWVuY2UgZnVuY3Rpb25cbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9jb250ZW50cy8jZ2V0LWNvbnRlbnRzXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW2JyYW5jaF0gLSB0aGUgYnJhbmNoIHRvIGxvb2sgaW4sIG9yIHRoZSByZXBvc2l0b3J5J3MgZGVmYXVsdCBicmFuY2ggaWYgb21pdHRlZFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcGF0aCBvZiB0aGUgZmlsZSBvciBkaXJlY3RvcnlcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIGEgZGVzY3JpcHRpb24gb2YgdGhlIHJlcXVlc3RlZCBvYmplY3QsIGluY2x1ZGluZyBhIGBTSEFgIHByb3BlcnR5XG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldFNoYShicmFuY2gsIHBhdGgsIGNiKSB7XG4gICAgICBicmFuY2ggPSBicmFuY2ggPyBgP3JlZj0ke2JyYW5jaH1gIDogJyc7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vY29udGVudHMvJHtwYXRofSR7YnJhbmNofWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IHRoZSBjb21taXQgc3RhdHVzZXMgZm9yIGEgcGFydGljdWxhciBzaGEsIGJyYW5jaCwgb3IgdGFnXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3Mvc3RhdHVzZXMvI2xpc3Qtc3RhdHVzZXMtZm9yLWEtc3BlY2lmaWMtcmVmXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gc2hhIC0gdGhlIHNoYSwgYnJhbmNoLCBvciB0YWcgdG8gZ2V0IHN0YXR1c2VzIGZvclxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2Ygc3RhdHVzZXNcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbGlzdFN0YXR1c2VzKHNoYSwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb21taXRzLyR7c2hhfS9zdGF0dXNlc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgdGhlIGNvbWJpbmVkIHZpZXcgb2YgY29tbWl0IHN0YXR1c2VzIGZvciBhIHBhcnRpY3VsYXIgc2hhLCBicmFuY2gsIG9yIHRhZ1xuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3N0YXR1c2VzLyNnZXQtdGhlLWNvbWJpbmVkLXN0YXR1cy1mb3ItYS1zcGVjaWZpYy1yZWZcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBzaGEgLSB0aGUgc2hhLCBicmFuY2gsIG9yIHRhZyB0byBnZXQgdGhlIGNvbWJpbmVkIHN0YXR1cyBmb3JcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBjb21iaW5lZCBzdGF0dXNcbiAgICAqIEByZXR1cm5zIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldENvbWJpbmVkU3RhdHVzKHNoYSwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb21taXRzLyR7c2hhfS9zdGF0dXNgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGEgZGVzY3JpcHRpb24gb2YgYSBnaXQgdHJlZVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpdC90cmVlcy8jZ2V0LWEtdHJlZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHRyZWVTSEEgLSB0aGUgU0hBIG9mIHRoZSB0cmVlIHRvIGZldGNoXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgY2FsbGJhY2sgZGF0YVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRUcmVlKHRyZWVTSEEsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vZ2l0L3RyZWVzLyR7dHJlZVNIQX1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgYmxvYlxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpdC9ibG9icy8jY3JlYXRlLWEtYmxvYlxuICAgICogQHBhcmFtIHsoc3RyaW5nfEJ1ZmZlcnxCbG9iKX0gY29udGVudCAtIHRoZSBjb250ZW50IHRvIGFkZCB0byB0aGUgcmVwb3NpdG9yeVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGRldGFpbHMgb2YgdGhlIGNyZWF0ZWQgYmxvYlxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVCbG9iKGNvbnRlbnQsIGNiKSB7XG4gICAgICBsZXQgcG9zdEJvZHkgPSB0aGlzLl9nZXRDb250ZW50T2JqZWN0KGNvbnRlbnQpO1xuXG4gICAgICBsb2coJ3NlbmRpbmcgY29udGVudCcsIHBvc3RCb2R5KTtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vZ2l0L2Jsb2JzYCwgcG9zdEJvZHksIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgdGhlIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIHByb3ZpZGVkIGNvbnRlbnRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfEJ1ZmZlcnxCbG9ifSBjb250ZW50IC0gdGhlIGNvbnRlbnQgdG8gc2VuZCB0byB0aGUgc2VydmVyXG4gICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoZSByZXByZXNlbnRhdGlvbiBvZiBgY29udGVudGAgZm9yIHRoZSBHaXRIdWIgQVBJXG4gICAgKi9cbiAgIF9nZXRDb250ZW50T2JqZWN0KGNvbnRlbnQpIHtcbiAgICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgIGxvZygnY29udGV0IGlzIGEgc3RyaW5nJyk7XG4gICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29udGVudDogVXRmOC5lbmNvZGUoY29udGVudCksXG4gICAgICAgICAgICBlbmNvZGluZzogJ3V0Zi04JyxcbiAgICAgICAgIH07XG5cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIEJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgY29udGVudCBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgICAgbG9nKCdXZSBhcHBlYXIgdG8gYmUgaW4gTm9kZScpO1xuICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IGNvbnRlbnQudG9TdHJpbmcoJ2Jhc2U2NCcpLFxuICAgICAgICAgICAgZW5jb2Rpbmc6ICdiYXNlNjQnLFxuICAgICAgICAgfTtcblxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcgJiYgY29udGVudCBpbnN0YW5jZW9mIEJsb2IpIHtcbiAgICAgICAgIGxvZygnV2UgYXBwZWFyIHRvIGJlIGluIHRoZSBicm93c2VyJyk7XG4gICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29udGVudDogQmFzZTY0LmVuY29kZShjb250ZW50KSxcbiAgICAgICAgICAgIGVuY29kaW5nOiAnYmFzZTY0JyxcbiAgICAgICAgIH07XG5cbiAgICAgIH0gZWxzZSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgIGxvZyhgTm90IHN1cmUgd2hhdCB0aGlzIGNvbnRlbnQgaXM6ICR7dHlwZW9mIGNvbnRlbnR9LCAke0pTT04uc3RyaW5naWZ5KGNvbnRlbnQpfWApO1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGNvbnRlbnQgcGFzc2VkIHRvIHBvc3RCbG9iLiBNdXN0IGJlIHN0cmluZyBvciBCdWZmZXIgKG5vZGUpIG9yIEJsb2IgKHdlYiknKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLyoqXG4gICAgKiBVcGRhdGUgYSB0cmVlIGluIEdpdFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpdC90cmVlcy8jY3JlYXRlLWEtdHJlZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IGJhc2VUcmVlU0hBIC0gdGhlIFNIQSBvZiB0aGUgdHJlZSB0byB1cGRhdGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gdGhlIHBhdGggZm9yIHRoZSBuZXcgZmlsZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IGJsb2JTSEEgLSB0aGUgU0hBIGZvciB0aGUgYmxvYiB0byBwdXQgYXQgYHBhdGhgXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbmV3IHRyZWUgdGhhdCBpcyBjcmVhdGVkXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKiBAZGVwcmVjYXRlZCB1c2Uge0BsaW5rIFJlcG9zaXRvcnkjY3JlYXRlVHJlZX0gaW5zdGVhZFxuICAgICovXG4gICB1cGRhdGVUcmVlKGJhc2VUcmVlU0hBLCBwYXRoLCBibG9iU0hBLCBjYikge1xuICAgICAgbGV0IG5ld1RyZWUgPSB7XG4gICAgICAgICBiYXNlX3RyZWU6IGJhc2VUcmVlU0hBLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgICB0cmVlOiBbe1xuICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgIHNoYTogYmxvYlNIQSxcbiAgICAgICAgICAgIG1vZGU6ICcxMDA2NDQnLFxuICAgICAgICAgICAgdHlwZTogJ2Jsb2InLFxuICAgICAgICAgfV0sXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2dpdC90cmVlc2AsIG5ld1RyZWUsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBuZXcgdHJlZSBpbiBnaXRcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXQvdHJlZXMvI2NyZWF0ZS1hLXRyZWVcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSB0cmVlIC0gdGhlIHRyZWUgdG8gY3JlYXRlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gYmFzZVNIQSAtIHRoZSByb290IHNoYSBvZiB0aGUgdHJlZVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG5ldyB0cmVlIHRoYXQgaXMgY3JlYXRlZFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVUcmVlKHRyZWUsIGJhc2VTSEEsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2dpdC90cmVlc2AsIHtcbiAgICAgICAgIHRyZWUsXG4gICAgICAgICBiYXNlX3RyZWU6IGJhc2VTSEEsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY2FtZWxjYXNlXG4gICAgICB9LCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQWRkIGEgY29tbWl0IHRvIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2l0L2NvbW1pdHMvI2NyZWF0ZS1hLWNvbW1pdFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmVudCAtIHRoZSBTSEEgb2YgdGhlIHBhcmVudCBjb21taXRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSB0cmVlIC0gdGhlIFNIQSBvZiB0aGUgdHJlZSBmb3IgdGhpcyBjb21taXRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gdGhlIGNvbW1pdCBtZXNzYWdlXG4gICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gY29tbWl0IG9wdGlvbnNcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5hdXRob3JdIC0gdGhlIGF1dGhvciBvZiB0aGUgY29tbWl0XG4gICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuY29tbWl0ZXJdIC0gdGhlIGNvbW1pdHRlclxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGNvbW1pdCB0aGF0IGlzIGNyZWF0ZWRcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgY29tbWl0KHBhcmVudCwgdHJlZSwgbWVzc2FnZSwgb3B0aW9ucywgY2IpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgY2IgPSBvcHRpb25zO1xuICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgfVxuXG4gICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICB0cmVlLFxuICAgICAgICAgcGFyZW50czogW3BhcmVudF0sXG4gICAgICB9O1xuXG4gICAgICBkYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywgZGF0YSk7XG5cbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vZ2l0L2NvbW1pdHNgLCBkYXRhLCBjYilcbiAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fX2N1cnJlbnRUcmVlLnNoYSA9IHJlc3BvbnNlLmRhdGEuc2hhOyAvLyBVcGRhdGUgbGF0ZXN0IGNvbW1pdFxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgfSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogVXBkYXRlIGEgcmVmXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2l0L3JlZnMvI3VwZGF0ZS1hLXJlZmVyZW5jZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHJlZiAtIHRoZSByZWYgdG8gdXBkYXRlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gY29tbWl0U0hBIC0gdGhlIFNIQSB0byBwb2ludCB0aGUgcmVmZXJlbmNlIHRvXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gaW5kaWNhdGVzIHdoZXRoZXIgdG8gZm9yY2Ugb3IgZW5zdXJlIGEgZmFzdC1mb3J3YXJkIHVwZGF0ZVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIHVwZGF0ZWQgcmVmIGJhY2tcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgdXBkYXRlSGVhZChyZWYsIGNvbW1pdFNIQSwgZm9yY2UsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUEFUQ0gnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9naXQvcmVmcy8ke3JlZn1gLCB7XG4gICAgICAgICBzaGE6IGNvbW1pdFNIQSxcbiAgICAgICAgIGZvcmNlOiBmb3JjZSxcbiAgICAgIH0sIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBVcGRhdGUgY29tbWl0IHN0YXR1c1xuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3N0YXR1c2VzL1xuICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1pdFNIQSAtIHRoZSBTSEEgb2YgdGhlIGNvbW1pdCB0aGF0IHNob3VsZCBiZSB1cGRhdGVkXG4gICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIENvbW1pdCBzdGF0dXMgcGFyYW1ldGVyc1xuICAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuc3RhdGUgLSBUaGUgc3RhdGUgb2YgdGhlIHN0YXR1cy4gQ2FuIGJlIG9uZSBvZjogcGVuZGluZywgc3VjY2VzcywgZXJyb3IsIG9yIGZhaWx1cmUuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMudGFyZ2V0X3VybF0gLSBUaGUgdGFyZ2V0IFVSTCB0byBhc3NvY2lhdGUgd2l0aCB0aGlzIHN0YXR1cy5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5kZXNjcmlwdGlvbl0gLSBBIHNob3J0IGRlc2NyaXB0aW9uIG9mIHRoZSBzdGF0dXMuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuY29udGV4dF0gLSBBIHN0cmluZyBsYWJlbCB0byBkaWZmZXJlbnRpYXRlIHRoaXMgc3RhdHVzIGFtb25nIENJIHN5c3RlbXMuXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgdXBkYXRlZCBjb21taXQgYmFja1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICB1cGRhdGVTdGF0dXMoY29tbWl0U0hBLCBvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BPU1QnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9zdGF0dXNlcy8ke2NvbW1pdFNIQX1gLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogVXBkYXRlIHJlcG9zaXRvcnkgaW5mb3JtYXRpb25cbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy8jZWRpdFxuICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBOZXcgcGFyYW1ldGVycyB0aGF0IHdpbGwgYmUgc2V0IHRvIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5uYW1lIC0gTmFtZSBvZiB0aGUgcmVwb3NpdG9yeVxuICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmRlc2NyaXB0aW9uXSAtIEEgc2hvcnQgZGVzY3JpcHRpb24gb2YgdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5ob21lcGFnZV0gLSBBIFVSTCB3aXRoIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMucHJpdmF0ZV0gLSBFaXRoZXIgdHJ1ZSB0byBtYWtlIHRoZSByZXBvc2l0b3J5IHByaXZhdGUsIG9yIGZhbHNlIHRvIG1ha2UgaXQgcHVibGljLlxuICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5oYXNfaXNzdWVzXSAtIEVpdGhlciB0cnVlIHRvIGVuYWJsZSBpc3N1ZXMgZm9yIHRoaXMgcmVwb3NpdG9yeSwgZmFsc2UgdG8gZGlzYWJsZSB0aGVtLlxuICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5oYXNfd2lraV0gLSBFaXRoZXIgdHJ1ZSB0byBlbmFibGUgdGhlIHdpa2kgZm9yIHRoaXMgcmVwb3NpdG9yeSwgZmFsc2UgdG8gZGlzYWJsZSBpdC5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuaGFzX2Rvd25sb2Fkc10gLSBFaXRoZXIgdHJ1ZSB0byBlbmFibGUgZG93bmxvYWRzLCBmYWxzZSB0byBkaXNhYmxlIHRoZW0uXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZGVmYXVsdF9icmFuY2hdIC0gVXBkYXRlcyB0aGUgZGVmYXVsdCBicmFuY2ggZm9yIHRoaXMgcmVwb3NpdG9yeS5cbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSB1cGRhdGVkIHJlcG9zaXRvcnkgYmFja1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICB1cGRhdGVSZXBvc2l0b3J5KG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUEFUQ0gnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfWAsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAvKipcbiAgICAqIEdldCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zLyNnZXRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgcmVwb3NpdG9yeVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXREZXRhaWxzKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTGlzdCB0aGUgY29udHJpYnV0b3JzIHRvIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvI2xpc3QtY29udHJpYnV0b3JzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBjb250cmlidXRvcnNcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0Q29udHJpYnV0b3JzKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vY29udHJpYnV0b3JzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgdGhlIGNvbnRyaWJ1dG9yIHN0YXRzIHRvIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvI2xpc3QtY29udHJpYnV0b3JzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBjb250cmlidXRvcnNcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0Q29udHJpYnV0b3JTdGF0cyhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3N0YXRzL2NvbnRyaWJ1dG9yc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IHRoZSB1c2VycyB3aG8gYXJlIGNvbGxhYm9yYXRvcnMgb24gdGhlIHJlcG9zaXRvcnkuIFRoZSBjdXJyZW50bHkgYXV0aGVudGljYXRlZCB1c2VyIG11c3QgaGF2ZVxuICAgICogcHVzaCBhY2Nlc3MgdG8gdXNlIHRoaXMgbWV0aG9kXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29sbGFib3JhdG9ycy8jbGlzdC1jb2xsYWJvcmF0b3JzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBjb2xsYWJvcmF0b3JzXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldENvbGxhYm9yYXRvcnMoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb2xsYWJvcmF0b3JzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENoZWNrIGlmIGEgdXNlciBpcyBhIGNvbGxhYm9yYXRvciBvbiB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2NvbGxhYm9yYXRvcnMvI2NoZWNrLWlmLWEtdXNlci1pcy1hLWNvbGxhYm9yYXRvclxuICAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gdGhlIHVzZXIgdG8gY2hlY2tcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIHVzZXIgaXMgYSBjb2xsYWJvcmF0b3IgYW5kIGZhbHNlIGlmIHRoZXkgYXJlIG5vdFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdCB7Qm9vbGVhbn0gW2Rlc2NyaXB0aW9uXVxuICAgICovXG4gICBpc0NvbGxhYm9yYXRvcih1c2VybmFtZSwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb2xsYWJvcmF0b3JzLyR7dXNlcm5hbWV9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCB0aGUgY29udGVudHMgb2YgYSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29udGVudHMvI2dldC1jb250ZW50c1xuICAgICogQHBhcmFtIHtzdHJpbmd9IHJlZiAtIHRoZSByZWYgdG8gY2hlY2tcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gdGhlIHBhdGggY29udGFpbmluZyB0aGUgY29udGVudCB0byBmZXRjaFxuICAgICogQHBhcmFtIHtib29sZWFufSByYXcgLSBgdHJ1ZWAgaWYgdGhlIHJlc3VsdHMgc2hvdWxkIGJlIHJldHVybmVkIHJhdyBpbnN0ZWFkIG9mIEdpdEh1YidzIG5vcm1hbGl6ZWQgZm9ybWF0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgZmV0Y2hlZCBkYXRhXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldENvbnRlbnRzKHJlZiwgcGF0aCwgcmF3LCBjYikge1xuICAgICAgcGF0aCA9IHBhdGggPyBgJHtlbmNvZGVVUkkocGF0aCl9YCA6ICcnO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2NvbnRlbnRzLyR7cGF0aH1gLCB7XG4gICAgICAgICByZWYsXG4gICAgICB9LCBjYiwgcmF3KTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgdGhlIFJFQURNRSBvZiBhIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9jb250ZW50cy8jZ2V0LXRoZS1yZWFkbWVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWYgLSB0aGUgcmVmIHRvIGNoZWNrXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhdyAtIGB0cnVlYCBpZiB0aGUgcmVzdWx0cyBzaG91bGQgYmUgcmV0dXJuZWQgcmF3IGluc3RlYWQgb2YgR2l0SHViJ3Mgbm9ybWFsaXplZCBmb3JtYXRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBmZXRjaGVkIGRhdGFcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0UmVhZG1lKHJlZiwgcmF3LCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3JlYWRtZWAsIHtcbiAgICAgICAgIHJlZixcbiAgICAgIH0sIGNiLCByYXcpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEZvcmsgYSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvZm9ya3MvI2NyZWF0ZS1hLWZvcmtcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbmV3bHkgY3JlYXRlZCBmb3JrXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGZvcmsoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vZm9ya3NgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRm9yayBhIHJlcG9zaXRvcnkgdG8gYW4gb3JnYW5pemF0aW9uXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvZm9ya3MvI2NyZWF0ZS1hLWZvcmtcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcmcgLSBvcmdhbml6YXRpb24gd2hlcmUgeW91J2QgbGlrZSB0byBjcmVhdGUgdGhlIGZvcmsuXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG5ld2x5IGNyZWF0ZWQgZm9ya1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICpcbiAgICAqL1xuICAgZm9ya1RvT3JnKG9yZywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vZm9ya3M/b3JnYW5pemF0aW9uPSR7b3JnfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IGEgcmVwb3NpdG9yeSdzIGZvcmtzXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvZm9ya3MvI2xpc3QtZm9ya3NcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBsaXN0IG9mIHJlcG9zaXRvcmllcyBmb3JrZWQgZnJvbSB0aGlzIG9uZVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0Rm9ya3MoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9mb3Jrc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBuZXcgYnJhbmNoIGZyb20gYW4gZXhpc3RpbmcgYnJhbmNoLlxuICAgICogQHBhcmFtIHtzdHJpbmd9IFtvbGRCcmFuY2g9bWFzdGVyXSAtIHRoZSBuYW1lIG9mIHRoZSBleGlzdGluZyBicmFuY2hcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBuZXdCcmFuY2ggLSB0aGUgbmFtZSBvZiB0aGUgbmV3IGJyYW5jaFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGNvbW1pdCBkYXRhIGZvciB0aGUgaGVhZCBvZiB0aGUgbmV3IGJyYW5jaFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVCcmFuY2gob2xkQnJhbmNoLCBuZXdCcmFuY2gsIGNiKSB7XG4gICAgICBpZiAodHlwZW9mIG5ld0JyYW5jaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgY2IgPSBuZXdCcmFuY2g7XG4gICAgICAgICBuZXdCcmFuY2ggPSBvbGRCcmFuY2g7XG4gICAgICAgICBvbGRCcmFuY2ggPSAnbWFzdGVyJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVmKGBoZWFkcy8ke29sZEJyYW5jaH1gKVxuICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgc2hhID0gcmVzcG9uc2UuZGF0YS5vYmplY3Quc2hhO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUmVmKHtcbiAgICAgICAgICAgICAgIHNoYSxcbiAgICAgICAgICAgICAgIHJlZjogYHJlZnMvaGVhZHMvJHtuZXdCcmFuY2h9YCxcbiAgICAgICAgICAgIH0sIGNiKTtcbiAgICAgICAgIH0pO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZSBhIG5ldyBwdWxsIHJlcXVlc3RcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9wdWxscy8jY3JlYXRlLWEtcHVsbC1yZXF1ZXN0XG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBwdWxsIHJlcXVlc3QgZGVzY3JpcHRpb25cbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBuZXcgcHVsbCByZXF1ZXN0XG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGNyZWF0ZVB1bGxSZXF1ZXN0KG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3B1bGxzYCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFVwZGF0ZSBhIHB1bGwgcmVxdWVzdFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3B1bGxzLyN1cGRhdGUtYS1wdWxsLXJlcXVlc3RcbiAgICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ30gbnVtYmVyIC0gdGhlIG51bWJlciBvZiB0aGUgcHVsbCByZXF1ZXN0IHRvIHVwZGF0ZVxuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgcHVsbCByZXF1ZXN0IGRlc2NyaXB0aW9uXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBwdWxsIHJlcXVlc3QgaW5mb3JtYXRpb25cbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgdXBkYXRlUHVsbFJlcXVlc3QobnVtYmVyLCBvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BBVENIJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHVsbHMvJHtudW1iZXJ9YCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgdGhlIGhvb2tzIGZvciB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2hvb2tzLyNsaXN0LWhvb2tzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBob29rc1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0SG9va3MoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9ob29rc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgYSBob29rIGZvciB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2hvb2tzLyNnZXQtc2luZ2xlLWhvb2tcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIHRoZSBpZCBvZiB0aGUgd2Vib29rXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgZGV0YWlscyBvZiB0aGUgd2Vib29rXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldEhvb2soaWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vaG9va3MvJHtpZH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQWRkIGEgbmV3IGhvb2sgdG8gdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9ob29rcy8jY3JlYXRlLWEtaG9va1xuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgY29uZmlndXJhdGlvbiBkZXNjcmliaW5nIHRoZSBuZXcgaG9va1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG5ldyB3ZWJob29rXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGNyZWF0ZUhvb2sob3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vaG9va3NgLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRWRpdCBhbiBleGlzdGluZyB3ZWJob29rXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvaG9va3MvI2VkaXQtYS1ob29rXG4gICAgKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgaWQgb2YgdGhlIHdlYmhvb2tcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIG5ldyBkZXNjcmlwdGlvbiBvZiB0aGUgd2ViaG9va1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIHVwZGF0ZWQgd2ViaG9va1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICB1cGRhdGVIb29rKGlkLCBvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BBVENIJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vaG9va3MvJHtpZH1gLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVsZXRlIGEgd2ViaG9va1xuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2hvb2tzLyNkZWxldGUtYS1ob29rXG4gICAgKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgaWQgb2YgdGhlIHdlYmhvb2sgdG8gYmUgZGVsZXRlZFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdHJ1ZSBpZiB0aGUgY2FsbCBpcyBzdWNjZXNzZnVsXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGRlbGV0ZUhvb2soaWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vaG9va3MvJHtpZH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTGlzdCB0aGUgZGVwbG95IGtleXMgZm9yIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3Mva2V5cy8jbGlzdC1kZXBsb3kta2V5c1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2YgZGVwbG95IGtleXNcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbGlzdEtleXMoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9rZXlzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBhIGRlcGxveSBrZXkgZm9yIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3Mva2V5cy8jZ2V0LWEtZGVwbG95LWtleVxuICAgICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIGlkIG9mIHRoZSBkZXBsb3kga2V5XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgZGV0YWlscyBvZiB0aGUgZGVwbG95IGtleVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRLZXkoaWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0va2V5cy8ke2lkfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBBZGQgYSBuZXcgZGVwbG95IGtleSB0byB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2tleXMvI2FkZC1hLW5ldy1kZXBsb3kta2V5XG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBjb25maWd1cmF0aW9uIGRlc2NyaWJpbmcgdGhlIG5ldyBkZXBsb3kga2V5XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbmV3IGRlcGxveSBrZXlcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgY3JlYXRlS2V5KG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2tleXNgLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVsZXRlIGEgZGVwbG95IGtleVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2tleXMvI3JlbW92ZS1hLWRlcGxveS1rZXlcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIHRoZSBpZCBvZiB0aGUgZGVwbG95IGtleSB0byBiZSBkZWxldGVkXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSBjYWxsIGlzIHN1Y2Nlc3NmdWxcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZGVsZXRlS2V5KGlkLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0RFTEVURScsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2tleXMvJHtpZH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVsZXRlIGEgZmlsZSBmcm9tIGEgYnJhbmNoXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29udGVudHMvI2RlbGV0ZS1hLWZpbGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBicmFuY2ggLSB0aGUgYnJhbmNoIHRvIGRlbGV0ZSBmcm9tLCBvciB0aGUgZGVmYXVsdCBicmFuY2ggaWYgbm90IHNwZWNpZmllZFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcGF0aCBvZiB0aGUgZmlsZSB0byByZW1vdmVcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBjb21taXQgaW4gd2hpY2ggdGhlIGRlbGV0ZSBvY2N1cnJlZFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBkZWxldGVGaWxlKGJyYW5jaCwgcGF0aCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFNoYShicmFuY2gsIHBhdGgpXG4gICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRlbGV0ZUNvbW1pdCA9IHtcbiAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBEZWxldGUgdGhlIGZpbGUgYXQgJyR7cGF0aH0nYCxcbiAgICAgICAgICAgICAgIHNoYTogcmVzcG9uc2UuZGF0YS5zaGEsXG4gICAgICAgICAgICAgICBicmFuY2gsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0RFTEVURScsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2NvbnRlbnRzLyR7cGF0aH1gLCBkZWxldGVDb21taXQsIGNiKTtcbiAgICAgICAgIH0pO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENoYW5nZSBhbGwgcmVmZXJlbmNlcyBpbiBhIHJlcG8gZnJvbSBvbGRQYXRoIHRvIG5ld19wYXRoXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gYnJhbmNoIC0gdGhlIGJyYW5jaCB0byBjYXJyeSBvdXQgdGhlIHJlZmVyZW5jZSBjaGFuZ2UsIG9yIHRoZSBkZWZhdWx0IGJyYW5jaCBpZiBub3Qgc3BlY2lmaWVkXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gb2xkUGF0aCAtIG9yaWdpbmFsIHBhdGhcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBuZXdQYXRoIC0gbmV3IHJlZmVyZW5jZSBwYXRoXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgY29tbWl0IGluIHdoaWNoIHRoZSBtb3ZlIG9jY3VycmVkXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIG1vdmUoYnJhbmNoLCBvbGRQYXRoLCBuZXdQYXRoLCBjYikge1xuICAgICAgbGV0IG9sZFNoYTtcbiAgICAgIHJldHVybiB0aGlzLmdldFJlZihgaGVhZHMvJHticmFuY2h9YClcbiAgICAgICAgIC50aGVuKCh7ZGF0YToge29iamVjdH19KSA9PiB0aGlzLmdldFRyZWUoYCR7b2JqZWN0LnNoYX0/cmVjdXJzaXZlPXRydWVgKSlcbiAgICAgICAgIC50aGVuKCh7ZGF0YToge3RyZWUsIHNoYX19KSA9PiB7XG4gICAgICAgICAgICBvbGRTaGEgPSBzaGE7XG4gICAgICAgICAgICBsZXQgbmV3VHJlZSA9IHRyZWUubWFwKChyZWYpID0+IHtcbiAgICAgICAgICAgICAgIGlmIChyZWYucGF0aCA9PT0gb2xkUGF0aCkge1xuICAgICAgICAgICAgICAgICAgcmVmLnBhdGggPSBuZXdQYXRoO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgaWYgKHJlZi50eXBlID09PSAndHJlZScpIHtcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZWYuc2hhO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgcmV0dXJuIHJlZjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlVHJlZShuZXdUcmVlKTtcbiAgICAgICAgIH0pXG4gICAgICAgICAudGhlbigoe2RhdGE6IHRyZWV9KSA9PiB0aGlzLmNvbW1pdChvbGRTaGEsIHRyZWUuc2hhLCBgUmVuYW1lZCAnJHtvbGRQYXRofScgdG8gJyR7bmV3UGF0aH0nYCkpXG4gICAgICAgICAudGhlbigoe2RhdGE6IGNvbW1pdH0pID0+IHRoaXMudXBkYXRlSGVhZChgaGVhZHMvJHticmFuY2h9YCwgY29tbWl0LnNoYSwgdHJ1ZSwgY2IpKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBXcml0ZSBhIGZpbGUgdG8gdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9jb250ZW50cy8jdXBkYXRlLWEtZmlsZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IGJyYW5jaCAtIHRoZSBuYW1lIG9mIHRoZSBicmFuY2hcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gdGhlIHBhdGggZm9yIHRoZSBmaWxlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCAtIHRoZSBjb250ZW50cyBvZiB0aGUgZmlsZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSB0aGUgY29tbWl0IG1lc3NhZ2VcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBjb21taXQgb3B0aW9uc1xuICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmF1dGhvcl0gLSB0aGUgYXV0aG9yIG9mIHRoZSBjb21taXRcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5jb21taXRlcl0gLSB0aGUgY29tbWl0dGVyXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmVuY29kZV0gLSB0cnVlIGlmIHRoZSBjb250ZW50IHNob3VsZCBiZSBiYXNlNjQgZW5jb2RlZFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG5ldyBjb21taXRcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgd3JpdGVGaWxlKGJyYW5jaCwgcGF0aCwgY29udGVudCwgbWVzc2FnZSwgb3B0aW9ucywgY2IpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICBjYiA9IG9wdGlvbnM7XG4gICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG4gICAgICBsZXQgZmlsZVBhdGggPSBwYXRoID8gZW5jb2RlVVJJKHBhdGgpIDogJyc7XG4gICAgICBsZXQgc2hvdWxkRW5jb2RlID0gb3B0aW9ucy5lbmNvZGUgIT09IGZhbHNlO1xuICAgICAgbGV0IGNvbW1pdCA9IHtcbiAgICAgICAgIGJyYW5jaCxcbiAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICBhdXRob3I6IG9wdGlvbnMuYXV0aG9yLFxuICAgICAgICAgY29tbWl0dGVyOiBvcHRpb25zLmNvbW1pdHRlcixcbiAgICAgICAgIGNvbnRlbnQ6IHNob3VsZEVuY29kZSA/IEJhc2U2NC5lbmNvZGUoY29udGVudCkgOiBjb250ZW50LFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0U2hhKGJyYW5jaCwgZmlsZVBhdGgpXG4gICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGNvbW1pdC5zaGEgPSByZXNwb25zZS5kYXRhLnNoYTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQVVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb250ZW50cy8ke2ZpbGVQYXRofWAsIGNvbW1pdCwgY2IpO1xuICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BVVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2NvbnRlbnRzLyR7ZmlsZVBhdGh9YCwgY29tbWl0LCBjYik7XG4gICAgICAgICB9KTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDaGVjayBpZiBhIHJlcG9zaXRvcnkgaXMgc3RhcnJlZCBieSB5b3VcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9hY3Rpdml0eS9zdGFycmluZy8jY2hlY2staWYteW91LWFyZS1zdGFycmluZy1hLXJlcG9zaXRvcnlcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIHJlcG9zaXRvcnkgaXMgc3RhcnJlZCBhbmQgZmFsc2UgaWYgdGhlIHJlcG9zaXRvcnlcbiAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzIG5vdCBzdGFycmVkXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0IHtCb29sZWFufSBbZGVzY3JpcHRpb25dXG4gICAgKi9cbiAgIGlzU3RhcnJlZChjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QyMDRvcjQwNChgL3VzZXIvc3RhcnJlZC8ke3RoaXMuX19mdWxsbmFtZX1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogU3RhciBhIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9hY3Rpdml0eS9zdGFycmluZy8jc3Rhci1hLXJlcG9zaXRvcnlcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIHJlcG9zaXRvcnkgaXMgc3RhcnJlZFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBzdGFyKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUFVUJywgYC91c2VyL3N0YXJyZWQvJHt0aGlzLl9fZnVsbG5hbWV9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFVuc3RhciBhIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9hY3Rpdml0eS9zdGFycmluZy8jdW5zdGFyLWEtcmVwb3NpdG9yeVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdHJ1ZSBpZiB0aGUgcmVwb3NpdG9yeSBpcyB1bnN0YXJyZWRcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgdW5zdGFyKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYC91c2VyL3N0YXJyZWQvJHt0aGlzLl9fZnVsbG5hbWV9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZSBhIG5ldyByZWxlYXNlXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcmVsZWFzZXMvI2NyZWF0ZS1hLXJlbGVhc2VcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSByZWxlYXNlXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbmV3bHkgY3JlYXRlZCByZWxlYXNlXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGNyZWF0ZVJlbGVhc2Uob3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcmVsZWFzZXNgLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRWRpdCBhIHJlbGVhc2VcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9yZWxlYXNlcy8jZWRpdC1hLXJlbGVhc2VcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIHRoZSBpZCBvZiB0aGUgcmVsZWFzZVxuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIHJlbGVhc2VcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBtb2RpZmllZCByZWxlYXNlXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIHVwZGF0ZVJlbGVhc2UoaWQsIG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUEFUQ0gnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9yZWxlYXNlcy8ke2lkfWAsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgaW5mb3JtYXRpb24gYWJvdXQgYWxsIHJlbGVhc2VzXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcmVsZWFzZXMvI2xpc3QtcmVsZWFzZXMtZm9yLWEtcmVwb3NpdG9yeVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIHJlbGVhc2UgaW5mb3JtYXRpb25cbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbGlzdFJlbGVhc2VzKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcmVsZWFzZXNgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IGEgcmVsZWFzZVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3JlbGVhc2VzLyNnZXQtYS1zaW5nbGUtcmVsZWFzZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gdGhlIGlkIG9mIHRoZSByZWxlYXNlXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgcmVsZWFzZSBpbmZvcm1hdGlvblxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRSZWxlYXNlKGlkLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3JlbGVhc2VzLyR7aWR9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIERlbGV0ZSBhIHJlbGVhc2VcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9yZWxlYXNlcy8jZGVsZXRlLWEtcmVsZWFzZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gdGhlIHJlbGVhc2UgdG8gYmUgZGVsZXRlZFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdHJ1ZSBpZiB0aGUgb3BlcmF0aW9uIGlzIHN1Y2Nlc3NmdWxcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZGVsZXRlUmVsZWFzZShpZCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdERUxFVEUnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9yZWxlYXNlcy8ke2lkfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBNZXJnZSBhIHB1bGwgcmVxdWVzdFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3B1bGxzLyNtZXJnZS1hLXB1bGwtcmVxdWVzdC1tZXJnZS1idXR0b25cbiAgICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ30gbnVtYmVyIC0gdGhlIG51bWJlciBvZiB0aGUgcHVsbCByZXF1ZXN0IHRvIG1lcmdlXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBtZXJnZSBvcHRpb25zIGZvciB0aGUgcHVsbCByZXF1ZXN0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBtZXJnZSBpbmZvcm1hdGlvbiBpZiB0aGUgb3BlcmF0aW9uIGlzIHN1Y2Nlc3NmdWxcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbWVyZ2VQdWxsUmVxdWVzdChudW1iZXIsIG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUFVUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHVsbHMvJHtudW1iZXJ9L21lcmdlYCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBpbmZvcm1hdGlvbiBhYm91dCBhbGwgcHJvamVjdHNcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9wcm9qZWN0cy8jbGlzdC1yZXBvc2l0b3J5LXByb2plY3RzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBsaXN0IG9mIHByb2plY3RzXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGxpc3RQcm9qZWN0cyhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RBbGxQYWdlcyhgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wcm9qZWN0c2AsIHtBY2NlcHRIZWFkZXI6ICdpbmVydGlhLXByZXZpZXcnfSwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZSBhIG5ldyBwcm9qZWN0XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcHJvamVjdHMvI2NyZWF0ZS1hLXJlcG9zaXRvcnktcHJvamVjdFxuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIHByb2plY3RcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBuZXdseSBjcmVhdGVkIHByb2plY3RcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgY3JlYXRlUHJvamVjdChvcHRpb25zLCBjYikge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICBvcHRpb25zLkFjY2VwdEhlYWRlciA9ICdpbmVydGlhLXByZXZpZXcnO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BPU1QnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wcm9qZWN0c2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcG9zaXRvcnk7XG4iXX0=
//# sourceMappingURL=Repository.js.map
