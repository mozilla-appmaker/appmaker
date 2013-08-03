var Components = {}
Components.tags = []
Components.templates = {}

Components.add = function (tagName) {
  Components.tags.push(tagName)
  Components.templates[tagName] = $('template#' + tagName).html().trim()
}

Components.broadcast = function (message) {
  $('.component').trigger('dblclick', message)
  $(document).trigger('braodcast', message)
}

// Replace all Component tags with the components
Components.replace = function () {
  Components.tags.forEach(function (tagName, index) {
    $(tagName).each(function () {
      var clone = $(Components.templates[tagName])
      clone.addClass('component')
      clone.addClass(tagName)
      $(this).replaceWith(clone)
    })
  })
}

Components.scan = function () {
  // Scan the page for components
  $('template').each(function () {
    var id = $(this).attr('id')
    Components.add(id)
  })
}


