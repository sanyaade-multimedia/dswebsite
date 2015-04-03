

/*/////////////////////////////////////////////

 LoginComponent

 requires: jquery.cookie
 optional: jquery.validate.password

 /////////////////////////////////////////////*/

function LoginComponent(i_autherizeURL){

    // events
    this.LOGINBUTTON         = 'LOGINBUTTON';
    this.USERID              = 'USERID';
    this.USERPASSID          = 'USERPASSID';
    this.SIGNUPPASS1         = 'SIGNUPPASS1';
    this.SIGNUPPASS2         = 'SIGNUPPASS2';
    this.SIGNUPSUBMIT        = 'SIGNUPSUBMIT';
    this.SIGNUPUSER          = 'SIGNUPUSER';
    this.UNIQUEUSER          = 'UNIQUEUSER';
    this.UNIQUEUSERPROGRESS  = 'UNIQUEUSERPROGRESS';
    this.UNIQUEUSERMICROLINE = 'UNIQUEUSERMICROLINE';
    this.UNIQUEUSERMESSAGE   = 'UNIQUEUSERMESSAGE';
    this.SIGNUPPASSMATCHMSG  = 'SIGNUPPASSMATCHMSG';
    this.SIGNUPPASSMATCHLINE = 'SIGNUPPASSMATCHLINE';
    this.SIGNUPCANCEL        = 'SIGNUPCANCEL';
    this.REMEBERME           = 'REMEBERME';
    this.FORGOTPASSWORD      = 'FORGOTPASSWORD';
    this.AUTHENTICATED       = 'AUTHENTICATED';
    this.ALERT_MSG           = 'ALERT_MSG';

    this.m_autherizeURL      = i_autherizeURL;
    this.m_forceTypeAccount  = '';
    this.ajax                = commBroker.getService('ajax');
    this.registerEvents();

};

LoginComponent.prototype = {
    constructor: LoginComponent,

    registerEvents: function(){

        var self = this;

        commBroker.listen(this.LOGINBUTTON,function(e){
            self.logButton = $(e.context);
            self.logButton.bind('click tap',function(e){
                self.onLogon(e);
                return false;
            });
        });

        commBroker.listen(this.REMEBERME,function(e){
            self.rememberMeID = $(e.context);
            self.rememberMeID.bind('change','focusout', function(e){
                self.rememberMeID.is(':checked') == true ? self.rememberMe = true : self.rememberMe = false;
                self.rememberMeID.is(':checked') == true ? self.rememberMeID.val('1') : self.rememberMeID.val(0);
                return false;
            });
        });

        commBroker.listen(this.FORGOTPASSWORD,function(e){
            self.forgotPassword = $(e.context);
            self.forgotPassword.bind('click',function(e){
                if (self.userNameID.val().length<4) {
                    $().toastmessage('showToast', {
                        text     : 'please fill your user name or email address first<br/> and click again',
                        sticky   : false,
                        position : 'middle-center',
                        stayTime : 7000,
                        type     : 'warning'
                    });
                    return false;
                }

                if (confirm('Proceed with sending your email?')) {
                    var obj = {
                        '@functionName':'f_forgotPassword',
                        '@userName': $(self.userNameID).val()
                    }

                    commBroker.fire(globs.WAITSCREENON);
                    var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWS-debug.php' : 'https://secure.dynawebs.net/_php/msWS.php');

                    ajaxWrapper.getData(obj,onForgotPasswordReply);

                    function onForgotPasswordReply(data){
                        commBroker.fire(globs.WAITSCREENOFF);
                        if ( data.responce.status=='pass'){
                            $().toastmessage('showToast', {
                                text     : 'your password was sent to: ' + data.responce.email,
                                sticky   : false,
                                position : 'middle-center',
                                stayTime : 7000,
                                type     : 'warning'
                            });
                        } else {
                            $().toastmessage('showToast', {
                                text     : 'sorry but we could not find a user / email by that name',
                                sticky   : false,
                                position : 'middle-center',
                                stayTime : 7000,
                                type     : 'warning'
                            });
                        }
                    }
                }
                return false;
            });
        });

        commBroker.listen(this.UNIQUEUSERMESSAGE,function(e){
            self.uniqueUserMessage = $(e.context);
        });

        commBroker.listen(this.UNIQUEUSERMICROLINE,function(e){
            self.uniqueUserMicroLine = $(e.context);
        });

        commBroker.listen(this.USERID,function(e){
            self.userNameID = $(e.context);
        });

        commBroker.listen(this.USERPASSID,function(e){
            self.userPassID = $(e.context);
        });

        commBroker.listen(this.SIGNUPUSER,function(e){
            self.signUpUserID = e.context;
            self.signupElemSetup(e);
        });

        commBroker.listen(this.SIGNUPSUBMIT,function(e){
            self.signUp = $(e.context);
            $(self.signUp).bind('click', function(e){
                self.onSignupSubmit(e);
                return false;
            });
        });

        commBroker.listen(this.UNIQUEUSER,function(e){
            self.uniqueUser = $(e.context);
        });

        commBroker.listen(this.UNIQUEUSERPROGRESS,function(e){
            self.uniqueUserProgress = $(e.context);
        });

        commBroker.listen(this.SIGNUPPASSMATCHMSG,function(e){
            self.signUpPassMatchMsgID = $(e.context);
        });

        commBroker.listen(this.SIGNUPPASSMATCHLINE,function(e){
            self.signUpMatchLineID = $(e.context);
        });

        commBroker.listen(this.SIGNUPPASS1,function(e){
            self.signUpPassID1 = $(e.context);
            self.signUpPassID1.bind('change focusout keyup', {caller: self}, self.comparePasswords);
        });

        commBroker.listen(this.SIGNUPPASS2,function(e){
            self.signUpPassID2 = $(e.context);
            self.signUpPassID2.bind('change focusout keyup', {caller: self}, self.comparePasswords);
        });

    },

    cookieSetup: function(self, data){
        /* if ( self.rememberMe == true ){
            $.cookie('digitalsignage', data, { expires: 1095, path: '/' });
        } */
    },

    signupElemSetup: function(e){
        self.signUpUserID = e.context;

        $(self.signUpUserID).keypress(function (e) {
            var regex = new RegExp("^[a-zA-Z0-9_@.!#+-^|~]+$");
            var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            if (regex.test(str)) {
                return true;
            }
            e.preventDefault();
            return false;
        });

        $(self.signUpUserID).bind('blur', function(){

            if ($(self.signUpUserID).val().length<5) {
                $().toastmessage('showToast', {
                    text     : 'User name picked is too short, plesae try again',
                    sticky   : false,
                    position : 'middle-center',
                    stayTime : 4000,
                    type     : 'warning'
                });
                return;
            }

            $(self.signUpUserID).prop('disabled',true);
            $(self.uniqueUser).hide();
            $(self.uniqueUserProgress).show();

            var obj = {
                '@functionName':'f_checkUserNameExists',
                '@userName': $(self.signUpUserID).val()
            }

            var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWS-debug.php' : 'https://secure.dynawebs.net/_php/msWS.php');
            ajaxWrapper.getData(obj,onCheckUserNameExistsReply);

            function onCheckUserNameExistsReply(data){
                if ( data.responce.status=='pass'){

                    $(self.uniqueUserMessage).text('Verified');
                    $(self.uniqueUserMicroLine).css('background-color', 'green')

                } else {

                    $(self.uniqueUserMessage).text('Already used');
                    $(self.uniqueUserMicroLine).css('background-color', '#e0e0e0')

                    $().toastmessage('showToast', {
                        text     : 'User name already exists, please pick a different name',
                        sticky   : false,
                        position : 'middle-center',
                        stayTime : 4000,
                        type     : 'warning'
                    });
                }

                $(self.uniqueUser).show();
                $(self.uniqueUserProgress).hide();

                setTimeout(function(){
                    $(self.signUpUserID).prop('disabled',false);
                },2000)
            }
        });
    },

    onLogon: function(e){
        var self = this;

        if ($.trim($(self.userNameID).val())==''|| $.trim($(self.userPassID).val())=='')
            return;

        commBroker.fire(globs.WAITSCREENON);

        var data = {
            '@functionName':'f_authUser',
            '@userName': $(self.userNameID).val(),
            '@userPass': $(self.userPassID).val(),
            '@accountType': self.m_forceTypeAccount
        }
        var ajaxWrapper = new AjaxJsonGetter(self.m_autherizeURL);
        ajaxWrapper.getData(data,self.loginAuthenticateReply,self);
        return;
    },

    onSignupSubmit: function(e){
        var self = this;
        var msg = $(".password-meter-message").text();

        // if we didn't find '.password-meter-message' via jquery.validate.password we don't verify pass
        if (msg.length) {
            switch ($.trim(msg.toLowerCase())){
                case 'too similar to username':     {}
                case 'too short':                   {}
                case 'very weak':                   {}
                case 'weak':                        {
                    $().toastmessage('showToast', {
                        text     : 'please select a stronger password',
                        sticky   : false,
                        position : 'middle-center',
                        type     : 'warning'
                    });
                    return false;
                }
            }
        }

        if($(self.signUpPassID1).val()!= $(self.signUpPassID2).val())
        {
            $().toastmessage('showToast', {
                text     : 'the two passwords do not match',
                sticky   : false,
                position : 'middle-center',
                type     : 'warning'
            });
            return false;;
        }

        commBroker.fire(globs.WAITSCREENON);

        var obj = {
            '@functionName':'f_createUserAccount',
            '@userName': $(self.signUpUserID).val(),
            '@userPass': $(self.signUpPassID1).val()
        }
        var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWS-debug.php' : 'https://secure.dynawebs.net/_php/msWS.php');
        ajaxWrapper.getData(obj,onCreateUserAccountReply);

        function onCreateUserAccountReply(data){

            if ( data.responce.status=='pass'){

                $().toastmessage('showToast', {
                    text     : 'Account created successfully',
                    sticky   : false,
                    position : 'middle-center',
                    type     : 'success'
                });

                $(self.userNameID).val(self.signUpUserID.val());
                $(self.userPassID).val(self.signUpPassID1.val());
                $(self.logButton).prop('type','submit');  // IE8 bug so using prop
                $(self.logButton).click();  // $(self.logButton).unbind().click();

            } else {

                commBroker.fire(globs.WAITSCREENOFF);

                $().toastmessage('showToast', {
                    text     : 'there was a problem creating your account, try using a different user name',
                    sticky   : false,
                    position : 'middle-center',
                    type     : 'warning'
                });
            }
        }
        return false;
    },

    comparePasswords: function(e){

        var self = e.data['caller'];
        if($(self.signUpPassID1).val() == $(self.signUpPassID2).val() && $(self.signUpPassID2).val().length>3)
        {
            $(self.signUpPassMatchMsgID).text('Match');
            $(self.signUpMatchLineID).css('background-color', 'green')
        } else {
            $(self.signUpPassMatchMsgID).text('No match');
            $(self.signUpMatchLineID).css('background-color', '#e0e0e0')
        }
    },


    loginAuthenticateReply: function(data){

        var self = data.context;

        if ( data.responce.status == 'pass' )
        {
            commBroker.fire(self.AUTHENTICATED,null,null,data);

        } else {

            commBroker.fire(globs.WAITSCREENOFF);
            if ( $().toastmessage!=null ){
                $().toastmessage('showToast', {
                    text     : 'User or password are invalid, you may try again',
                    sticky   : false,
                    stayTime: 6000,
                    position : 'middle-center',
                    type     : 'error'
                });
            } else {
                commBroker.fire('ALERT_MSG',this,null,'User or password or your account type are invalid, you may try again');
            }
        }
    },

    forceRememberMe: function(){
        var self = this;
        $(self.rememberMeID).attr('checked','checked');
        $(self.rememberMeID).attr('disabled','disabled');
    },

    // Optional argument that will pass authentication only if account type & user & pass match
    typeAccountEnforce: function(i_forceTypeAccount){
        this.m_forceTypeAccount = i_forceTypeAccount;
    },

    submitFormSuccessLogin: function(data){

        var self = data.context;

        if ( data.responce.status == 'pass' )
        {
            self.ajax.abortAll();
            $(self.userNameID).val(data.responce.data);
            $(self.logButton).prop('type','submit');  // IE8 bug so using prop
            $(self.logButton).unbind().click();
            return false;

        } else {

            commBroker.fire(globs.WAITSCREENOFF);
            $().toastmessage('showToast', {
                text     : 'User or password entered are invalid, you may try again',
                sticky   : false,
                stayTime: 6000,
                position : 'middle-center',
                type     : 'error'
            });
        }
    }
};



