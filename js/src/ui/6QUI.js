
ui.QUI = new Class({
    Extends: ui.QuakeNetUI,
    Binds: ["__createChannelMenu"],
    initialize: function(parentElement, theme, options) {
        this.parent(parentElement, ui.QUI.Window, "qui", options);

        parentElement.addClass('qui')
                    .addClass('signed-out');
        this.theme = theme;
        this.parentElement = parentElement;
        this.setModifiableStylesheet("qui");
        this.setHotKeys();


        this.parentElement.addEvents({
            "click:relay(.lines .hyperlink-whois)": this.whoisURL,
            "click:relay(.lines .hyperlink-channel)": this.chanURL
        });
    },
    postInitialize: function() {
        var self = this,
            qjsui = self.qjsui = new ui.QUI.JSUI("qui", self.parentElement);

        // qjsui.addEvent("reflow", function() {
        //     var win = self.getActiveWindow();
        //     if ($defined(win))
        //         win.onResize();
        // });

        self.outerTabs = qjsui.top;
        var tabs = self.tabs = Element.from(templates.tabbar()),
            joinChan =  function(){
                var chan = prompt("Enter channel name:");
                if(chan.trim() !== ""){
                    Object.each(self.clients, function(client) {
                        client.exec("/JOIN " + chan);
                    });
                }
            },
            tabbtns = Element.from(templates.tabbarbtns()),
            addTab = tabbtns.getElement('.add-chan'),
            scrollers = tabbtns.getElements('[name="tabscroll"]'),
            scroller = new Fx.Scroll(tabs),
            resizeTabs = util.fillContainer.curry(tabs, 'max-width'),
            onResize = function() {
                var wid = tabs.getWidth(),
                    swid = tabs.getScrollWidth();

                if(swid > wid) {
                    scrollers.show();
                }
                else {
                    scrollers.hide();
                }

                resizeTabs();
            };

        window.addEvent('resize', onResize);
        tabs.addEvents({
            'adopt': onResize,
            'disown': onResize
        });

        scrollers.filter('.to-left')
            .addEvent('click', function(e) {
                e.stop();
                var pos = tabs.getScrollLeft(),
                    $ele = util.elementAtScrollPos(tabs, pos);

                scroller.toElement($ele, 'x');
                console.log($ele);
            });
        scrollers.filter('.to-right')
            .addEvent('click', function(e) {
                e.stop();
                var pos = tabs.getScrollLeft() + tabs.getWidth(),
                    $ele = util.elementAtScrollPos(tabs, pos);

                scroller.toElementEdge($ele, 'x');
                console.log($ele);
            });

        resizeTabs();
        addTab.addEvents({
            'dblclick': joinChan,
            'click': self.__createChannelMenu
        });

        //for scrolling tabs with mousewheel
        tabs.addEvent("mousewheel", function(event) {
            event.stop();
            /* up */
            if (event.wheel > 0) {
                self.nextWindow();
            } else if (event.wheel < 0) { /* down */
                self.prevWindow();
            }
        });


        //append menu and tabbar
        self.outerTabs.adopt(self.__createDropdownMenu(),
                            tabs,
                            tabbtns);

        var origWin = qjsui.createWindow();
        self.origtopic = self.topic = origWin.topic;
        self.origlines = self.lines = origWin.middle;
        self.orignicklist = self.nicklist = origWin.right;

        self.input = origWin.bottom;
        // self.reflow = qjsui.reflow.bind(qjsui);

        // self.reflow(origWin);
        // self.reflow.delay(100, self, origWin); /* Konqueror fix */


        //For window resizing
        // window.addEvent("resize", function() {
        //     self.getActiveWindow().reflow(100);
        // });


        //delay for style recalc
        self.__createDropdownHint.delay(500, self);
    },
    __createDropdownMenu: function() {
        var self = this,

            dropdownMenu = Element.from(templates.menudrop());

        //     hidemenu = dropdownMenu.hideMenu = function(e) {
        //         if(e)
        //             e.stop();
        //         dropdownMenu.hide();
        //         document.removeEvent("mousedown", hidemenu);
        //     },
        //     showMenu = dropdownMenu.showMenu = function(e) {
        //         e.stop();
        //         self.hideHint();

        //         if (dropdownMenu.isDisplayed()) {
        //            hidemenu();
        //         } else {
        //             dropdownMenu.show()
        //             document.addEvent("mousedown", hidemenu);
        //         }
        //     };

        // hidemenu();

        // dropdownMenu.position.delay(500, dropdownMenu, {
        //             relativeTo: self.outerTabs,
        //             position: {x: 'left', y: 'bottom'},
        //             edge: {x: 'left', y: 'top'}
        //         }

        dropdownMenu.inject(self.parentElement);

        var dropdown = Element.from(templates.menubtn({icon: self.options.icons.menuicon}));
        dropdown.setStyle("opacity", 1);
                // .addEvent("mousedown", Event.stop)
                // .addEvent("click", showMenu);


        self.UICommands.each(function(cmd) {
            var text = cmd[0];
            var fn = self[cmd[1] + "Window"].bind(self);
            var ele = Element.from(templates.menuitem({text:text}));
            ele.addEvent("mousedown", function(e) {
                    e.stop();
                })
                .addEvent("click", function() {
                    dropdownMenu.hideMenu();
                    fn();
                });
            dropdownMenu.appendChild(ele);
        });

        // var dropdown = new Element("div");
        // dropdown.addClass("dropdown-tab");
        // dropdown.appendChild(new Element("img", {
        //     src: qwebirc.global.staticBaseURL + "images/icon.png",
        //     title: "menu",
        //     alt: "menu"
        // }));

        var dropdownEffect = new Fx.Tween(dropdown, {
            duration: "long",
            property: "opacity",
            link: "chain"
        });

        dropdownEffect.start(0.25)
                    .start(1)
                    .start(0.33)
                    .start(1);


        ui.decorateDropdown(dropdown,dropdownMenu, {
            onShow: function() {
                if(self.hideHint)
                    self.hideHint();
                delete self.hideHint;
            }
        });
        return dropdown;
    },

    setHotKeys: function (argument) {
        var events = storage.get('hotkeys');
        console.log('todo');
        if(keys && events) {
            keys.activate();
        }
    },

    //the effect on page load
    __createDropdownHint: function() {
        var dropdownhint = Element.from(templates.dropdownhint());
        dropdownhint.inject(this.parentElement)
                    .position({
                        relativeTo: this.outerTabs,
                        position: {'y': 'bottom'},
                        offset: {y:10}
                    });

        new Fx.Morph(dropdownhint, {
            duration: "normal",
            transition: Fx.Transitions.Sine.easeOut
        }).start({
            left: [900, 5]
        });

        var hider = function() {
                new Fx.Morph(dropdownhint, {
                    duration: "long"
                }).start({
                    left: [5, -900]
                });
            }.delay(4000);

        var hider2 = this.hideHint = Element.destroy.curry(dropdownhint);

        hider2.delay(4000);

        var hider3 = function(e) {
                if (e.code === 17) {
                    window.ctrl = 0;
                }
            };

        document.addEvent("mousedown", hider2)
                .addEvent("keydown", hider2)
                .addEvent("keyup", hider3);
    },

    //todo use other dropdown menu code
    __createChannelMenu: function() {
        var client = this.getActiveIRCWindow().client,
            chans = client.getPopularChannels().map(function(chan) {
                return {
                    text: chan.channel,
                    hint: chan.users
                };
            }),
            menu = Element.from(templates.chanmenu({
                channels: chans
            }));

        menu.inject(this.parentElement);

        ui.decorateDropdown(this.addTab, menu);
        menu.show();
    },

    newClient: function(client) {
        this.parentElement.removeClass('signed-out')
                            .addClass('signed-in');
        return this.parent(client);
    },

    // setLines: function(lines) {
    //     this.lines.parentNode.replaceChild(lines, this.lines);
    //     this.qjsui.middle = this.lines = lines;
    // },
    // setChannelItems: function(nicklist, topic) {
    //     if (!$defined(nicklist)) {
    //         nicklist = this.orignicklist;
    //         topic = this.origtopic;
    //     }
    //     nicklist.replaces(this.nicklist);
    //     this.qjsui.right = this.nicklist = nicklist;

    //     topic.replaces(this.topic);

    //     this.qjsui.topic = this.topic = topic;
    // }
    setWindow: function(win) {
        this.qjsui.setWindow(win);
    },

    //called in context of irc client
    nickChange: function(data) {
        if(data.thisclient) {
            Object.each(this.windows, function(win) {
                win.$nicklabel.set("text", data.newnick);
            });
        }
    }
});

