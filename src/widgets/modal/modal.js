/**
 * Created by caelumtian on 16/3/7.
 */
(function(global) {
    var modalCache = [];
    var Modal = Class.create(Widget, {
        attrs : {
            type : "alert",
            classNames : {
                "appear" : "ph-modal-in",
                "none" : "ph-modal-out",
                "container" : "ph-modal",
                "inner" : "ph-modal-inner",
                "title" : "ph-modal-title",
                "text" : "ph-modal-text",
                "buttons" : "ph-modal-buttons",
                "buttonConfirm" : "ph-modal-button ph-confirm",
                "buttonCancel" : "ph-modal-button ph-modal-line ph-cancel"
            },
            callbackOk : null,
            callbackCancel : null,
            containerClass : "page-panel",
            title : "",
            text : "欢迎使用PhantomUI",
            confirmText : "确认",
            cancelText : "取消",
            cancel : "",
            template :   '<div class="{$classNames.container}">'
                        +   '<div class="{$classNames.inner}">'
                        +       '<div class="{$classNames.title}">{$title}</div>'
                        +       '<div class="{$classNames.text}">{$text}</div>'
                        +   '</div>'
                        +   '<div class="{$classNames.buttons}">'
                        +       '{$cancel}' + '<span class="{$classNames.buttonConfirm}">{$confirmText}</span>'
                        +   '</div>'
                        +'</div>'
        },
        _initTemplate : function() {
            var self = this;
            var template = this.get('template');
            switch(this.get("type")) {
                case "confirm" :
                    var str = '<div class="' + this.get("classNames.buttonCancel") + '">' + this.get("cancelText") + '</div>';
                    this.set("cancel", str);
            }
            // 替换template中的{$className}占位符
            typeof template == 'string' && (template = template.replace(/{\$([^\})]*)}/g, function() {
                return self.get(arguments[1]);
            }));
            this.set("template", template);
        },
        setup : function() {
            var self = this;
            if(Widget.query("." + this.get("containerClass")).length === 0) {
                this.pannel = new Pannel();
            }else {
                this.pannel = Widget.query("." + this.get("containerClass"))[0];
            }
        },
        _pushModalCache : function() {
            modalCache.push(this);
        },
        _displayModal : function() {
            if(modalCache[0] === this) {
                this.pannel.show();
                this.pannel.$element.append(this.$element);
                var height = this.$element.height() / (-1.185 * 2);
                this.$element.css({
                    "margin-top": height + "px"
                });
                this.$element.removeClass(this.get("classNames.none"));
                this.$element.addClass(this.get("classNames.appear"));
                this.delegateEvents(document, "click .ph-confirm", this._handlerOk);
                if(this.get("type") === "confirm") {
                    this.delegateEvents(document, "click .ph-cancel", this._handlerCancel);
                }
            }
        },
        show : function() {
            this._pushModalCache();
            this._displayModal();
        },
        hide : function() {
            //移走首内容
            var self = modalCache.shift();
            this.$element.addClass(this.get("classNames.none"));
            this.$element.on("webkitTransitionEnd transitionEnd", function(event) {
                self.$element.removeClass(self.get("classNames.none") + " " + self.get("classNames.appear"));
                self.$element.off("webkitTransitionEnd transitionEnd");
                self.$element.remove();
            });
            if(modalCache.length > 0) {
                modalCache[0]._displayModal();
            }else {
                this.pannel.hide();
            }
        },
        _handlerOk : function(event) {
            if(Util.contain(document, this.element)) {
                this.hide();
                this.undelegateEvents(document, "click .ph-confirm");
                //触发点击ok后的回调函数
                if(typeof this.get("callbackOk") === "function") {
                    this.get("callbackOk").apply(this);
                }
            }
        },
        _handlerCancel : function() {
            if(Util.contain(document, this.element)) {
                this.hide();
                this.undelegateEvents(document, "click .ph-cancel");
                //触发点击ok后的回调函数
                if(typeof this.get("callbackCancel") === "function") {
                    this.get("callbackCancel").apply(this);
                }
            }
        }
    });
    var Util = {
        contain : function(a, b) {
            return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
        }
    };
    global.Modal = Modal;
})(this);