/*/////////////////////////////////////////////

 Navigator

 /////////////////////////////////////////////*/

function Navigator (i_Element, i_imageURL){

    this.self               = this;
    this.m_Element          = i_Element;
    this.m_imageURL         = i_imageURL;
    this.m_indexMap         = {};
    this.m_navigationID     = '';
    this.m_lastID           = -1;

    this.viewStack          = commBroker.getService('viewStack');
    this.init();
};

Navigator.prototype = {
    constructor: Navigator,

    init: function(){
        var self = this;
        commBroker.listen(self.viewStack.VIEW_CHANGED, function(e){
            self.updateNavigator(e);
        });
        var html =  '<div id="navigationClassID"></div>';
        self.m_navigationID = $(html).insertBefore(this.m_Element);
    },

    addNavigation: function(i_name){
        var self = this;
        var image = this.m_imageURL + '/' + i_name + '.png';
        $('<img id="'+ i_name +'" src="' + image + '" class="navigationButtons"/>').appendTo(self.m_navigationID);
    },

    updateNavigator: function(e){
        var self = this;
        self.m_lastID = e == undefined ? self.m_lastID : e.edata;
        var name = self.m_indexMap[self.m_lastID];
        if(name==undefined)
            return;
        $('.navigationButtons').animate({opacity: 0.2},300);
        $('.navigationButtons').each(function(){
            elemName = $(this).attr('id')
            if (elemName==name){
                 $(this).animate({opacity: 0.7},500);
            }
        });
    },

    setIndexMap: function(i_indexMap){
        var self = this;
        self.m_indexMap = i_indexMap;
        self.updateNavigator();
    }
}


/*/////////////////////////////////////////////

 CCComponent

 requires jquery.watermark.js
 requires: jquery.ccValidator.js

 /////////////////////////////////////////////*/

function CCComponent (){

    this.CCNUMBER           = 'CCNUMBER';
    this.CCMONTH            = 'CCMONTH';
    this.CCYEAR             = 'YEAR';
    this.CCCCV              = 'CCCCV'
    this.CCIMAGE            = 'CCIMAGE';
    this.CCIMAGESEL         = 'CCIMAGESEL';
    this.CCIMAGEICON        = 'CCIMAGEICON';
    this.PAYMENTMETHOD      = 'PAYMENTMETHOD'
    this.PAYPAL             = 'PP';
    this.CREDITCARD         = 'CC';

    this.m_paymentSelected  = this.CREDITCARD;


    this.self = this;
    this.m_validCard = false;
    this.m_cardType  = '';
    this.registerEvents();
};

CCComponent.prototype = {
    constructor: CCComponent,

    registerEvents: function(){

        var self = this;

        commBroker.listen(this.CCNUMBER,function(e){
            self.ccNumberID = e.context;
            $(self.ccNumberID).watermark('Amex - Visa -Mastercard - Discover');
        });

        commBroker.listen(this.CCMONTH,function(e){
            self.ccMonthID = e.context;
        });

        commBroker.listen(this.CCYEAR,function(e){
            self.ccYearID = e.context;
        });

        commBroker.listen(this.CCCCV,function(e){
            self.ccCCVID = e.context;
            $(self.ccCCVID).watermark('CCV code');
        });

        commBroker.listen(this.CCIMAGE,function(e){
            self.ccImageID = e.context;
        });

        commBroker.listen(this.CCIMAGESEL,function(e){
            self.ccImageSelID = e.context;
        });

        commBroker.listen(this.CCIMAGEICON,function(e){
            self.ccImageIcon = e.context;
        });

        commBroker.listen(this.PAYMENTMETHOD,function(e){
            self.paymentMethod = e.context;
            $(self.paymentMethod).change(function(){
               self.paymentTypeSelected();
            });
        });
    },

    paymentTypeSelected: function(){
        var self = this;
        var selected = $("option:selected", self.paymentMethod).text();

        if ( selected.indexOf('PayPal')>-1 ){
            self.m_paymentSelected = self.PAYPAL;
            $(self.ccNumberID).closest('table').hide();

        } else {

            self.m_paymentSelected = self.CREDITCARD;
            $(self.ccNumberID).closest('table').show();

        }
    },

    disablePaymentTypeSelection: function(i_setDefaultPayment){
        var self = this;
        self.m_paymentSelected = i_setDefaultPayment;
        $(self.paymentMethod).hide();
    },

    getPaymentSelected: function(){
        var self = this;
        return self.m_paymentSelected;
    },

    serialize: function(){
        var values = '';
        values+= cleanChar( $(this.ccNumberID).val());
        values+= cleanChar( $(this.ccCCVID).val())+ ',';
        return values;
    },

    selectYear: function(i_year){
        this.insertYears(i_year)
    },

    selectMonth: function(i_month){
        this.insertMonths(i_month)
    },

    insertMonths: function(i_month){
        var months=new Array();
        months[1]="January"; months[2]="February"; months[3]="March"; months[4]="April"; months[5]="May"; months[6]="June"; months[7]="July"; months[8]="August"; months[9]="September"; months[10]="October"; months[11]="November"; months[12]="December";
        var buffer = '';
        for (var i=1; i<months.length;i++){
            if (i==i_month){
                buffer+= '<option value="' + i + '"SELECTED>' +  months[i] + ' (' + i + ') </option>';
            } else {
                buffer+= '<option value="' + i + '">' +  months[i] + ' (' + i + ') </option>';
            }

        }
        $(this.ccMonthID).children().remove();
        $(buffer).appendTo(this.ccMonthID);
    },

    insertYears: function(i_year){
        var currentYear = Number((new Date).getFullYear())-1;
        var buffer = '';
        for (var i=0; i<10;i++){
            currentYear+=1;
            if (currentYear==i_year){
                buffer+= '<option value="' + currentYear + '"SELECTED>' + currentYear + '</option>';
            } else {
                buffer+= '<option value="' + currentYear + '">' + currentYear + '</option>';
            }
        }
        $(this.ccYearID).children().remove();
        $(buffer).appendTo(this.ccYearID);
    },

    isValid: function(isCCRequired){
        var self = this;
        // if cc not required and user didn't enter anything, return true
        if (!isCCRequired)
            if ($(this.ccNumberID).val().length == 0)
                return true;

        if (self.m_paymentSelected == "PP")
            return true

        if(!this.m_validCard)
        {
            $(this.ccNumberID).effect("shake", { times:3 }, 1000);
            return false;
        }

        if ($(this.ccCCVID).val().length<3)
        {
            $(this.ccCCVID).effect("shake", { times:3 }, 1000);
            return false;
        }


        return true;
    },

    getCCType: function(){
        return this.m_cardType.length == 0 ? null : this.m_cardType;
    },

    validateCC: function(){
        var self = this.self;
        $(self.ccNumberID).validateCreditCard(function(result)
        {
            if (result.card_type) {
                $(self.ccImageID).animate({opacity: 0.2});
                self.m_cardType = String(result.card_type.name);
                $(self.ccImageSelID).show();
                switch (result.card_type.name) {
                    case 'visa': {
                        $(self.ccImageSelID).css({
                            left: '0px',
                            top: '0px',
                            "background-position-x": '0px'
                        }); break;
                    };
                    case 'mastercard': {
                        $(self.ccImageSelID).css({
                            left: '57px',
                            top: '0px',
                            "background-position-x": '-57PX'
                        }); break;
                    };
                    case 'discover': {
                        $(self.ccImageSelID).css({
                            left: '114px',
                            top: '0px',
                            "background-position-x": '-114PX'
                        }); break;
                    };
                    case 'amex': {
                        $(self.ccImageSelID).css({
                            left: '170px',
                            top: '0px',
                            "background-position-x": '-170PX'
                        }); break;
                    };

                    default: {
                        $(self.ccImageID).css({opacity: 1});
                        $(self.ccImageSelID).hide();
                        break;
                    }
                }

                if (result.luhn_valid && result.length_valid ) {
                    $(self.ccImageIcon).animate({opacity: 1});
                    self.m_validCard = true;

                } else {
                    $(self.ccImageIcon).animate({opacity: 0.1});
                    self.m_validCard = false;
                    self.m_cardType = '';
                }

            } else {

                self.m_validCard = false;
                self.m_cardType = '';
                $(self.ccImageID).animate({opacity: 1});
                $(self.ccImageIcon).animate({opacity: 0.1});
                $(self.ccImageSelID).hide();
            }
        });
    }
};


