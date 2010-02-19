DialogSystem = {
    _layers: []
};

DialogSystem.showDialog = function(elmt, onCancel) {
    var overlay = $('<div>&nbsp;</div>')
        .addClass("dialog-overlay")
        .css("z-index", 101 + DialogSystem._layers.length * 2)
        .appendTo(document.body);
        
    var container = $('<div></div>')
        .addClass("dialog-container")
        .css("z-index", 102 + DialogSystem._layers.length * 2)
        .appendTo(document.body);
        
    elmt.css("visibility", "hidden").appendTo(container);
    container.css("top", Math.round((overlay.height() - elmt.height()) / 2) + "px");
    elmt.css("visibility", "visible");
    
    var layer = {
        overlay: overlay,
        container: container,
        onCancel: onCancel
    };
    DialogSystem._layers.push(layer);
    
    var level = DialogSystem._layers.length;
    return level;
};

DialogSystem.dismissAll = function() {
    DialogSystem.dismissUntil(0);
};

DialogSystem.dismissUntil = function(level) {
    for (var i = DialogSystem._layers.length - 1; i >= level; i--) {
        var layer = DialogSystem._layers[i];
        layer.overlay.remove();
        layer.container.remove();
        
        if (layer.onCancel) {
            try {
                layer.onCancel();
            } catch (e) {
                console.log(e);
            }
        }
    }
    DialogSystem._layers = DialogSystem._layers.slice(0, level);
};

DialogSystem.createDialog = function() {
    return $('<div></div>').addClass("dialog-frame");
};

DialogSystem.showBusy = function(message) {
    var frame = DialogSystem.createDialog();
    frame.width("300px").css("-moz-border-radius", "25px");
    
    var body = $('<div>').addClass("dialog-busy-body").appendTo(frame);
    $('<img>').attr("src", "images/large-spinner.gif").appendTo(body);
    $('<span>').text(" " + (message || "Working...")).appendTo(body);
    
    var level = DialogSystem.showDialog(frame);
    
    return function() {
        DialogSystem.dismissUntil(level - 1);
    };
};
