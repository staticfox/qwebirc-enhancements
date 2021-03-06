// <% if(pkg.build["atheme"]) { %> only include this code if "atheme" set in package.json
/**
 *  chan list view
 *
 *  @depends [panes/PanelView, atheme]
 *  @provides [panes/Channels]
 */
ui.ChannelList = new Class({
    Extends: PanelView,
    options: {
        pane: "channel-list",
        i18n: "channels",
        events: {
            "click:relay(.refresh)": "postRender",
            "keypress:relay(input.filter)": "update",
            "change:relay(input.filter)": "update",

            "click:relay(.internal,.chan)": "join",
            "dblclick:relay(.channels [data-channel])": "join"
        },
        limit: 100,
        chanmask: "",
        topicmask: "",

        onJoin: function(e,target) {
            this.fireEvent("addChannel", target.get("data-channel") || target.val() || target.get("href"));
        }
    },

    postRender: function() {
        var self = this,
            options = self.options;

        irc.atheme.channelList(function(channels) {
            self.chanList = channels.map(function(channel) {
                return _.assign(channel, "topic", util.urlifier.parse(channel.topic));//urlify the channel - doesn't do colours yet
            });
            self.update();
        }, 0, options.limit, 1, options.chanmask, options.topicmask);
    },

    update: _.debounce(function() {
        var self = this;
        var userFilter = self.element.getElement("input.filter").val();
        var filterExp = new RegExp(String.escapeRegExp(userFilter), "i"); //jsperf.com/contains-ignore-case
        util.getTemplate("channel-list-content", function(template) {
            self.element.getElement(".channels tbody").html(template({
                channels: self.chanList.filter(function(chan) {
                    return !userFilter || filterExp.test(chan.name) || filterExp.test(chan.topic);
                })
            }));
        });
    }, 50)
});
//<% } %>