/*/////////////////////////////////////////////

 Viewstack

 Args:

 i_contentID: container id which will hold content (required)
 i_tabsID: <ul> id which will hold tabs (optional)

 /////////////////////////////////////////////*/

Viewstack.VIEW_CHANGED       = 'VIEW_CHANGED';

function Viewstack(i_contentID, i_tabsID) {

    // events
    this.WAITSCREENON       = globs['WAITSCREENON']
    this.WAITSCREENOFF      = globs['WAITSCREENOFF']
    this.VIEW_CHANGED       = 'VIEW_CHANGED';

    var self = this.self    = this;

    this.m_contentID        = i_contentID;
    this.m_tabsID           = i_tabsID;
    this.m_tabCounter       = 0;
    this.m_waitPanelID      = '';
    this.m_waiting          = false;

    if (this.m_tabsID){
        $(this.m_tabsID +' a').live('click',function(event){
            event.preventDefault();
            self.onTabSelection(this,event);
        });
    }

    this.init();

};


Viewstack.prototype = {
    constructor: Viewstack,

    init: function() {
        var self = this;

        commBroker.listen(this.WAITSCREENON,function(e){
            self.waitScreen(true);
        });

        commBroker.listen(this.WAITSCREENOFF,function(e){
            self.waitScreen(false);
        });
    },

    addChild: function(childID, tabName){
        var elem = $(childID).appendTo(this.m_contentID);
        $(childID).siblings().hide();
        this.m_tabCounter++;
        $(childID).attr('id','tab'+this.m_tabCounter);

        if(this.m_tabsID){
            $(this.m_tabsID).append( '<li class="ui-button" ><a href="#" name="tab'+this.m_tabCounter+'">' +tabName+'</a></li>' );
        }
        var t = -1;
        $(this.m_contentID+'> *').each(function(){
            t++;
            if (this === elem[0]){
                return false;
            }
        });
        return t;
    },

    selectIndex: function(index){

        var self = this.self;
        if(this.m_tabsID){ $(this.m_tabsID+' li').attr('id',''); } // reset all ID's for <li>

        $(this.m_contentID+'> *').each(function(i){
            if (index == i){
                commBroker.fire(self.VIEW_CHANGED, this, self, index);
                $($(self.m_tabsID).children().eq(i)).attr('id','current');
                $(this).siblings().hide().end().fadeIn();
            }
        });
    },

    onTabSelection: function(target,event){
        var self = this;
        if (this.m_waiting)
            return;
        if ($(target).closest("li").attr("id") == "current"){ //detection for current tab
            return
        } else {
            commBroker.fire(self.VIEW_CHANGED, this, null, target);
            $(this.m_contentID+'> *').hide(); // Hide all content
            if(this.m_tabsID){ $(this.m_tabsID+' li').attr('id',''); } // reset all ID's for <li>
            $(target).parent().attr("id","current"); // Activate this
            $('#' + $(target).attr('name')).children().andSelf().fadeIn(); // Show content for current tab
        }
    },

    setWaitScreenPanel: function(i_panelID){
        this.m_waitPanelID = i_panelID;
    },


    getWaitScreenPanel: function(){
        return this.m_waitPanelID;
    },

    waitScreen: function(state){
        if (!this.m_waitPanelID)
            return;

        if (state){
            this.m_waiting = true;
            var w = $(this.m_contentID).width();
            var h = $(this.m_contentID).height();
            $(this.m_waitPanelID).css({width: w+'px', height: h+'px'}).fadeIn('slow');
            $(this.m_waitPanelID).appendTo(this.m_contentID);
        } else {
            this.m_waiting = false;
            $(this.m_waitPanelID).fadeOut();
        }
    }
}

/*/////////////////////////////////////////////

 Ajax RPC

 requires: ComBroker
 requires: jquery.toast

 ------------------------------------------
 FOR XML:

 To send XML Data use the following method/data:

 SEND:
 this.ajax.getData(
 {userName: self.userName,userPass: self.userPass},
 'http://my.server.com', 'onReply', 'xml', this
 );

 RECEIVE:
 var xmlDoc = data.response;
 var resultTag = $(xmlDoc).find( "result" );
 var status = $(resultTag).attr("status");
 ------------------------------------------

 /////////////////////////////////////////////*/

AjaxRPC.serviceName = 'ajax';

function AjaxRPC(i_timeout) {

    // events
    this.AJAXERROR = 'AJAXERROR';

    this.m_timeout = i_timeout;
    this.m_abort = false;
    this.m_ajax = '';
    this.m_queue = $({});
};


AjaxRPC.prototype = {
    constructor: AjaxRPC,

    abortAll: function(){
        this.m_abort = true;
        // this.m_ajax.abort();
    },

    resumeAll: function(){
        this.m_abort = false;
    },

    getData : function(i_data, i_url, i_callback, i_type, i_context){
        var self = this;
        if (self.m_abort)
            return;

        self.m_ajax = self.ajaxQueue({
            url: i_url,
            data: i_data,
            context: i_context,
            cache: false,
            timeout: self.m_timeout
        }, i_callback, i_type)
    },

    ajaxQueue: function( i_ajaxOpts, i_callBack, i_type) {

        var self = this;
        self.ajaxOpts = i_ajaxOpts;
        var jqXHR,
            dfd = $.Deferred(),
            promise = dfd.promise();

        function doRequest( next ) {
            jqXHR = $.ajax( i_ajaxOpts );
            jqXHR.done( dfd.resolve ).fail( dfd.reject ).then( next, next);
        }

        dfd.always(function(i_data){
            if (self.m_abort)
                return;

            if (!self.checkReplyStatus(jqXHR.status))
                return;

            switch (i_type){
                case 'xml': {
                    i_callBack({
                        textStatus: jqXHR.statusText,
                        status: jqXHR.status,
                        context: this,
                        response: $.parseXML(i_data)
                        // response: StringtoXML(i_data)

                    });
                    break;
                }
                case 'json': {

                    var jData;

                    try {
                        jData = eval("(" + i_data + ")");
                    } catch (e) {
                        if ( $().toastmessage!=null ){
                            $().toastmessage('showToast', {
                                text     : 'Sorry there was a problem loading server data<br/> you may try again...',
                                sticky   : false,
                                position : 'middle-center',
                                type     : 'error'
                            });
                        } else {
                            commBroker.fire('ALERT_MSG',this,null,'problem loading server data');
                        }
                        commBroker.fire(self.AJAXERROR);

                        return;
                    }

                    i_callBack({
                        textStatus: jqXHR.statusText,
                        status: jqXHR.status,
                        context: this,
                        responce: jData
                    });
                    break;
                }

                default: {
                    i_callBack({
                        textStatus: jqXHR.statusText,
                        status: jqXHR.status,
                        context: this,
                        response: i_data
                    });
                }
            }
        });

        //dfd.done(...
        //dfd.fail(...

        // queue our ajax request
        // log('adding to queue ' + self.getQueueSize() );

        self.m_queue.queue( doRequest );

        // add the abort method
        promise.abort = function( statusText ) {
            var self = this.self;
            // console.log('aborted');
            // proxy abort to the jqXHR if it is active
            if ( jqXHR ) {
                return jqXHR.abort( statusText );
            }

            // if there wasn't already a jqXHR we need to remove from queue
            var queue = self.m_queue.queue(),
                index = $.inArray( doRequest, queue );

            if ( index > -1 ) {
                queue.splice( index, 1 );
            }

            // and then reject the deferred
            dfd.rejectWith( self.ajaxOpts.context || self.ajaxOpts, [ promise, statusText, "" ] );
            return promise;
        };

        return promise;
    },

    getQueueSize: function(){
        var self = this;
        var a = self.m_queue[0];
        for (var b in a){
            var c = a[b];
            return c['fxqueue'].length;
        }
        return 0;
    },

    checkReplyStatus: function(status){

        var msg = '';
        switch (String(status)){
            case '200': {return true; break}
            case '0':   {msg="server reply timed out, please try again soon"; break}
            case '408': {msg="server reply timed out, please try again soon"; break}
            case '400': {msg="bad request to server, please try again soon"; break}
            case '404': {msg="file missing on server, please try again soon"; break}
            default:    {msg="problem with server, please try again soon"; break;}

        }
        // todo: add support for mobile
        $().toastmessage('showToast', {
            text     : msg,
            sticky   : false,
            position : 'middle-center',
            type     : 'warning'
        });

        commBroker.fire(this.AJAXERROR, this);

        return false;
    }

};





/*/////////////////////////////////////////////

 AjaxJsonGetter

 Args:
 getData:
 var data = {
 '@functionName':'f_getCustomerInfo',
 '@key': commBroker.getValue('key'),
 '#text':'null'
 } i_callBack: function

 /////////////////////////////////////////////*/


function AjaxJsonGetter(i_url) {
    this.m_url = i_url;
};


