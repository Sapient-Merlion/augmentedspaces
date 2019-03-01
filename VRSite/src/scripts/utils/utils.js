// eslint-disable-next-line 
var Utils = {
  getUrlParams: function (id) {
    var o = _.chain(location.search)
      .replace('?', '')
      .split('&')
      .map(_.partial(_.split, _, '=', 2))
      .fromPairs()
      .value();
    return id ? o[id] : o;
  },
}