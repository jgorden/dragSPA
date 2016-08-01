// check browser compatibility
var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

var $form = $('.box');

var $input    = $form.find('input[type="file"]'),
    $label    = $form.find('label'),
    showFiles = function(files) {
      $label.text(files.length > 1 ? ($input.attr('data-multiple-caption') || '').replace( '{count}', files.length ) : files[ 0 ].name);
    };



if (isAdvancedUpload) {
  $form.addClass('has-advanced-upload');
  
  var files = 0;
  var fileIds = {};
  var droppedFiles = false;

  $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
  })
  .on('dragover dragenter', function() {
    $form.addClass('is-dragover');
  })
  .on('dragleave dragend drop', function() {
    $form.removeClass('is-dragover');
  })
  .on('drop', function(e) {
    droppedFiles = e.originalEvent.dataTransfer.files;
    $form.trigger('submit');
    showFiles( droppedFiles );

    // create icon representations and UI elements
    for (var i = droppedFiles.length - 1; i >= 0; i--) {
      $('body').append("<div class='file' id='" + files + "'><figure><img id='" + files + "' class='thumbnail' src='images/thumb.png'><figcaption>"+droppedFiles[i].name+"</figcaption></figure></div>");
      $('#' + files).draggable({containment: "parent"})
        .on('dblclick', function(e) {
          var r = confirm('download ' + $('#' + e.target.id + ' > figure > figcaption').text() + '?');
          if(r){
            // initialize download
          }
        });;
      $('#' + files).css({'top': e.pageY, 'left' : e.pageX})
      files++;
    };
  });

}


$form.on('submit', function(e) {
  if ($form.hasClass('is-uploading')) return false;

  $form.addClass('is-uploading').removeClass('is-error');

  if (isAdvancedUpload) {
    // ajax for modern browsers
    e.preventDefault();

    var ajaxData = new FormData($form.get(0));

    if (droppedFiles) {
      $.each( droppedFiles, function(i, file) {
        ajaxData.append( $input.attr('name'), file, file.name);
      });
    }
    var url = 'http://ec2-54-191-43-53.us-west-2.compute.amazonaws.com/upload'
    $.ajax({
      url: url,
      type: $form.attr('method'),
      beforeSend: function (request){
                   request.setRequestHeader("s-token", "092834kljsdfsdfasdf983420324radfsdfj3987u24nadf");
                  },
      data: ajaxData,
      dataType: 'json',
      cache: false,
      contentType: 'application/octet-stream',
      processData: false,
      complete: function() {
        $form.removeClass('is-uploading');
      },
      success: function(data) {
        fileIds[files] = data.file_id;
        $form.addClass( data.success == true ? 'is-success' : 'is-error' );
        if (!data.success) $errorMsg.text(data.error);
      },
      error: function() {
        console.log('uh oh');
      }
    });
  } else {
    // ajax for legacy browsers
      var iframeName  = 'uploadiframe' + new Date().getTime();
    $iframe   = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

    $('body').append($iframe);
    $form.attr('target', iframeName);

    $iframe.one('load', function() {
      var data = JSON.parse($iframe.contents().find('body' ).text());
      $form
        .removeClass('is-uploading')
        .addClass(data.success == true ? 'is-success' : 'is-error')
        .removeAttr('target');
      if (!data.success) $errorMsg.text(data.error);
      $form.removeAttr('target');
      $iframe.remove();
    });
  }
});