AjaxJsonGetter.prototype = {
    constructor: AjaxJsonGetter,

    getData: function (i_obj, i_callBack, i_context){

        for (v in i_obj){
            i_obj[v] = cleanChar(i_obj[v]);
        }

        var ajax = commBroker.getService('ajax');

        var key = commBroker.getValue('key');
        if (!key)
            key ='';

        var jData = {
            'dynaWebsApplication':{
                '@version': '1.0',
                '@method': "reply",
                'authenticate':{
                    '@domainName':'hobbycom',
                    '@key': key,
                    '#text':''
                },
                'xmlFunction':i_obj
            }
        }

        var xData = json2xml(jData,'\n\t');

        ajax.getData(
            {data: xData},
            this.m_url,
            i_callBack,
            'json',
            i_context
        );
    },

    abortAll: function(){
    }

};



/*/////////////////////////////////////////////

 ComBrokder

 var com = new ComBroker();
 com.setService('me',function(i_var){
 alert('I am a service ' + i_var)});
 var g = com.getService('me');
 g("hello again");
 $(com).bind('change',function(e){
 alert('pop ' +e);
 });
 $(com).triggerHandler('change');

 example: commBroker.fire(loginManager.LOGINBUTTON, this, '#loginButton', "hellow world" );
 example: commBroker.listen(loginManager.AUTHENITCATING,loginManager.LOGINBUTTON,function(e){});

 /////////////////////////////////////////////*/

function ComBroker(){
    this.m_services = [];
};

ComBroker.prototype = {
    constructor: ComBroker,

    setValue: function(i_name, i_value, i_fireEvent){
        this.m_services[i_name] = i_value;
        if(i_fireEvent)
            this.fire(i_name,this,null,{edata: i_value})
    },

    getValue: function(i_name){
        if (this.m_services[i_name]){
            return this.m_services[i_name]
        } else {
            return undefined;
        }
    },

    setService: function(i_name, i_service){
        this.m_services[i_name] = i_service;

    },

    getService: function(i_name){
        if (this.m_services[i_name]){
            return this.m_services[i_name]
        } else {
            return undefined;
        }
    },

    getAllServices: function(){
        return this.m_services;
    },


    fire: function(i_event, i_context, i_caller, i_data){
        $(this).trigger(this.event(i_event, i_context, i_caller, i_data));
    },

    listen: function(events, func){
        if (arguments.length>2){
            var totalArgs = Number([arguments.length-1]);
            var events = $(arguments).splice(0,totalArgs);
            var func = arguments[totalArgs]

            for (var i=0;i<events.length;i++){
                events[i] = "'" + events[i] + "'";
            }
            events = events.join(',');
            $(this).bind(eval(events), func);

        } else {

            $(this).bind(events, func);
        }

    },

    listenOnce: function(events, func){
        $(this).one(events, func);
    },

    stopListen: function(events, func){
        $(this).unbind(events, func);
    },

    event: function (i_event, i_context, i_caller, i_data){
        return $.Event(i_event, {context: i_context, caller: i_caller, edata: i_data});
    }


};

/*/////////////////////////////////////////////

 OrderProgress

 /////////////////////////////////////////////*/

function OrderProgress (i_progressImage, i_steps){

    this.self               = this;
    this.PROGRESS_DIV       = 'PROGRESS_DIV';
    this.m_progressDiv      = null;
    this.m_tags_added       = false;
    this.m_progressImage    = i_progressImage;
    this.m_steps            = i_steps;

    this._registerEvents();


};


OrderProgress.prototype = {
    constructor: OrderProgress,

    // private
    _registerEvents: function(){
        var x = 1;
        var self = this;
        commBroker.listen(self.PROGRESS_DIV,function(e){
            self.m_progressDiv = e.context;
            self._createProgressBar();
        });
    },

    _createProgressBar: function(){
        var self = this;
        var progressBarImgs = '';
        var c = 0;
        for (var step in self.m_steps){
            c++;
            var pos = c * -16 + 'px';
            progressBarImgs += '<img name="'+self.m_steps[c-1]+'"' + ' style="opacity: 0.2; position: relative; left:' + pos  + '" src="'+self.m_progressImage+'"/>';
        }
        $(self.m_progressDiv).append(progressBarImgs);
    },

    updateProgress: function(i_statusText){
        var self    = this;
        var c1      = 0;
        var c2      = 0;

        var progressTags = '<div style="opacity: 1; position: relative; top: -28px; left: 10px">';

        // only run the first time so we can grab width  / position of images and lay over them text tags
        if (!self.m_tags_added){
            $(self.m_progressDiv).children().each(function(){
                if ($(this).is('img')) {
                    if (this.width==0)
                        return;

                    self.m_tags_added=true;
                    for (var tag in self.m_steps){
                        if (c1==c2){
                            var pos = c2 * -16 + 'px';
                            var progressTag = '<div style="opacity: 1; min-width: ' + this.width + 'px; float: left; position: relative; left: ' + pos + '">';
                            progressTag += (typeof self.m_steps[tag] == "string") ? self.m_steps[tag] : self.m_steps[tag][0];
                            progressTag += '</div>';
                            progressTags += progressTag;
                        }
                        c2++
                    }
                    c1++;
                    c2=0;
                }
            });
            $(self.m_progressDiv).append(progressTags);
        }


        $('img' , self.m_progressDiv).css({opacity: 0.2});
        $(self.m_progressDiv).children().each(function(){
            $(this).css({opacity: 0.7});
            var a = $(this).attr('name');
            if ($(this).attr('name') == i_statusText && $(this).is('img'))
                return false;
        });
    }
}

/*/////////////////////////////////////////////

 userInfoForm

 /////////////////////////////////////////////*/

function UserInfoForm(i_formID){

    // events
    this.COPYBILLINGINFO               = 'COPYBILLINGINFO';
    this.CUSTOMER_TEXT_FIELDS_CLASS    = 'CUSTOMER_TEXT_FIELDS_CLASS';

    this.m_formID               = i_formID;
    this._registerEvents();
};

UserInfoForm.prototype = {
    constructor: UserInfoForm,

    _registerEvents: function(){

        var self = this;

        commBroker.listen(this.COPYBILLINGINFO,function(e){
            self.copyInfoChkboxID = $(e.context);
            self.copyInfoChkboxID.change(function(){
                self.copyBillingToShipping();
            });
        });

        commBroker.listen(this.CUSTOMER_TEXT_FIELDS_CLASS,function(e){
            self.textFieldsClass = $(e.context);
        });

    },

    serialize: function(){
        var values = '';
        $(this.m_formID).find('input').each(function(){
            if (!undefined)
                values+= $(this).attr('id') + ' ' + cleanChar($(this).val()) +',';
        });
        return values;
    },

    copyFields: function(fieldMap) {
        for (var src in fieldMap) {
            // console.log(s + ' ' + );
            var dst = '#'+fieldMap[src];
            $(dst).val($('#'+src).val());

        }
    },

    clearFields: function(fieldsArray) {
        for (var i=0;i<fieldsArray.length;i++){
            $('#'+fieldsArray[i]).val('');
        }

    },

    copyBillingToShipping: function() {
        if ( this.copyInfoChkboxID[0].checked ){
            this.copyFields({
                b_company: 's_company',
                b_first_name: 's_first_name',
                b_last_name: 's_last_name',
                b_address1: 's_address1',
                b_city: 's_city',
                b_state: 's_state',
                b_zip_code: 's_zip_code',
                b_country: 's_country'
            });
        } else {
            this.clearFields(['s_company','s_first_name','s_last_name','s_address1','s_city','s_state','s_zip_code','s_country']);
        }
    },

    validate: function(i_inputID, i_inputType) {
        switch (i_inputType) {
            case 'email': {
                if (validateEmail($(i_inputID).val()) == true) {
                    return true;
                } else {
                    $(i_inputID).addClass('inputError');
                    $().toastmessage('showToast', {
                        text     : 'Please enter a correct email address',
                        sticky   : false,
                        position : 'middle-center',
                        type     : 'error'
                    });
                }

                break;
            }
        }
    },

    validateTextInputs: function(){
        var self = this;
        var pass = 1;
        $(self.textFieldsClass).each(function(){
            $(this).removeClass('inputError');
            if ( $(this).attr('required') == 'required' && $(this).val().length==0 ){
                $(this).addClass('inputError');
                pass = 0;
            }
        });

        if (pass) {
            return true;
        } else {
            $().toastmessage('showToast', {
                text     : 'Please correct all marked fields and re-submit the form',
                sticky   : false,
                position : 'middle-center',
                type     : 'error'
            });
            return false;
        }
    }
};



/*/////////////////////////////////////////////

 ShoppingCart

 /////////////////////////////////////////////*/

function ShoppingCart(i_table){

    this.self                        = this;
    this.m_table                     = i_table;
    this.m_shipInsideUS              = true;

    // events
    this.CART_REMOVE_PRODUCT         = 'CART_REMOVE_PRODUCT';
    this.CART_CHANGE_QTY             = 'CART_CHANGE_QTY';
    this.CART_TABLE_HEAD             = 'CART_TABLE_HEAD';
    this.CART_DISCOUNT               = 'CART_DISCOUNT';
    this.CART_SUBTOTAL               = 'CART_SUBTOTAL';
    this.CART_SHIP_LOCATION          = 'CART_SHIP_LOCATION';
    this.CART_TAX                    = 'CART_TAX';
    this.CART_DELIVERY_DROPDOWN      = 'CART_DELIVERY_DROPDOWN';
    this.CART_ORDER_TOTAL            = 'CART_ORDER_TOTAL';
    this.CART_SHIPPING_TOTAL         = 'CART_SHIPPING_TOTAL';

    // Taxes
    this.TAX_RATE                    = 9.750;
    this.TAXED_STATES                = ['CA'];
    this.m_taxApplicable             = false;

    // Shipping constants
    this.SHIP_METHOD_ALL            = 0;
    this.SHIP_METHOD_US             = 1;
    this.SHIP_METHOD_INTERNATIONAL  = 2;

    this.IMAGES_CART_DIR            = "https://secure.dynawebs.net/_msportal/_images/_cart/";

    this._registerEvents();


    ////////////////////////////////////
    // sample customer shipping options
    ///////////////////////////////////

    /*
    this.m_shippingTypes = {                      // this method is set from PHP or by user
        UPS:        this.SHIP_METHOD_US,                // offset 0
        USPS:       this.SHIP_METHOD_ALL,               // offset 1
        FedEx:      this.SHIP_METHOD_INTERNATIONAL,     // ...
        DHL:        this.SHIP_METHOD_INTERNATIONAL,
        PostalEx:   this.SHIP_METHOD_ALL
    };
    */


    //////////////////////////////
    // Available shipping options
    /////////////////////////////

    this.m_shippingTypes = {
        UPS:    this.SHIP_METHOD_US,
        USPS:   this.SHIP_METHOD_INTERNATIONAL
    };

    ///////////////////////////
    // Shipping table range //
    ///////////////////////////

    this.m_shippingTabel =
    {
        UPS: {
            0:      '15',
            100:    '20',
            200:    '20',
            300:    '30',
            400:    '40'
        },
        USPS: {
            0:      '35',
            101:    '35',
            102:    '30',
            301:    '30'
        }
    };
};

