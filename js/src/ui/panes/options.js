/**
 *  Options view
 *
 *  @depends [panes/PanelView, panes/Welcome,  util/ToggleNotifications]
 *  @provides [panes/Options]
 */
ui.OptionView = new Class({
    Extends: PanelView,
    Binds: ["save", "reset"],
    options: {
        pane: "options",
        i18n: "options",
        deps: ["js/modules/jscolor.js"],
        events: {
            "change:relay(input,select)": "inputChange",
            "change:relay(.notice-group input)": "noticeChange",
            "click:relay(#add-notice)": "addNotifier",
            "click:relay(.remove-notice)": "removeNotifier",
            "click:relay(#dn_state)": "dnToggle",
            "click:relay(#notice-test)": "noticeTest",
            "click:relay(#sound-test)": "beepTest"
        },
        
        onDnToggle: function(e, target) {
            /* global toggleNotifications */
            toggleNotifications(this.model);
            target.val(this.model.get("dn_state") ? lang.DISABLE : lang.ENABLE);
        }
    },

    /*********LISTENERS**************/
    inputChange: function(e, target) {//set model values when inputs are clicked
        var id = target.get("id"),
            item;

        //handle sub props
        if(id && (id = util.splitMax(id, ".", 2)) && (null != (item = this.model.get(id[0])))) {
            if(id.length > 1) {
                this.model.set(id[0], _.assign(_.clone(item), id[1], target.val()));
            }
            else this.model.set(id[0], target.val());
        }
    },

    addNotifier: function(data) {
        if(!data || Type.isDOMEvent(data)) {
            data = this.model.defaultNotice();
            var n = _.clone(this.model.get("custom_notices"));
            n.push(data);
            this.model.set("custom_notices", n);
        }

        var $addbtn = this.element.getElement("#add-notice"/*"#custom_notices .panel-body"*/);

        var _data = _.clone(data);

        $addbtn.insertAdjacentHTML("beforebegin", templates.customNotice(_data));//insert before btn
    },

    removeNotifier: function(e, target) {
        e.stop();
        var type = target.getParent(".notice-group").id;
        var par = target.getParent(".controls").dispose();
        var id = par.get("data-id");
        this.model.set("custom_notices", (_.reject(this.model.get(type), function(xs) {return xs.id === id})));
    },

    noticeChange: function(e, target) {
        e.stop();
        var type = target.getParent(".notice-group").id;
        var par = target.getParent(".controls");
        var notices = _.clone(this.model.get(type));
        var notice = _.findWhere(notices, {id: par.get("data-id")});
        notice[target.get("data-id")] = target.val();
        this.model.set("custom_notices", notices);
    },
    /*********LISTENERS**************/

    postRender: function() {
        // _.each(model.get("custom_notices"), function(notice) {
        //     notice.lang = lang;
        //     this.addNotifier(notice);
        // }, this);

        this.element.getElement("form").addEvents({ //default will fire before bubble
            "submit": this.save,
            "reset": this.reset
        });

        ui.WelcomePane.show(this.options.getUI(), {
            element: this.element
        });
        //instantiate colour pickers
        window.jscolor.init();

        return this.parent();
    },

    getData: function() {
        var data = this.model.toJSON();
        // data.lang = lang;
        data.beep_sounds = this.options.getUI().options.sounds.sounds; //from I/Notifiers
        return data;
    },

    save: function(e) {
        if(e) e.stop();
        this.model.save();
        this.destroy();
    },

    reset: function(e) {
        if(e) e.stop();
        this.model.sync();
        this.destroy();
    },

    destroy: function() {
        return this.trigger("close").parent();
    }
});