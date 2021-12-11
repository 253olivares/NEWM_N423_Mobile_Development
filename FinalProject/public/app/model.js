var MODEL = (function () {
  var _changeContent = function (page, callback) {
    $.get(`pages/${page}/${page}.html`, function (data) {
      $("#app").html(data);
      if (callback) {
        callback(page);
      }
    });
  };
  return { changeContent: _changeContent };
})();