ShoppingCart.prototype = {
    constructor: UserInfoForm,

    _registerEvents: function(){

        var self = this;

        $(self.m_table + ' .removeProductClass').live('click',function(event){
            self._onRemoveProduct(event);
        });

        $(self.m_table + ' .productQtySelector').live('blur',function(event){
            self._onChangeQty(event);
        });


        commBroker.listen(this.CART_SHIPPING_TOTAL,function(e){
            self.cartShippingTotalID = $(e.context);
        });

        commBroker.listen(this.CART_ORDER_TOTAL,function(e){
           self.cartOrderTotalID = $(e.context);
        });

        commBroker.listen(this.CART_SHIP_LOCATION,function(e){
            self.cartLocationDropdown = e.context;
            $(self.cartLocationDropdown).live('change',function(event){
                self._onSelectLocation(event);
            });
        });

        commBroker.listen(this.CART_DELIVERY_DROPDOWN,function(e){
            self.cartDeliveryDropdown = $(e.context);
            self.cartDeliveryDropdown.live('change',function(event){
                self._onChangeDelivery();
            });
        });

        commBroker.listen(this.CART_TAX,function(e){
            self.cartTax = e.context;
        });

        commBroker.listen(this.CART_TABLE_HEAD,function(e){
            self.cartTableHeader = $(e.context)
        });

        commBroker.listen(this.CART_DISCOUNT,function(e){
            self.cartDiscountID = $(e.context)
        });

        commBroker.listen(this.CART_SUBTOTAL,function(e){
            self.cartSubTotal = $(e.context)
        });
    },

    _onChangeDelivery: function(){
        var self = this;
        self.calcOrderTotal()

        var del = $("option:selected", self.cartDeliveryDropdown).text();
        var loc = $("option:selected", self.cartLocationDropdown).val();

        if (del==undefined||del.length<2)
            return;
        if (loc==undefined||loc.length<2)
            return;

        var data = {
            '@functionName':'f_saveLocationAndDelivery',
            '@location': loc,
            '@delivery': del
        }

        var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWS-debug.php' : 'https://secure.dynawebs.net/_php/msWS.php');
        ajaxWrapper.getData(data,self._onSaveLocationAndDeliveryReply);
    },

    _onSaveLocationAndDeliveryReply: function(data){

    },

    _onSelectLocation: function(event){
        var self = this;

        // Shipping Method
        var shipLocationElement = event.target;
        self.m_shipInsideUS = $("option:selected", shipLocationElement).val() == 'INT' ? false : true;
        self.buildDeliveryMethodDropDown();

        ///////////////////////////
        // Ship to Taxed state
        ///////////////////////////

        if ($.inArray(String($(shipLocationElement).val()), self.TAXED_STATES)>-1){

            self.m_taxApplicable = true;

            var a = $(self.cartTax).parent();
            var b = $(self.cartTax).parent().children();


            $(self.cartTax).parent().children().each(function(){

                if ($.data(this, "taxes")) {
                    val = $.data(this, "taxes").value;
                    $(this).text(val);
                }
            });

            // old browsers dont animate
            if ($.browser.type=="FF"||$.browser.type=="SAFARI"){
                a.show();
                self.calcOrderTotal();
                return;
            }

            a.fadeIn().animate({height: '40px', opacity: 1}).queue(function(){
                b.animate({height: '40px', opacity: 1},200).fadeIn('fast');
            }).dequeue();

            setTimeout(function(){
                self.calcOrderTotal();
            },1000);

        } else {

        ///////////////////////////
        // Ship to none taxed state
        //////////////////////////

            self.m_taxApplicable = false;

            var a = $(self.cartTax).parent();
            var b = $(self.cartTax).parent().children();


            $(self.cartTax).parent().children().each(function(){

                if ($(this).text().length>1) {
                    $.data(this, "taxes", { 'value': $(this).text()});
                    $(this).text('');
                }
            });

            // old browsers dont animate
            if ($.browser.type=="FF"||$.browser.type=="SAFARI"){
                a.hide();
                self.calcOrderTotal();
                return;
            }


            b.animate({height: '0px', opacity: 0}).fadeOut('fast');
            a.animate({height: '0px', opacity: 0}).fadeOut('fast');

            setTimeout(function(){
                self.calcOrderTotal();
            },1000);

        }
    },

    _showPreLoader: function(element){
        var self = this;
        if (!$(element).is('tr')){
           element = $(element).closest('tr');
        }
        var button = $(' .removeProductClass',element)[0];
        $(button).hide();
        button.src = self.IMAGES_CART_DIR + '/preload2.gif';
        $(button).fadeIn();
    },

    _hidePreLoader: function(element){
        var self = this;
        if (!$(element).is('tr')){
            element = $(element).closest('tr');
        }
        var button = $(' .removeProductClass',element)[0];
        $(button).hide();
        button.src = self.IMAGES_CART_DIR + '/remProd.png';
        $(button).fadeIn();
    },

    _onChangeQty: function(event){
        var self = this;
        var element = event.currentTarget;
        self._showPreLoader(element);
        var partNumber = $.data($(element).closest('tr')[0], 'partNumber').id;
        var data = {
            '@functionName':'f_changeProductQty',
            '@partNumber': partNumber,
            '@qty': $(event.currentTarget).val()
        }
        var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWS-debug.php' : 'https://secure.dynawebs.net/_php/msWS.php');
        var o = {};
        o[0] = event;
        o[1] = self;
        ajaxWrapper.getData(data,self._onUpdateQtyProductReply,o);
    },

    _onUpdateQtyProductReply: function(data){
        var event = data.context[0];
        var self = data.context[1];

        self._hidePreLoader(event.currentTarget);

        if (data['responce']['productPriceChange']==true){
            if (data['responce']['discountApplied']==true){
                $().toastmessage('showToast', {
                    text     : 'mediaSERVER license discount applied :)',
                    sticky   : false,
                    position : 'middle-center',
                    type     : 'success'
                });
            }
            self._calcProductTotal(event, data['responce']['productPrice']);
        } else {
            self._calcProductTotal(event, null);
        }


        self.calcOrderTotal();
    },

    _onRemoveProduct: function(event){
        var self = this;
        var element = event.currentTarget;
        self._showPreLoader(element);
        var partNumber = $.data($(element).closest('tr')[0], 'partNumber').id;
        var data = {
            '@functionName':'f_removeProduct',
            '@partNumber': partNumber
        }

        var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWS-debug.php' : 'https://secure.dynawebs.net/_php/msWS.php');
        var o = {};
        o[0] = $(event.currentTarget);
        o[1] = self;
        ajaxWrapper.getData(data,self._onRemoveProductReply,o);
    },

    _onRemoveProductReply: function(data){
        var prod = data.context[0];
        var self = data.context[1];
        $(prod).closest('tr').switchClass( "trShow", "trHide", 500, "easeInOutQuad").children().fadeOut('fast', function(){
            $(this).parent().animate({height: '0px', opacity: 0}).delay(100).queue(function(){
                $(this).remove();
                self.calcOrderTotal();
            });
        });
    },

    _calcProductTotal: function(event, i_price){
        var self = this;
        var prodQtyField = $(event.currentTarget);
        var prodQty = prodQtyField.val();

        if (!parseInt(prodQty))
        {
            prodQtyField.val(1);
            prodQty=1;
        }

        var prodTotalField = prodQtyField.parent().siblings('td.productTotal');
        var prodTotal = fromDollars(prodTotalField.text());
        var prodPriceField = prodQtyField.parent().siblings('td.productPrice');
        if (i_price){
            var prodPrice = fromDollars(i_price);
        } else {
            var prodPrice = fromDollars(prodPriceField.text());
        }

        var total = prodQty*prodPrice;

        prodPriceField.text(toDollars(prodPrice));
        prodTotalField.text(toDollars(total));

        return fromDollars(total);
    },

    _calcSubTotal: function(){
        var self = this;
        var subtotal = 0;
        $(self.m_table +' .productTotal').each(function(){
            price = fromDollars($(this).text());
            subtotal += price;
        });
        self.cartSubTotal.text(toDollars(subtotal));
        return subtotal;
    },

    _calcDiscount: function(){
        var self = this;
        var totalDiscount=0;

        $(self.m_table +' .trProductsClass').each(function(){
            var qty = $('input', this).val() == '' ? 1 : $('input', this).val();
            var o = $.data(this, "discount");
            var p = $.data(this, "price");
            if (o != undefined){
                var discount = (Number(p.price) * Number(o.discount) ) / 100
                totalDiscount += discount * qty;

            }
        });

        if (totalDiscount < 1){
            self.cartDiscountID.text('$0.00');
            $(self.cartDiscountID).closest('tr').hide();
            return 0;
        } else {
            self.cartDiscountID.text('-'+toDollars(totalDiscount));
            $(self.cartDiscountID).closest('tr').show();
            return totalDiscount;
        }
    },

    _calcTax: function(value){
        var self = this;

        if (!self.m_taxApplicable)
            value = 0;

        var total = value == 0 ? '$0.00' : self.cartSubTotal.text();
        var tax = fromDollars(total) * ((self.TAX_RATE)/100);
        self.cartTax.text(toDollars(tax));
        return tax;
    },

    calcOrderTotal: function(){
        var self = this;
        var total = 0;
        total += self._calcSubTotal();
        total -= self._calcDiscount();

        // no products in cart, reset all
        if (total==0){
            self._calcTax(0);
            self._calcShippingTotal(0);
        }

        total += self._calcTax(null);
        total += self._calcShippingTotal(null);
        self.cartOrderTotalID.text(toDollars(total));
        return total;
    },

    _calcShippingTotal: function(value){
        var self = this;
        var totalUnits=0;

        $(self.m_table +' .trProductsClass').each(function(){
            var qty = $('input', this).val() == '' ? 1 : $('input', this).val();
            var o = $.data(this, "shipping");
            var c = $.data(this, "partNumber");

            // custom products shipping is always 0
            if (c != undefined && c.id == "MS-15"){
                self.cartShippingTotalID.text('$0.00');
                value = 0;
            }

            if (o != undefined){
                totalUnits += Number(o.units);
                totalUnits = totalUnits * qty;
            }
        });

        if (value == 0 || totalUnits == 0){
            self.cartShippingTotalID.text('$0.00');
            return 0;
        } else {
            var total = self._getShippingCharge(totalUnits);
            self.cartShippingTotalID.text(toDollars(total));
        }   return total;
    },

    _getShippingCharge: function(totalUnits){
        var self = this;
        var totalShipping = 0;
        var shipinngType =  $("option:selected", self.cartDeliveryDropdown).text();
        if (shipinngType.length<=0)
            return 0;

        for (var shipType in this.m_shippingTabel){
            if (shipType==shipinngType){
                for (var shipRange in this.m_shippingTabel[shipType]){
                    if (totalUnits>=shipRange){
                        totalShipping += Number(this.m_shippingTabel[shipType][shipRange]);
                    }
                }
            }
        }
        return totalShipping;
    },

    buildCartContent: function(products){
        var self = this;

        var newTR = '<tr class="trProductsClass"></tr>';
        var i=300;
        for (var product in products){
            i=i+300;
            var path = self.IMAGES_CART_DIR + products[product].name + '.png';
            if (!remoteFileExits(path)){
               path = '';
            }

            var img = '<img src="'+path+'"/>';
            var newTD =
                '<td>'+img+'</td>'+
                    '<td>'+products[product].description+'</td>'+
                    '<td class="productPrice">' + toDollars(products[product].price) + '</td>'+
                    '<td class="productQty"><input class="productQtySelector" type="text" value="'+products[product].product_count+'"/></td>'+
                    '<td class="productTotal">'+ toDollars(products[product].total)+'</td>'+
                    '<td><img src="' + self.IMAGES_CART_DIR + '/remProd.png' + '"class="removeProductClass"/></td>';

            var units       = products[product].units;
            var partNumber  = products[product].name;
            var discount    = products[product].discount;
            var price       = products[product].price;

            (function(newTD,units,discount,price,partNumber){
                $(newTR)
                    .delay(i)
                    .insertAfter(self.cartTableHeader)
                    .switchClass( "trHide", "trShow", 300, "easeInOutQuad")
                    .queue(function(){
                        $(this).append(newTD)
                            .children()
                            .hide()
                            .fadeTo(1000, 1);
                            $(this).dequeue();
                            $.data(this, "discount", { 'discount': discount});
                            $.data(this, "shipping", { 'units': units});
                            $.data(this, "partNumber", { 'id': partNumber});
                            $.data(this, "price", { 'price': price});
                        })
                    .delay(i)
                    .queue(function(){
                        self.calcOrderTotal();
                        $(this).dequeue(); //no need here since no more queue but good practise
                        });
            })(newTD,units,discount,price,partNumber);
        }
    },

    // optional arg: i_preSelect
    buildLocationDropdown: function(i_preSelect) {
        var self = this;

        var shipLocations = '<option value=NONE selected>Where to?</option>' +
                            '<option value=NONE></option>' +
                            '<option value=INT>International</option>' +
                            '<option value=AL>Alabama</option>' +
                            '<option value=AK>Alaska</option>' +
                            '<option value=AZ>Arizona</option>' +
                            '<option value=AR>Arkansas</option>' +
                            '<option value=CA>California</option>' +
                            '<option value=CO>Colorado</option>' +
                            '<option value=CT>Connecticut</option>' +
                            '<option value=DE>Delaware</option>' +
                            '<option value=DC>District of Columbia</option>' +
                            '<option value=FL>Florida</option>' +
                            '<option value=GA>Georgia</option>' +
                            '<option value=GU>Guam</option>' +
                            '<option value=HI>Hawaii</option>' +
                            '<option value=ID>Idaho</option>' +
                            '<option value=IL>Illinois</option>' +
                            '<option value=IN>Indiana</option>' +
                            '<option value=IA>Iowa</option>' +
                            '<option value=KS>Kansas</option>' +
                            '<option value=KY>Kentucky</option>' +
                            '<option value=LA>Louisiana</option>' +
                            '<option value=ME>Maine</option>' +
                            '<option value=MD>Maryland</option>' +
                            '<option value=MA>Massachusetts</option>' +
                            '<option value=MI>Michigan</option>' +
                            '<option value=MN>Minnesota</option>' +
                            '<option value=MS>Mississippi</option>' +
                            '<option value=MO>Missouri</option>' +
                            '<option value=MT>Montana</option>' +
                            '<option value=NE>Nebraska</option>' +
                            '<option value=NV>Nevada</option>' +
                            '<option value=NH>New Hampshire</option>' +
                            '<option value=NJ>New Jersey</option>' +
                            '<option value=NM>New Mexico</option>' +
                            '<option value=NY>New York</option>' +
                            '<option value=NC>North Carolina</option>' +
                            '<option value=ND>North Dakota</option>' +
                            '<option value=OH>Ohio</option>' +
                            '<option value=OK>Oklahoma</option>' +
                            '<option value=OR>Oregon</option>' +
                            '<option value=PA>Pennsylvania</option>' +
                            '<option value=PR>Puerto Rico</option>' +
                            '<option value=RI>Rhode Island</option>' +
                            '<option value=SC>South Carolina</option>' +
                            '<option value=SD>South Dakota</option>' +
                            '<option value=TN>Tennessee</option>' +
                            '<option value=TX>Texas</option>' +
                            '<option value=UT>Utah</option>' +
                            '<option value=VT>Vermont</option>' +
                            '<option value=VA>Virginia</option>' +
                            '<option value=VI>US Virgin Isles</option>' +
                            '<option value=WA>Washington</option>' +
                            '<option value=WV>West Virginia</option>' +
                            '<option value=WI>Wisconsin</option>' +
                            '<option value=WY>Wyoming</option>' +
                            '<option value=AP>Armed Forces Pacific</option>' +
                            '<option value=AE>Armed Forces Europe</option>' +
                            '<option value=AA>Armed Forces Americas</option>';

        $(shipLocations).appendTo('#shipLocation');

        if (i_preSelect!== undefined){
            $('option','#shipLocation').each(function(){
                value = $(this).val();

                if ( value == i_preSelect){

                    // check and set if international
                    self.m_shipInsideUS = value == "INT" ? false : true;

                    // check and set if in taxed state
                    if ($.inArray(String(value), self.TAXED_STATES)>-1){
                        self.m_taxApplicable = true;
                    }

                    // set selected in dropdown
                    $(this).replaceWith('<option selected value=' + $(this).val() + '>' + $(this).text() +' </option>');
                }
            });
        }
    },

    // optional arg: i_preSelect
    buildDeliveryMethodDropDown: function(i_preSelect){

        var self            = this;
        var shippingHTML    = '';
        var shipTo          = '';

        self.cartDeliveryDropdown.children().remove();

        switch(self.m_shipInsideUS){
            case true:   { shipTo = self.SHIP_METHOD_US ; break }
            case false:  { shipTo = self.SHIP_METHOD_INTERNATIONAL ; break }
        }

        for (var shippingMethod in self.m_shippingTypes){
            if (self.m_shippingTypes[shippingMethod]==self.SHIP_METHOD_ALL || self.m_shippingTypes[shippingMethod]==shipTo) {
                if (i_preSelect !== undefined && i_preSelect == shippingMethod ){
                    shippingHTML += '<option selected ' + ' value='+self.m_shippingTypes[shippingMethod]+'>'+shippingMethod+'</option>;';
                } else {
                    shippingHTML += '<option ' + ' value='+self.m_shippingTypes[shippingMethod]+'>'+shippingMethod+'</option>;';
                }
            }
        }
        $(shippingHTML).appendTo(self.cartDeliveryDropdown);


        self._onChangeDelivery()
    },

    //////////////////////////////////////////////
    //
    // cartValidation
    //      Pass: return object with key props
    //      Fail: return false;
    /////////////////////////////////////////////

    cartValidation: function(){
        var self = this;

        var subtotal            = String(self._calcSubTotal());
        var total               = String(self.calcOrderTotal());
        var totalshipping       = String(self._calcShippingTotal());
        var discount            = String(self._calcDiscount());
        var tax                 = String(self._calcTax(null));


        var del     = $("option:selected", self.cartDeliveryDropdown).text();
        var loc     = $("option:selected", self.cartLocationDropdown).val();

        if (subtotal==0 || del.length==0 || loc == "NONE" )
            return false;
        return {
            total: total,
            totalshipping: totalshipping,
            del: del,
            loc: loc,
            discount: discount,
            subtotal: subtotal,
            tax: tax
        }
    }
}

