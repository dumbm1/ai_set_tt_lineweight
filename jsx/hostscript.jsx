//CONST
/**
 * Try to search min lineweight of the seleted textFrame
 * 1. duplicate textFrame
 * 2. erase all except the last character, set the new content
 *
 * @return {Number} minimal textFrame lineweight
 * */
function getMinLineWeight() {
  var PT_TO_MM = 0.352777778;

  var textFrame = _getTextFrame(selection);
  var tmplHeightElem = _makeTmplPath(textFrame, '.');
  var rectHeight = tmplHeightElem.height;
  tmplHeightElem.remove();
  var tmplPath = _makeTmplPath(textFrame, 'ILJNHTMiljnhtm');
  var rects = mkRects(tmplPath, rectHeight);

  alert(rects);

  function mkRects(tmplPath, rectHeight) {
    try {
      var W_EXT = 5;
      var _h = tmplPath.height;
      var _w = tmplPath.width + W_EXT * 2;
      var rects = [];

      var amtRects = Math.ceil(_h / rectHeight);

      for (var i = 0, j = 0; i < amtRects; i++, j + rectHeight) {
        var rect = rects[i];
        rect = document.rectangle.add(0, 0, _w, rectHeight);
        rect.position = [
          tmplPath.position[0] - W_EXT,
          tmplPath.position[1] + (amtRects - _h) / 2 + j
        ];
      }

      return rects;
    } catch (e) {
      return e;
    }
  }

  /**
   * make action that try to intersect selection paths
   * */
  function _intersectSelection() {
    var actStr = '' +
      '/version 3' +
      '/name [ 19' +
      '	496e746572736563745f73656c656374696f6e' +
      ']' +
      '/isOpen 0' +
      '/actionCount 1' +
      '/action-1 {' +
      '	/name [ 19' +
      '		496e746572736563745f73656c656374696f6e' +
      '	]' +
      '	/keyIndex 0' +
      '	/colorIndex 7' +
      '	/isOpen 1' +
      '	/eventCount 1' +
      '	/event-1 {' +
      '		/useRulersIn1stQuadrant 1' +
      '		/internalName (ai_plugin_pathfinder)' +
      '		/localizedName [ 10' +
      '			5061746866696e646572' +
      '		]' +
      '		/isOpen 1' +
      '		/isOn 1' +
      '		/hasDialog 0' +
      '		/parameterCount 1' +
      '		/parameter-1 {' +
      '			/key 1851878757' +
      '			/showInPalette 1' +
      '			/type (enumerated)' +
      '			/name [ 9' +
      '				496e74657273656374' +
      '			]' +
      '			/value 1' +
      '		}' +
      '	}' +
      '}',

      f = new File('~/ScriptAction.aia');

    f.open('w');
    f.write(actStr);
    f.close();
    app.loadAction(f);
    f.remove();
    app.doScript("Intersect_selection", "Intersect_selection", false); // action name, set name
    app.unloadAction("Intersect_selection", ""); // set name
  }

  function _getMinWidth(selection) {
    var minWidth = 10000000;
    for (var i = 0; i < selection.length; i++) {
      minWidth = Math.min(selection[i].width, minWidth);
    }
    return minWidth;
  }

  /**
   * Make CompoundPath from TextFrame
   *
   * @param {Object} textFrame - TextFrame
   * @param {String} textContents - string to replace textFrame content
   * @return {Object} pathTemplate - Path
   * */
  function _makeTmplPath(textFrame, textContents) {
    var textFrameDuplicate, pathTemplate, len;

    textFrameDuplicate = textFrame.duplicate();
    len = textFrame.characters.length;

    for (var i = 0; i < len - 1; i++) {
      textFrameDuplicate.characters[0].remove();
    }

    if (textContents) textFrameDuplicate.contents = textContents;

    executeMenuCommand('deselectall');
    pathTemplate = textFrameDuplicate.createOutline();
    pathTemplate.selected = true;
    executeMenuCommand('compoundPath');
    pathTemplate = selection[0];

    return pathTemplate;
  }

  /**
   * Try to get the selected TextFrame
   *
   * @return {Object} TextFrameItem
   * */
  function _getTextFrame(selection) { // try to get the TextFrame

    if (!selection[0] && !selection.typename) throw new Error('No selection!'); // no selection

    if (selection[0]) { // object mode
      if (selection.length > 1) throw new Error('So meny selection!');
      if (selection[0].typename === 'GroupItem') { // try to get TextFrame from GrouItem
        if (selection[0].pageItems.length > 1) throw new Error('It\'s a complex group!');
        if (selection[0].pageItems[0].typename !== 'TextFrame') {
          throw new Error('Selection in group doesn\'t a Text Frame!');
        }
        return selection[0].pageItems[0];

      }
      if (selection[0].typename !== 'TextFrame') throw new Error('Selection doesn\'t a Text Frame!');
      return selection[0];
    } else if (selection.typename) { // text mode
      return selection.parent.textFrames[0];
    }

    throw new Error();
  }

}

