var Components = {}
Components.tags = []
Components.templates = {}
Components.defaultChannel = 'blue'

Components.broadcast = function (message, channel) {
  if (!channel)
    channel = Components.defaultChannel

  $(document).trigger('broadcast', message, channel)
  
  $('.component').each(function () {
    var listensTo = $(this).attr('listen-to')
    if (listensTo === undefined)
      listensTo = Components.defaultChannel
    if (listensTo === channel)
      $(this).trigger('dblclick', message)
  })
}

// Initialize all user component tags with the component code
Components.replace = function () {
  Components.tags.forEach(function (tagName, index) {
    $(tagName).each(function () {
      // If it has already been initialized, continue
      if ($(this).hasClass('component'))
        return true
      $(this).addClass('component')
      $(this).addClass(tagName)
      var template = $(Components.templates[tagName])
      $(this).attr('ondblclick', template.attr('ondblclick'))
      $(this).html(template.html().trim())
      $(this).find('.component-thumb').remove()
      $(this).on('broadcast', function (event, message) {
        Components.broadcast(message, $(this).attr('broadcast-to'))  
      })
    })
  })
}

// Scan the page for components
Components.scan = function () {
  Components.tags = []
  $('template').each(function () {
    var tagName = $(this).attr('id')
    Components.tags.push(tagName)
    Components.templates[tagName] = $('template#' + tagName)
  })
}