/*/////////////////////////////////////////////

 OrderServerLicenses

 /////////////////////////////////////////////*/

function OrderServerLicenses(){

    // events
    this.ORDERLICSUBMIT         = 'ORDERLICSUBMIT';
    this.SERVERUPDATEDATE       = 'SERVERUPDATEDATE';
    this.SERVERUPDPRICE         = 'SERVERUPDPRICE';

    this.waitingOnUserInfoSave  = false;
    this.registerEvents();
};

OrderServerLicenses.prototype = {
    constructor: UserInfoForm,

    registerEvents: function(){

        var self = this;

        commBroker.listen(this.ORDERLICSUBMIT,function(e){
            self.orderLicSubmit = $(e.context);
            self.orderLicSubmit.click(function(){
                self.onOrderLicesnes();
            });
        });

        commBroker.listen(globs.SAVEDUSERINFO,function(e){
            self.onSavedUserInfo(e);
        });

        commBroker.listen(this.SERVERUPDATEDATE,function(e){
            self.serverDateUpdID = $(e.context);
        });

        commBroker.listen(this.SERVERUPDPRICE,function(e){
            self.serverUpdatePriceID = $(e.context);
        });
    },

    onOrderLicesnes: function() {

        var self = this;

        var ccComponent = commBroker.getService('CCComponent');

        if (!ccComponent.m_validCard) {
            $().toastmessage('showToast', {
                text     : 'credit card info is invalid, please fix and try again',
                sticky   : false,
                position : 'middle-center',
                type     : 'warning'
            });
            return;
        }
        if (confirm('Proceed with the order?')) {
            self.waitingOnUserInfoSave = true;
            commBroker.fire(globs.SAVEUSERINFO);
        }
    },

    onSavedUserInfo: function(e) {

        var self = this;

        if (self.waitingOnUserInfoSave==false)
            return;

        self.waitingOnUserInfoSave = false;

        commBroker.fire(globs.WAITSCREENON);

        var obj = {
            '@functionName':'f_orderServerUpdates',
            '@total': self.serverUpdatePriceID.text()
        }

        var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php' : 'https://secure.dynawebs.net/_php/msWSsec.php');
        ajaxWrapper.getData(obj,onServerChargeReply);

        function onServerChargeReply(data){
            if ( String(data.responce.status).indexOf('SUCCESS')>-1){
                $().toastmessage('showToast', {
                    text     : 'Payment charged!',
                    sticky   : false,
                    position : 'middle-center',
                    type     : 'success'
                });
                self.serverDateUpdID.text(data.responce.date);
            } else {
                $().toastmessage('showToast', {
                    text     : 'there was a problem charging the card on file.<br/>'+data.responce.status,
                    sticky   : false,
                    position : 'middle-center',
                    stayTime : 8000,
                    type     : 'warning'
                });
            }
            commBroker.fire(globs.WAITSCREENOFF);
        }
    }
};