ui.QUI.JSUI = new Class({
    Implements: [Events],
    initialize: function(class_, parent, sizer) {
        this.parent = parent;
        this.windows = [];

        this.sizer = $defined(sizer) ? sizer : parent;

        this.class_ = class_;
        this.create();

        // this.reflowevent = null;
    },
    // applyClasses: function(pos, el) {
    //     el.addClass("dynamicpanel")
    //         .addClass(this.class_);

    //     switch(pos) {
    //         case "middle":
    //             el.addClass("leftboundpanel");
    //             break;
    //         case "top":
    //             el.addClass("topboundpanel")
    //                 .addClass("widepanel");
    //             break;
    //         case "right":
    //             el.addClass("rightboundpanel");
    //             break;
    //         case "topic":
    //             el.addClass("widepanel");
    //             break;
    //         case "bottom":
    //             el.addClass("bottomboundpanel")
    //                 .addClass("widepanel");
    //             break;
    //     }
    // },
    create: function() {
        // var XE = function(pos) {
        //         var element = new Element("div");
        //         this.applyClasses(pos, element);

        //         this.parent.appendChild(element);
        //         return element;
        //     }.bind(this);

        // this.top = XE("top");
        // this.topic = XE("topic");
        // this.middle = XE("middle");
        // this.right = XE("right");
        // this.properties = XE("properties");
        // this.bottom = XE("bottom");

        var top = this.top = Element.from(templates.topPane()),
            windows = this.winContainer = Element.from(templates.windowsPane()),
            detach = this.detachContainer = Element.from(templates.detachedPane());
        this.parent.adopt(top, windows, detach);
    },

    createWindow: function() {
        var win = {
            'window': Element.from(templates.windowPane()),
            'topic': Element.from(templates.topicPane()),
            'content': Element.from(templates.contentPane()),
            'middle': Element.from(templates.leftPane()),
            'right': Element.from(templates.nickPane()),
            'properties': Element.from(templates.propertiesPane()),
            'bottom': Element.from(templates.inputPane())
        };

        win.content.adopt(win.middle, win.right);
        win.window.adopt(win.topic, win.content, win.properties, win.bottom);
        this.winContainer.appendChild(win.window);
        this.windows.push(win);

        return win;
    },

    reflow: function(win, delay) {
        console.log('dummy');
        // if (!delay)
        //     delay = 1;

        // if (this.reflowevent)
        //     $clear(this.reflowevent);
        // this.__reflow(win);
        // this.reflowevent = this.__reflow.delay(delay, this, win);
    },
    __reflow: function(win) {
        // var properties = win.properties,
        //     bottom = win.bottom,
        //     middle = win.middle,
        //     right = win.right,
        //     topic = win.topic,
        //     top = this.top,

        //     topicsize = topic.getSize(),
        //     topsize = top.getSize(),
        //     rightsize = right.getSize(),
        //     bottomsize = bottom.getSize(),
        //     docsize = this.sizer.getSize();

        // var mheight = (docsize.y - topsize.y - bottomsize.y - topicsize.y),
        //     mwidth = (docsize.x - rightsize.x);

        // topic.setStyle("top", topsize.y);

        // var last5_height = 0;
        // var last5msg = $('last5messages');
        // if (last5msg) {
        //     last5msg.className = "qwebirc-qui ircwindow dynamicpanel lines";
        //     last5msg.style.top = topsize.y + topicsize.y + 'px';
        //     last5msg.style.width = mwidth + 'px';
        //     last5msg.style.zIndex = '1';
        //     last5msg.style.borderBottom = '1px dashed #C8D1DB';
        //     last5_height = last5msg.offsetHeight;
        //     middle.setStyle("top", (topsize.y + topicsize.y + last5msg.offsetHeight));
        // } else {
        //     middle.setStyle("top", (topsize.y + topicsize.y));
        // }

        // if (mheight > 0) {
        //     middle.setStyle("height", mheight - 25 - last5_height);
        //     right.setStyle("height", mheight);
        // }

        // if (mwidth > 0) {
        //     middle.setStyle("width", mwidth);
        //     properties.setStyle("width", mwidth);
        // }
        // right.setStyle("top", (topsize.y + topicsize.y))
        //     .setStyle("left", mwidth);

        // properties.setStyle("top", (docsize.y - bottomsize.y - 25));
        // bottom.setStyle("top", (docsize.y - bottomsize.y));
        // this.fireEvent("reflow", win);
    },
    // showChannel: function(win, state, nicklistVisible) {
    //     // var display = state ? "block" : "none";
    //     // this.right.setStyle("display", nicklistVisible ? display : "none");
    //     // this.topic.setStyle("display", display);
    //     win.right.toggle(state && nicklistVisible);
    //     win.topic.toggle(state);
    // },
    // showInput: function(win, state) {
    //     // this.bottom.setStyle("display", state ? "block" : "none");
    //     win.bottom.isVisible = state;
    //     win.bottom.toggle(state);
    // }
    setWindow: function(newWin) {
        this.windows.each(function (win) {
            if(win.detached !== true) {
                win.window.hide();
            }
        });
        newWin.window.show();
    }
});
