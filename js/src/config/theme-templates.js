/**
 * @depends [config, util/utils]
 * @provides [config/theme-templates]
 */
var baseControlMap = { //these are settings for the templates -ie {C} is replaced by irc.styles.colour.key
    "C": irc.styles.colour.key,
    "O": irc.styles.colour.key,
    "B": util.getStyleByName("bold").key,
    "U": util.getStyleByName("underline").key,
    "D": Browser.ie ? "" : irc.styles.normal.key, //address ie bug where /x00 is null character
    //little clever here
    "NN": templates.userlink({"nick":"{N}"}),//nick name
    "CN": templates.userlink({"nick":"{newnick}"}),// change nick
    "P": "{C}4=={O} " //prefix
};

config.ThemeControlCodeMap = Object.map(baseControlMap, function(str) {
    return util.formatSafe(str, baseControlMap);
});

config.IRCTemplates = {
    "SIGNON": "{P}Signed on!",
    "CONNECT": "{P}Connected to server - establishing IRC connection.",

    "INFO": "{m}",
    "RAW": "{P}{m}",
    "DISCONNECT": "{P}Disconnected from server: {m}",
    "ERROR": "{P}ERROR: {m}",

    "SERVERNOTICE": "{P}{m}",
    "OURTARGETEDNOTICE": "[notice({[}{t}{]})] {m}",
    "OURCHANNOTICE": "-{N}:{t}- {m}",
    "OURPRIVNOTICE": "-{N}- {m}",
    "CHANNOTICE": "-{D}{(}{N}{)}{D}:{c}- {m}",
    "PRIVNOTICE": "-{(}{N}{)}- {m}",

    "JOIN": "{P}{D}{N}{D} [{h}] has joined {c}",
    "OURJOIN": "{P}{D}{N}{D} [{h}] has joined {c}",
    "PART": "{P}{D}{N}{D} [{h}] has left {c} [{m}]",
    "KICK": "{P}{D}{kickee}{D} was kicked from {c} by {D}{kicker}{D} [{m}]",
    "MODE": "{P}mode/{c} gives [{m}] to {D}{N}{D}",
    "QUIT": "{P}{D}{N}{D} [{h}] has quit [{m}]",
    "NICK": "{P}{D}{n}{D} has changed nick to {CN}",
    "TOPIC": "{P}{D}{N}{D} changed the topic of {c} to: {m}",
    "UMODE": "Usermode change: {m}",
    "INVITE": "{N} invites you to join {c}",

    "HILIGHT": "{C}4",
    "HILIGHTEND": "{O}",

    "CHANMSG": "{D}{nicktmpl}{)}{D} {m}",
    "PRIVMSG": "{(}{nicktmpl}{)} {m}",

    "OURCHANMSG": "{nicktmpl} {m}",
    "OURPRIVMSG": "{nicktmpl} {m}",
    "OURTARGETEDMSG": "*{[}{t}{]}* {m}",
    "OURCHANACTION": " * {N} {m}",
    "OURPRIVACTION": " * {N} {m}",

    "CHANACTION": " * {D}{(}{N}{)}{D} {m}",
    "PRIVACTION": " * {(}{N}{)} {m}",
    "CHANCTCP": "{N} [{h}] requested CTCP {data} from {c}: {m}",
    "PRIVCTCP": "{N} [{h}] requested CTCP {data} from {n}: {m}",
    "CTCPREPLY": "CTCP {x} reply from {N}: {m}",

    "OURCHANCTCP": "[ctcp({t})] {x} {m}",
    "OURPRIVCTCP": "[ctcp({t})] {x} {m}",
    "OURTARGETEDCTCP": "[ctcp({t})] {x} {m}",

    "WHOISUSER": "{P}{B}{N}{B} [{h}]",
    "WHOISREALNAME":        "{P} realname : {m}",
    "WHOISCHANNELS":        "{P} channels : {m}",
    "WHOISSERVER":          "{P} server   : {server} [{m}]",
    "WHOISACCOUNT":         "{P} account  : {m}",
    "WHOISIDLE":            "{P} idle     : {idle} [connected: {m}]",
    "WHOISAWAY":            "{P} away     : {m}",
    "WHOISOPER":            "{P}          : {B}IRC Operator{B}",
    "WHOISOPERNAME":        "{P} operedas : {m}",
    "WHOISACTUALLY":        "{P} realhost : {m} [ip: {ip}]",
    "WHOISGENERICTEXT":     "{P} note     : {m}",
    "WHOISEND": "{P}End of whois {n}",

    "AWAY": "{P}{N} is away: {m}",
    "GENERICERROR": "{P}{t}: {m}",
    "GENERICMESSAGE": "{P}{m}",
    "WALLOPS": "{P}WALLOP {n}: {t}",
    "CHANNELCREATIONTIME": "{P}Channel {c} was created at: {m}",
    "CHANNELMODEIS": "{P}Channel modes on {c} are: {m}"
};