/*/////////////////////////////////////////////

 VerticalDivScroll

 /////////////////////////////////////////////*/

function  VerticalDivScroll(i_scrolledArea, i_scrollerArea){

    this.m_scrolledArea = i_scrolledArea;
    this.m_scrollerArea = i_scrollerArea;
    this.rangeInputter  = {};

    var d = new Date();
    var unique = d.getTime();
    var scrollID = 'slider'+unique;
    var scroller = '<input id="'+scrollID+'" type="range" step="0.1" mousewheel="true" vertical="true"/>';
    var scroll = $(i_scrolledArea);
    var scrollHeight = scroll[0].scrollHeight / 2;
    $(i_scrollerArea).append(scroller);
    $('#'+scrollID).attr('max',scrollHeight)
    $('#'+scrollID).attr('value',scrollHeight)

    this.rangeInputter = $(":range").rangeinput({

        onSlide: function(ev, step)  {
            scroll.css({bottom: scrollHeight-step});
            // log(step + ' ' + scrollHeight);
        },

        progress: true,
        mousewheel: true,
        max: scrollHeight,
        value: scrollHeight,
        change: function(e, i) {
            scroll.animate({bottom: scrollHeight-i}, "fast");
            // log(i + ' ' + scroll[0].scrollHeight);
        },
        speed: 0
    });

    this.rangeInputter=this.rangeInputter[0];
    this.initWheel();


};

VerticalDivScroll.prototype = {
    constructor:  VerticalDivScroll,

    initWheel: function() {

        var self = this;

        try {
            window.onmousewheel=document.onmousewheel=self.wheel;
        } catch (e) {
            return;
        }

        $(self.m_scrolledArea).mouseover(function(e){
            window.onmousewheel=document.onmousewheel=self.wheel;
        });

        $(self.m_scrolledArea).mouseout(function(e){
            window.onmousewheel=document.onmousewheel=null;
        });

        function wheel(event)
        {
            event.preventDefault();
            event.returnValue=false;
        }

        $(self.m_scrolledArea).mousewheel(function(event, delta) {


            var n = event['originalEvent']['wheelDelta'];
            var o = $(self.m_scrolledArea);
            if (n>0){
                self.rangeInputter.stepUp(300);
            } else {
                self.rangeInputter.stepDown(300);
            }
            // log(event['originalEvent']['wheelDelta'])
            return false;
        });

        if(window.addEventListener){
            // window.addEventListener('DOMMouseScroll',wheel,false);
        }
    }


}

/*/////////////////////////////////////////////

 validateEmail

 /////////////////////////////////////////////*/

function validateEmail(emailAddress){
    var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/i);
    var valid = emailRegex.test(emailAddress);
    if (!valid) {
        return false;
    } else {
        return true;
    }
}


/*/////////////////////////////////////////////

 log

 /////////////////////////////////////////////*/

function log(msg){
    if (!$.browser == undefined && $.browser.msie && $.browser.version <= 8){
        if (globs['debug']){
            console = {};
            console.log = function(m){alert(m)};
        } else {
            console = {};
            console.log = function(){};
        }
    }

    console.log(new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")+': '+msg);
}


/*/////////////////////////////////////////////

 initUserAgent

 /////////////////////////////////////////////*/

function initUserAgent(){

    var ua = navigator.userAgent.toLowerCase(),
        match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [],
        browser = match[1] || "",
        version =  match[2] || "0";

    $.browser = {};
    $.browser.type = '';

    if (browser) {
        $.browser[browser] = true;
        $.browser.version = version;
    }

    // Chrome is Webkit, but Webkit is also Safari.
    if (jQuery.browser.chrome) {
        jQuery.browser.webkit = true;
    } else if (jQuery.browser.webkit) {
        jQuery.browser.safari = true;
    }

    if ( !(window.mozInnerScreenX == null) ){
        $.browser.type = 'FF';
        return;
    }

    if ($.browser.msie ){
        $.browser.type = 'IE';
    }

    if( /Android/i.test(navigator.userAgent) ) {
        $.browser.type = 'ANDROID';
    }

    if( /webOS/i.test(navigator.userAgent) ) {
        $.browser.type = 'WEBOS';
    }

    if( /iPhone/i.test(navigator.userAgent) ) {
        $.browser.type = 'IPHONE';
    }

    if( /iPad/i.test(navigator.userAgent) ) {
        $.browser.type = 'IPAD';
    }

    if( /iPod/i.test(navigator.userAgent) ) {
        $.browser.type = 'IPOD';
    }

    if( /BlackBerry/i.test(navigator.userAgent) ) {
        $.browser.type = 'BLACKBARRY';
    }

    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1 ){
        $.browser.type = 'SAFARI';
        return;
    }
}


/*/////////////////////////////////////////////

 cleanChar

 /////////////////////////////////////////////*/

