	  var fileLister = __webpack_require__(3).FileListPrinter;
	  var htmlPrinter = __webpack_require__(6).HtmlPrinter;
	   * Generates json object from string diff input
	  Diff2Html.prototype.getJsonFromDiff = function(diffInput) {
	    return diffParser.generateDiffJson(diffInput);
	  };

	  /*
	   * Generates the html diff. The config parameter configures the output/input formats and other options
	   */
	  Diff2Html.prototype.getPrettyHtml = function(diffInput, config) {

	    var diffJson = diffInput;
	    if(!configOrEmpty.inputFormat || configOrEmpty.inputFormat === 'diff') {
	      diffJson = diffParser.generateDiffJson(diffInput);
	    }

	    var fileList = "";
	    if(configOrEmpty.showFiles === true) {
	      fileList = fileLister.generateFileList(diffJson, configOrEmpty);
	    }

	    var diffOutput = "";
	    if(configOrEmpty.outputFormat === 'side-by-side') {
	      diffOutput = htmlPrinter.generateSideBySideJsonHtml(diffJson, configOrEmpty);
	    } else {
	      diffOutput = htmlPrinter.generateLineByLineJsonHtml(diffJson, configOrEmpty);
	    }

	    return fileList + diffOutput

	   * Deprecated methods - The following methods exist only to maintain compatibility with previous versions

	  /*
	   * Generates pretty html from string diff input
	   */
	  Diff2Html.prototype.getPrettyHtmlFromDiff = function(diffInput, config) {
	    var configOrEmpty = config || {};
	    configOrEmpty['inputFormat'] = 'diff';
	    configOrEmpty['outputFormat'] = 'line-by-line';
	    return this.getPrettyHtml(diffInput, configOrEmpty)
	    configOrEmpty['inputFormat'] = 'json';
	    configOrEmpty['outputFormat'] = 'line-by-line';
	    return this.getPrettyHtml(diffJson, configOrEmpty)
	    configOrEmpty['inputFormat'] = 'diff';
	    configOrEmpty['outputFormat'] = 'side-by-side';
	    return this.getPrettyHtml(diffInput, configOrEmpty)
	    configOrEmpty['inputFormat'] = 'json';
	    configOrEmpty['outputFormat'] = 'side-by-side';
	    return this.getPrettyHtml(diffJson, configOrEmpty)
	      } else if (currentFile && !currentFile.oldName && (values = /^--- [aiwco]\/(.+)$/.exec(line))) {
	      } else if (currentFile && !currentFile.newName && (values = /^\+\+\+ [biwco]?\/(.+)$/.exec(line))) {
	  Utils.prototype.getRandomId = function(prefix) {
	      return prefix + "-" + Math.random().toString(36).slice(-3);
	  };

	 * FileListPrinter (file-list-printer.js)
	 * Author: nmatpt
	(function (ctx, undefined) {
	    var printerUtils = __webpack_require__(4).PrinterUtils;
	    var utils = __webpack_require__(2).Utils;
	    function FileListPrinter() {
	    }
	    FileListPrinter.prototype.generateFileList = function (diffFiles) {
	        var hideId = utils.getRandomId("d2h-hide"); //necessary if there are 2 elements like this in the same page
	        var showId = utils.getRandomId("d2h-show");
	        return '<div class="d2h-file-list-wrapper">\n' +
	            '     <div class="d2h-file-list-header">Files changed (' + diffFiles.length + ')&nbsp&nbsp</div>\n' +
	            '     <a id="' + hideId + '" class="d2h-hide" href="#' + hideId + '">+</a>\n' +
	            '     <a id="' + showId + 'd2h-show" class="d2h-show" href="#' + showId + '">-</a>\n' +
	            '     <div class="d2h-clear"></div>\n' +
	            '     <div class="d2h-file-list">\n' +


	            diffFiles.map(function (file) {
	                return '     <div class="d2h-file-list-line">\n' +
	                    '       <div class="d2h-file-stats">\n' +
	                    '         <span class="d2h-lines-added">+' + file.addedLines + '</span>\n' +
	                    '         <span class="d2h-lines-deleted">-' + file.deletedLines + '</span>\n' +
	                    '       </div>\n' +
	                    '       <div class="d2h-file-name"><a href="#' + printerUtils.getHtmlId(file) + '">&nbsp;' + printerUtils.getDiffName(file) + '</a></div>\n' +
	                    '     </div>\n'
	            }).join('\n') +
	            '</div></div>\n';
	    };
	    module.exports['FileListPrinter'] = new FileListPrinter();
	 * PrinterUtils (printer-utils.js)
	  var jsDiff = __webpack_require__(5);
	  function PrinterUtils() {
	  PrinterUtils.prototype.getHtmlId = function(file) {
	    var hashCode =  function(text) {
	      var hash = 0, i, chr, len;
	      if (text.length == 0) return hash;
	      for (i = 0, len = text.length; i < len; i++) {
	        chr   = text.charCodeAt(i);
	        hash  = ((hash << 5) - hash) + chr;
	        hash |= 0; // Convert to 32bit integer
	      return hash;
	    };
	    return "d2h-" + hashCode(this.getDiffName(file)).toString().slice(-6);
	  };
/* 5 */
/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *
	 * HtmlPrinter (html-printer.js)
	 * Author: rtfpessoa
	 *
	 */

	(function(ctx, undefined) {

	  var lineByLinePrinter = __webpack_require__(7).LineByLinePrinter;
	  var sideBySidePrinter = __webpack_require__(8).SideBySidePrinter;

	  function HtmlPrinter() {
	  }

	  HtmlPrinter.prototype.generateLineByLineJsonHtml = lineByLinePrinter.generateLineByLineJsonHtml;

	  HtmlPrinter.prototype.generateSideBySideJsonHtml = sideBySidePrinter.generateSideBySideJsonHtml;

	  module.exports['HtmlPrinter'] = new HtmlPrinter();

	})(this);


/***/ function(module, exports, __webpack_require__) {

	/*
	 *
	 * LineByLinePrinter (line-by-line-printer.js)
	 * Author: rtfpessoa
	 *
	 */

	(function(ctx, undefined) {

	  var diffParser = __webpack_require__(1).DiffParser;
	  var printerUtils = __webpack_require__(4).PrinterUtils;
	  var utils = __webpack_require__(2).Utils;

	  function LineByLinePrinter() {
	  }

	  LineByLinePrinter.prototype.generateLineByLineJsonHtml = function(diffFiles, config) {
	    return '<div class="d2h-wrapper">\n' +
	      diffFiles.map(function(file) {

	        var diffs;
	        if (file.blocks.length) {
	          diffs = generateFileHtml(file, config);
	        } else {
	          diffs = generateEmptyDiff();
	        }

	        return '<div id="' + printerUtils.getHtmlId(file) + '" class="d2h-file-wrapper" data-lang="' + file.language + '">\n' +
	          '     <div class="d2h-file-header">\n' +
	          '       <div class="d2h-file-stats">\n' +
	          '         <span class="d2h-lines-added">+' + file.addedLines + '</span>\n' +
	          '         <span class="d2h-lines-deleted">-' + file.deletedLines + '</span>\n' +
	          '       </div>\n' +
	          '       <div class="d2h-file-name">' + printerUtils.getDiffName(file) + '</div>\n' +
	          '     </div>\n' +
	          '     <div class="d2h-file-diff">\n' +
	          '       <div class="d2h-code-wrapper">\n' +
	          '         <table class="d2h-diff-table">\n' +
	          '           <tbody class="d2h-diff-tbody">\n' +
	          '         ' + diffs +
	          '           </tbody>\n' +
	          '         </table>\n' +
	          '       </div>\n' +
	          '     </div>\n' +
	          '   </div>\n';
	      }).join('\n') +
	      '</div>\n';
	  };

	  function generateFileHtml(file, config) {
	    return file.blocks.map(function(block) {

	      var lines = '<tr>\n' +
	        '  <td class="d2h-code-linenumber ' + diffParser.LINE_TYPE.INFO + '"></td>\n' +
	        '  <td class="' + diffParser.LINE_TYPE.INFO + '">' +
	        '    <div class="d2h-code-line ' + diffParser.LINE_TYPE.INFO + '">' + utils.escape(block.header) + '</div>' +
	        '  </td>\n' +
	        '</tr>\n';

	      var oldLines = [];
	      var newLines = [];
	      var processedOldLines = [];
	      var processedNewLines = [];

	      for (var i = 0; i < block.lines.length; i++) {
	        var line = block.lines[i];
	        var escapedLine = utils.escape(line.content);

	        if (line.type == diffParser.LINE_TYPE.CONTEXT && !oldLines.length && !newLines.length) {
	          lines += generateLineHtml(line.type, line.oldNumber, line.newNumber, escapedLine);
	        } else if (line.type == diffParser.LINE_TYPE.INSERTS && !oldLines.length && !newLines.length) {
	          lines += generateLineHtml(line.type, line.oldNumber, line.newNumber, escapedLine);
	        } else if (line.type == diffParser.LINE_TYPE.DELETES && !newLines.length) {
	          oldLines.push(line);
	        } else if (line.type == diffParser.LINE_TYPE.INSERTS && oldLines.length > newLines.length) {
	          newLines.push(line);
	        } else {
	          var j = 0;
	          var oldLine, newLine;

	          if (oldLines.length === newLines.length) {
	            for (j = 0; j < oldLines.length; j++) {
	              oldLine = oldLines[j];
	              newLine = newLines[j];

	              config.isCombined = file.isCombined;
	              var diff = printerUtils.diffHighlight(oldLine.content, newLine.content, config);

	              processedOldLines +=
	                generateLineHtml(oldLine.type, oldLine.oldNumber, oldLine.newNumber,
	                  diff.first.line, diff.first.prefix);
	              processedNewLines +=
	                generateLineHtml(newLine.type, newLine.oldNumber, newLine.newNumber,
	                  diff.second.line, diff.second.prefix);
	            }

	            lines += processedOldLines + processedNewLines;
	          } else {
	            lines += processLines(oldLines, newLines);
	          }

	          oldLines = [];
	          newLines = [];
	          processedOldLines = [];
	          processedNewLines = [];
	          i--;
	        }
	      }

	      lines += processLines(oldLines, newLines);

	      return lines;
	    }).join('\n');
	  }

	  function processLines(oldLines, newLines) {
	    var lines = '';

	    for (j = 0; j < oldLines.length; j++) {
	      var oldLine = oldLines[j];
	      var oldEscapedLine = utils.escape(oldLine.content);
	      lines += generateLineHtml(oldLine.type, oldLine.oldNumber, oldLine.newNumber, oldEscapedLine);
	    }

	    for (j = 0; j < newLines.length; j++) {
	      var newLine = newLines[j];
	      var newEscapedLine = utils.escape(newLine.content);
	      lines += generateLineHtml(newLine.type, newLine.oldNumber, newLine.newNumber, newEscapedLine);
	    }

	    return lines;
	  }

	  function generateLineHtml(type, oldNumber, newNumber, content, prefix) {
	    var htmlPrefix = '';
	    if (prefix) {
	      htmlPrefix = '<span class="d2h-code-line-prefix">' + prefix + '</span>';
	    }

	    var htmlContent = '';
	    if (content) {
	      htmlContent = '<span class="d2h-code-line-ctn">' + content + '</span>';
	    }

	    return '<tr>\n' +
	      '  <td class="d2h-code-linenumber ' + type + '">' +
	      '    <div class="line-num1">' + utils.valueOrEmpty(oldNumber) + '</div>' +
	      '    <div class="line-num2">' + utils.valueOrEmpty(newNumber) + '</div>' +
	      '  </td>\n' +
	      '  <td class="' + type + '">' +
	      '    <div class="d2h-code-line ' + type + '">' + htmlPrefix + htmlContent + '</div>' +
	      '  </td>\n' +
	      '</tr>\n';
	  }

	  function generateEmptyDiff() {
	    return '<tr>\n' +
	      '  <td class="' + diffParser.LINE_TYPE.INFO + '">' +
	      '    <div class="d2h-code-line ' + diffParser.LINE_TYPE.INFO + '">' +
	      'File without changes' +
	      '    </div>' +
	      '  </td>\n' +
	      '</tr>\n';
	  }

	  module.exports['LineByLinePrinter'] = new LineByLinePrinter();

	})(this);


/***/ },
/* 8 */
	  var printerUtils = __webpack_require__(4).PrinterUtils;
	        return '<div id="' + printerUtils.getHtmlId(file) + '" class="d2h-file-wrapper" data-lang="' + file.language + '">\n' +