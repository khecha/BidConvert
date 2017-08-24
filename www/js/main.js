var app = {
    queryCurrency: function() {

        //base and target currencies selected by user
        var base = $("#base").val();
        var target = $("#target").val();

        //Yahoo Finance API to retrieve the latest exchange rates
        var jqxhr = $.ajax({
            url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20%28%22" + base + target + "%22%29&env=store://datatables.org/alltableswithkeys&format=json",
            type: "GET"
        });

        jqxhr.done(function(data) {

            if (($("#base").val() != null || $("#target").val() != null) && !isNaN($('#amount').val())) {
                var res = data.query.results.rate;
                var rate = res.Rate;
                var amount = $('#amount').val();
                var total = (rate * amount).toFixed(4);

                // Display the converted amount in the result div
                $('.returnedValue').text(app.addCommas(amount) + " " + base + " = " + app.addCommas(total) + " " + target);

                // set the last sync value
                var lastUpdated = data.query.created;
                lastUpdated = new Date(lastUpdated);

                $('.last-updated h2').text("Last updated: " + lastUpdated.toLocaleString());
            }
        });

        jqxhr.fail(function(jqXHR, textStatus) {
            alert("The following error occured when trying to access the data: " + textStatus);
        });
    },

    addCommas: function(n) {
        n += '';
        x = n.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
};

$(function(){

    function setFlags(state) {
        if (!state.id) {
            return state.text;
        }
        var $state = $('<span><img src="img/flags/' + state.element.value + '.png" class="img-flag" /> ' + state.text + '</span>');
        return $state;
    };

    $(".currency-selector").select2({
        theme: "classic",
        templateResult: setFlags,
        templateSelection: setFlags,
        placeholder: "Please select a currency",
        allowClear: true
    });


})
