;(function () {
  'use strict';
  let csFace = new CSInterface();

  let app = new Vue(
    {
      el: '#app',
      data: {
        value: `Say Hi`,
        refresh_btn: 'Refresh Widget',
        aiVers: 'xxxx',
        testBtn: 'Test',
        fontWeight: 'xxxx'
      },
      methods: {
        os: function () {
          return csFace.getOSInformation();
        },

        refresh: function () {
          location.reload();
        },

        getAiVers: function () {
          function _callback(res) {
            this.aiVers = res;
          }

          let _bindedCallback = _callback.bind(this);

          csFace.evalScript('app.version', function (res) {
            _bindedCallback(res);
          });
        },

        test: function () {
          function _callback(res) {
            this.fontWeight = res;
          }

          let _bindedCallback = _callback.bind(this);

          csFace.evalScript('getMinLineWeight()', function (res) {
            _bindedCallback(res);
          });
        }
      }
    });

  app.getAiVers();
}());
