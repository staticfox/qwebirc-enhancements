

ui.setTitle = function(title, options) {
    if (options && options.alert) {
        ui.setTitleAlert(title, options);
    } else {
        document.title = title;
    }
};

ui.supportsFocus = function() {
    var result = (util.isMobile || Browser.name === "Konqueror") ?  [false, false] : [true];

    ui.supportsFocus = $lambda(result);
    return result;
};

util.NBSPCreate = function(text, element) {
    var e = text.split("  ");
    e.each(function(txt, i) {
        var tn = document.createTextNode(txt);
        element.appendChild(tn);

        if (i != e.length - 1) {
            var e2 = new Element("span", {"html": "&nbsp;&nbsp;"});
            element.appendChild(e2);
        }
    });
};

util.setCaretPos = Element.setCaretPosition;

util.setAtEnd = function($el) {
    util.setCaretPos($el, $el.value.length);
};

util.getCaretPos = Element.getCaretPosition;

//....
//TODO this is garbage
util.createInput = function(type, parent, name, selected, id) {
    var r;
    if (Browser.Engine.trident) {
        if (name) {
            name = " name=\"" + escape(name) + "\"";
        } else {
            name = "";
        }
        if (id) {
            id = " id=\"" + escape(id) + "\"";
        } else {
            id = "";
        }
        r = $(document.createElement("<input type=\"" + type + "\"" + name + id + " " + (selected ? " checked" : "") + "/>"));
    } else {
        r = new Element("input");
        r.type = type;
        if (name) r.name = name;
        if (id) r.id = id;

        if (selected) r.checked = true;
    }

    parent.appendChild(r);
    return r;
};

util.percentToPixel= function(data, par) {
    par = par || document.body;
    var size = par.getSize();
    return {
        x: size.x * (data.x / 100),
        y: size.y * (data.y / 100)
    };
}


ui.decorateDropdown = function(btn, ddm, options) {
    ddm.hideMenu = function(e) {
        if(e)
            e.stop();
        if(options && options.onHide)
            options.onHide.call(this, ddm);
        ddm.hide();
        document.removeEvent("mousedown", ddm.hideMenu);
    };
    ddm.showMenu = function(e) {
        if(e)
            e.stop();
        if(options && options.onShow)
            options.onShow.call(this, ddm);

        if (ddm.isDisplayed()) {
           ddm.hideMenu();
        } else {
            ddm.show();
            document.addEvent("mousedown", ddm.hideMenu);
        }
    };

    ddm.hideMenu();

    ddm.position.delay(50, ddm, {
        relativeTo: btn,
        position: {x: 'left', y: 'bottom'},
        edge: {x: 'left', y: 'top'}
    });

    btn.addEvents({
        "mousedown": Event.stop,
        "click": ddm.showMenu
    });
};

//dirty function please help with css :(
//dir can be 'width' 'height'
util.fillContainer = function ($ele, sty) {
    (function() {//wait a sec for style recalcs
        var offset = 10;
        sty = (sty || 'width').toLowerCase();

        $ele.getSiblings().each(function(sib) {
            offset += sib["get" + sty.capitalize()]();
        });

        $ele.setStyle(sty, "calc(100% - " + offset + "px)");
    }).delay(20);
    return $ele;
};
