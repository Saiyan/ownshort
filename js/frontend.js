$('.shorten-form button').click(function(event){
    $('.ajax-indicator').show();
    var url = $('input[name=url]').val();
    $.get('/?url='+url,function(data){
        var $out = $('.short-url-output');
        $out.text(data);
        $out.attr('href',data);
        $('.ajax-indicator').hide();
    });
    event.preventDefault();
});