//CONST
var PT_TO_MM = 0.352777778;

function ai_test() {
  var w     = new Window('dialog'),
      btn_1 = w.add('button', undefined, 'Default'),
      btn_2 = w.add('button', undefined, 'Test');
  w.show();
}

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
};

// todo: add filter by height
function __getMinWidth(selection) {
  var minWidth = 10000000;
  for (var i = 0; i < selection.length; i++) {
    minWidth = Math.min(selection[i].width, minWidth);
  }
  return minWidth;
}

