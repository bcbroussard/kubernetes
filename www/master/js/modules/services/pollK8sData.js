(function() {
  'use strict';

  angular.module('pollK8sData', []);
         .service('pollK8sDataService', PollK8sDataService);

  var PollK8sDataService = function($http, $timeout) {
    var k8sdatamodel = undefined;
    var pollingError = 0;
    var promise = undefined;

    var startPolling = function() {
      // TODO: maybe display an error in the UI to the end user.
      if (pollingError > 3) {
        console.log('Have ' + pollingError + ' consecutive polling errors.');
      }

      // TODO: Pass in the real URL
      $http.get('http://turing-glider-846.appspot.com/graph').
        success(function(data, status, headers, config) {
        if (data) {
          k8sdatamodel = data;
          pollingError = 0;
        } else {
          pollingError++;
        }

        // TODO: externalized this poll interval as a config value in
        // www/master/js/config
        promise = $timeout(startPolling, 1000);
      }).error(function(data, status, headers, config) {
        pollingError++;

        // TODO: externalized this poll interval as a config value in
        // www/master/js/config
        promise = $timeout(startPolling, 1000);
      });
    };

    startPolling();

    return {
      k8sdatamodel : k8sdatamodel,
      restart: function() {
        startPolling();
      },
      stop: function() {
        $timeout.cancel(promise);
      }
    };
  };

})();
