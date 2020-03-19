/**
 * Try to search min lineweight of the seleted textFrame
 *
 * @return {Number} minimal textFrame lineweight
 * */
function getMinLineWeight() {
  var PT_TO_MM = 0.352777778;
  var str = prompt('Input simbols', 'LilI');

  if (str == null || str === '') throw new Error('Canceled by user');

  var lay = _addLay('MIN_LINEWEIGT');

  var textFrame   = _getTextFrame(selection),
      minHeightEl = _mkTmplPath(textFrame, '.', lay),
      knifeHeight = minHeightEl.height;

  minHeightEl.remove();

  var path2slices   = _mkTmplPath(textFrame, str, lay),
      knives        = _mkKnives(path2slices, knifeHeight),
      slices        = _mkSlices(path2slices, knives, knifeHeight),
      minLineWeight = _getMinWidthElem(slices);

  path2slices.pathItems.add();
  path2slices.pathItems[0].fillColor = _setCol([100, 0, 100, 0]);
  minLineWeight.fillColor = _setCol([0, 100, 0, 0]);

  return (minLineWeight.width * PT_TO_MM).toFixed(3);

  /***METHODS***/
  /***LIB***/

  function _getTextAttr(textElem){

  }

  function _addLay(name) {
    var lays = activeDocument.layers;
    if (lays[0].name === name) {
      if (lays[0].visible && !lays[0].locked) return lays[0];
    }

    var lay = activeDocument.layers.add();
    lay.name = name;
  }

  function _setCol(arr/*[c,m,y,k]*/) {
    col = new CMYKColor();
    col.cyan = arr[0];
    col.magenta = arr[1];
    col.yellow = arr[2];
    col.black = arr[3];
    return col;
  }

  /**
   * Compare all slices, choose one with min width
   * Remove other
   *
   * @return {PathItem}
   * */
  function _getMinWidthElem(slices) {

    var el = slices.pop();

    for (var i = slices.length - 1; i >= 0; i--) {
      var slice = slices[i];

      if (slice.width <= el.width) {
        el.remove();
        el = slices.pop();
      } else {
        slice.remove();
        slices.pop();
      }
    }

    return el;
  }

  /**
   * intersect templates paths with knife paths
   *
   * @return {Array} slices - array of paths
   * */
  function _mkSlices(tmplPath, knives, minHeight) {
    var slices = [];

    for (var i = 0; i < knives.length; i++) {
      var knife = knives[i],
          meat  = tmplPath.duplicate();

      executeMenuCommand('deselectall');

      knife.selected = true;
      meat.selected = true;

      __intersectSelection();

      executeMenuCommand('ungroup');

      for (var j = 0; j < selection.length; j++) {
        var selectionElement = selection[j];
        slices.push(selectionElement);
      }

    }

    __filterByHeight(slices, minHeight);

    return slices;

    function __filterByHeight(arr, h) {
      for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i].height < h) {
          arr[i].remove();
          arr.splice(i, 1);
        }
      }
    }

    /**
     * make action that try to intersect selection paths
     * */
    function __intersectSelection() {
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

          f      = new File('~/ScriptAction.aia');

      f.open('w');
      f.write(actStr);
      f.close();
      app.loadAction(f);
      f.remove();
      app.doScript("Intersect_selection", "Intersect_selection", false); // action name, set name
      app.unloadAction("Intersect_selection", ""); // set name
    }
  }

  /**
   * make knife-rectangles to trim text
   *
   * @return {Array} knives - array of Objects PathItems Rectangles
   * */
  function _mkKnives(tmplPath, rectHeight) {
    var W_EXT = 5;
    var _h = tmplPath.height;
    var _w = tmplPath.width + W_EXT * 2;
    var knives = [];

    var amtRects = Math.ceil(_h / rectHeight);

    for (var i = 0, j = 0; i < amtRects; i++, j -= rectHeight) {
      var rect = activeDocument.pathItems.rectangle(0, 0, _w, rectHeight);
      rect.position = [
        tmplPath.position[0] - W_EXT,
        tmplPath.position[1] + (amtRects * rectHeight - _h) / 2 + j
      ];
      knives.push(rect);
    }

    return knives;
  }

  /**
   * Make CompoundPath from TextFrame
   *
   * @param {Object} textFrame - TextFrame
   * @param {String} textContents - string to replace textFrame content
   * @return {PathItem} pathTemplate - Object PathItem
   * */
  function _mkTmplPath(textFrame, textContents, lay) {
    var textFrameDuplicate, pathTemplate, len;

    textFrameDuplicate = textFrame.duplicate(
      activeDocument.layers[0], ElementPlacement.PLACEATEND
    );

    textFrameDuplicate.words.removeAll();

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