function cleanChar (value){
    if (value==null)
        value='';
    if ($.isNumeric(value))
        return value;
    value = value.replace(/,/g, ' ');
    value = value.replace(/\\}/g, ' ');
    value = value.replace(/{/g, ' ');
    value = value.replace(/"/g, ' ');
    value = value.replace(/'/g, ' ');
    value = value.replace(/&/g, 'and');
    value = value.replace(/>/g, ' ');
    value = value.replace(/</g, ' ');
    value = value.replace(/\[/g, ' ');
    value = value.replace(/]/g, ' ');
    return value;
}

/*/////////////////////////////////////////////

 getComment

 /////////////////////////////////////////////*/

function getComment(str){
    var content = jQuery('body').html();
    var search = '<!-- '+str+'.*?-->';
    var re = new RegExp(search, 'g');
    var data = content.match(re);
    var myRegexp = /<!-- (.*?) -->/g;
    var match = myRegexp.exec(data);
    if (match==null){
        return undefined
    } else {
        return match[1];
    }
}

/*/////////////////////////////////////////////

 setDebugMode

 /////////////////////////////////////////////*/

function setDebugMode(){

    if ( $(location).attr('href').indexOf('debug')>-1 ) {
        globs['debug'] = 1;
    } else {
        globs['debug'] = 0;
    }

}

/*/////////////////////////////////////////////

 initKey

 /////////////////////////////////////////////*/

function initKey(){

    var accountKey1  = $.cookie('digitalsignage') == undefined ? undefined : $.cookie('digitalsignage').split(' ')[0];
    var accountKey2  = getComment('ACCOUNT_KEY');

    if (accountKey1!==undefined){
        commBroker.setValue('key',accountKey1);
    } else if (accountKey2!==undefined){
        commBroker.setValue('key',accountKey2.split(':')[1]);
    } else {
        commBroker.setValue('key',undefined);
    }
    return commBroker.getValue('key');

}

/*/////////////////////////////////////////////

 xml2json

    http://goessner.net/download/prj/jsonxml/

 /////////////////////////////////////////////*/

function xml2json(xml, tab) {
    var X = {
        toObj: function(xml) {
            var o = {};
            if (xml.nodeType==1) {   // element node ..
                if (xml.attributes.length)   // element with attributes  ..
                    for (var i=0; i<xml.attributes.length; i++)
                        o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
                if (xml.firstChild) { // element has child nodes ..
                    var textChild=0, cdataChild=0, hasElementChild=false;
                    for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType==1) hasElementChild = true;
                        else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                        else if (n.nodeType==4) cdataChild++; // cdata section node
                    }
                    if (hasElementChild) {
                        if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                            X.removeWhite(xml);
                            for (var n=xml.firstChild; n; n=n.nextSibling) {
                                if (n.nodeType == 3)  // text node
                                    o["#text"] = X.escape(n.nodeValue);
                                else if (n.nodeType == 4)  // cdata node
                                    o["#cdata"] = X.escape(n.nodeValue);
                                else if (o[n.nodeName]) {  // multiple occurence of element ..
                                    if (o[n.nodeName] instanceof Array)
                                        o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                    else
                                        o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                }
                                else  // first occurence of element..
                                    o[n.nodeName] = X.toObj(n);
                            }
                        }
                        else { // mixed content
                            if (!xml.attributes.length)
                                o = X.escape(X.innerXml(xml));
                            else
                                o["#text"] = X.escape(X.innerXml(xml));
                        }
                    }
                    else if (textChild) { // pure text
                        if (!xml.attributes.length)
                            o = X.escape(X.innerXml(xml));
                        else
                            o["#text"] = X.escape(X.innerXml(xml));
                    }
                    else if (cdataChild) { // cdata
                        if (cdataChild > 1)
                            o = X.escape(X.innerXml(xml));
                        else
                            for (var n=xml.firstChild; n; n=n.nextSibling)
                                o["#cdata"] = X.escape(n.nodeValue);
                    }
                }
                if (!xml.attributes.length && !xml.firstChild) o = null;
            }
            else if (xml.nodeType==9) { // document.node
                o = X.toObj(xml.documentElement);
            }
            else
                alert("unhandled node type: " + xml.nodeType);
            return o;
        },
        toJson: function(o, name, ind) {
            var json = name ? ("\""+name+"\"") : "";
            if (o instanceof Array) {
                for (var i=0,n=o.length; i<n; i++)
                    o[i] = X.toJson(o[i], "", ind+"\t");
                json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
            }
            else if (o == null)
                json += (name&&":") + "null";
            else if (typeof(o) == "object") {
                var arr = [];
                for (var m in o)
                    arr[arr.length] = X.toJson(o[m], m, ind+"\t");
                json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
            }
            else if (typeof(o) == "string")
                json += (name&&":") + "\"" + o.toString() + "\"";
            else
                json += (name&&":") + o.toString();
            return json;
        },
        innerXml: function(node) {
            var s = ""
            if ("innerHTML" in node)
                s = node.innerHTML;
            else {
                var asXml = function(n) {
                    var s = "";
                    if (n.nodeType == 1) {
                        s += "<" + n.nodeName;
                        for (var i=0; i<n.attributes.length;i++)
                            s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                        if (n.firstChild) {
                            s += ">";
                            for (var c=n.firstChild; c; c=c.nextSibling)
                                s += asXml(c);
                            s += "</"+n.nodeName+">";
                        }
                        else
                            s += "/>";
                    }
                    else if (n.nodeType == 3)
                        s += n.nodeValue;
                    else if (n.nodeType == 4)
                        s += "<![CDATA[" + n.nodeValue + "]]>";
                    return s;
                };
                for (var c=node.firstChild; c; c=c.nextSibling)
                    s += asXml(c);
            }
            return s;
        },
        escape: function(txt) {
            return txt.replace(/[\\]/g, "\\\\")
                .replace(/[\"]/g, '\\"')
                .replace(/[\n]/g, '\\n')
                .replace(/[\r]/g, '\\r');
        },
        removeWhite: function(e) {
            e.normalize();
            for (var n = e.firstChild; n; ) {
                if (n.nodeType == 3) {  // text node
                    if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                        var nxt = n.nextSibling;
                        e.removeChild(n);
                        n = nxt;
                    }
                    else
                        n = n.nextSibling;
                }
                else if (n.nodeType == 1) {  // element node
                    X.removeWhite(n);
                    n = n.nextSibling;
                }
                else                      // any other node
                    n = n.nextSibling;
            }
            return e;
        }
    };
    if (xml.nodeType == 9) // document node
        xml = xml.documentElement;
    var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
    return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}


/*/////////////////////////////////////////////

 json2xml

 /////////////////////////////////////////////*/

function json2xml(o, tab) {
    var toXml = function(v, name, ind) {
        var xml = "";
        if (v instanceof Array) {
            for (var i=0, n=v.length; i<n; i++)
                xml += ind + toXml(v[i], name, ind+"\t") + "\n";
        }
        else if (typeof(v) == "object") {
            var hasChild = false;
            xml += ind + "<" + name;
            for (var m in v) {
                if (m.charAt(0) == "@")
                    xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                else
                    hasChild = true;
            }
            xml += hasChild ? ">" : "/>";
            if (hasChild) {
                for (var m in v) {
                    if (m == "#text")
                        xml += v[m];
                    else if (m == "#cdata")
                        xml += "<![CDATA[" + v[m] + "]]>";
                    else if (m.charAt(0) != "@")
                        xml += toXml(v[m], m, ind+"\t");
                }
                xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
            }
        }
        else {
            xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
        }
        return xml;
    }, xml="";
    for (var m in o)
        xml += toXml(o[m], m, "");
    return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}

/*/////////////////////////////////////////////

 randomFBetween

 /////////////////////////////////////////////*/

function randomFBetween(from,to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
}

/*/////////////////////////////////////////////

 toDollars

    convert number to string $ type

 /////////////////////////////////////////////*/

function toDollars(value){
    if (value==undefined)
        return '$0.00';
    value = String(value);
    value = value.replace('$', '');
    value = Number(value);
    value = value.toFixed(2);
    value = '$'+value;
    return String(value);
}

/*/////////////////////////////////////////////

 fromDollars

    convert dollars to number type

 /////////////////////////////////////////////*/

function fromDollars(value){
    value = String(value);
    value = value.replace('$', '');
    value = Number(value);
    value = value.toFixed(2);
    return Number(value);
}


/*/////////////////////////////////////////////

 remoteFileExits

 /////////////////////////////////////////////*/

function remoteFileExits(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
}

/*/////////////////////////////////////////////

 getEpochTime

 /////////////////////////////////////////////*/

function getEpochTime() {
    var d = new Date();
    var n = d.getTime();
    return n;
}


function simulateOrientation(){
    $(window).bind('resize', function(event){

        if (  $(window).width() > $(window).height() ) {
            if (globs['ORIENTATION'] == 'hor')
                return;
            globs['ORIENTATION'] = 'hor';
            $('#imgVertical').removeClass('sizeByWidth').addClass('sizeByHeight');;
            $('#imgHorizontal').removeClass('sizeByWidth').addClass('sizeByHeight');;

        } else {
            if (globs['ORIENTATION'] == 'ver')
                return;
            globs['ORIENTATION'] = 'var';
            $('#imgVertical').removeClass('sizeByHeight').addClass('sizeByWidth');;
            $('#imgHorizontal').removeClass('sizeByHeight').addClass('sizeByWidth');;
        }

        if ($.event.special.orientationchange.orientation() == "portrait") {
            //Do whatever in portrait mode

        } else {
            //Do Whatever in landscape mode

        }
    });
}


/*/////////////////////////////////////////////

 MyClass

 /////////////////////////////////////////////*/

function OrientationSimulation (i_Element, i_insertOffset){

    this.MYEVENT            = 'ABC';
    this.m_myElemID         = null;
    this.m_myValue			= null;
    this.self               = this;
    this._registerEvents();
};



/*/////////////////////////////////////////////

 OrientationSimulation

 /////////////////////////////////////////////*/

function OrientationSimulation (){

    this.HORIZONTAL_MODE        = 'HORIZONTAL_MODE';
    this.VERTICAL_MODE          = 'VERTICAL_MODE';
    this.ORIENTATION_CHANGED    = 'ORIENTATION_CHANGED';

    this.self               = this;
    this.m_deviceOriention        = null;

    this._onResizeChanged();

    setTimeout(function(){
        $(this).trigger('resize');
    },300);
};


OrientationSimulation.prototype = {
    constructor: OrientationSimulation,

    _onResizeChanged: function(){

        var self = this;

        setTimeout(function(){
            $(this).trigger('resize');
        },300);

        $( window ).on("orientationchange", function( event ) {

            switch (event.orientation) {
                case 'landscape': {
                    commBroker.fire(self.HORIZONTAL_MODE);
                    log(event.orientation);
                    break;
                }
                case 'portrait': {
                    log(event.orientation);
                    commBroker.fire(self.VERTICAL_MODE);
                    break;
                }
            }
        });

        $(window).bind('resize', function(event){
             /*
            if (  $(window).width() > $(window).height() ) {
                if (self.m_deviceOriention == self.HORIZONTAL_MODE)
                    return;
                self.m_deviceOriention = self.HORIZONTAL_MODE;
                log('hhhhhhhhhhhhhhhh');
            } else {
                if (self.m_deviceOriention == self.VERTICAL_MODE)
                    return;
                self.m_deviceOriention = self.VERTICAL_MODE;
                log('vvvvvvvvvvvvvvvvvvv');

            }
                  */
            /*
            if ($.event.special.orientationchange.orientation() == "portrait") {
                //Do whatever in portrait mode

            } else {
                //Do Whatever in landscape mode
            }
            */
        });



    }
}





/*/////////////////////////////////////////////

 ExtendjQueryUItoMobile

 /////////////////////////////////////////////*/

function ExtendjQueryUItoMobile (){

    this.self               = this;
    this._init();
};


ExtendjQueryUItoMobile.prototype = {
    constructor: ExtendjQueryUItoMobile,

    _init: function(){

        var self = this;

        var proto       = $.ui.mouse.prototype;
        var _mouseInit  = proto._mouseInit;

        $.extend(proto, {
            _mouseInit: function() {
                this.element.bind("touchstart." + this.widgetName, $.proxy(this, "_touchStart"));
                _mouseInit.apply(this, arguments);
            },

            _touchStart: function(event) {
                if (event.originalEvent.targetTouches.length != 1) {
                    return false;
                }

                this.element.bind("touchmove." + this.widgetName, $.proxy(this, "_touchMove")).bind("touchend." + this.widgetName, $.proxy(this, "_touchEnd"));
                this._modifyEvent(event);
                this._mouseDown(event);
                return false;
            },

            _touchMove: function(event) {
                this._modifyEvent(event);
                this._mouseMove(event);
            },

            _touchEnd: function(event) {
                this.element.unbind("touchmove." + this.widgetName).unbind("touchend." + this.widgetName);
                this._mouseUp(event);
                $('#screenLayoutsUL').sortable('destroy');
            },

            _modifyEvent: function(event) {
                event.which = 1;
                var target = event.originalEvent.targetTouches[0];
                event.pageX = target.clientX;
                event.pageY = target.clientY;
            }

        });
    }
}

