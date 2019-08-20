(function(root, factory) {
  if(typeof define === 'function' && define.amd) {
    define(['angular', 'file-upload-component'], factory);
  } else if(typeof exports === 'object') {
    module.exports = factory(require('angular'), require('file-upload-component'));
  } else {
    factory(root.angular, root.FileUploadComponent);
  }
})(this, function(angular, FileUploadComponent) {
  return angular
    .module('file-picker-component', [])
    .directive('filePicker', ['uploader', function(uploader) {
      FileUploadComponent.register('native-file-picker', uploader);

      return {
        restrict: 'E',
        scope: {
          ngModel: '='
        },
        link(scope, element, attrs) {
          var fp = document.createElement('native-file-picker');

          fp.setController(uploader(scope.ngModel));
          scope.ngModel = fp.$controller;

          for(let key of ["desc", "accepts"]) {
            if(attrs.hasOwnProperty(key)) {
              attrs.$observe(key, function(val) {
                fp.setAttribute(key, attrs[key]);
              });
            }
          }

          scope.$watch(() => scope.ngModel !== fp.$controller, function() {
            if(scope.ngModel !== fp.$controller) {
              fp.setController(uploader(scope.ngModel));
              scope.ngModel = fp.$controller;
            }
          });

          element[0].appendChild(fp);
        }
      };
    }])
    .name;
});