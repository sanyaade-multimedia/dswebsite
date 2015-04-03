var commBroker = new ComBroker();
var cartProducts = '';
var globs = {};

// global events
globs['WAITSCREENON'] = 'WAITSCREENON';
globs['WAITSCREENOFF'] = 'WAITSCREENOFF';
globs['SAVEUSERINFO'] = 'SAVEUSERINFO';
globs['SAVEDUSERINFO'] = 'SAVEDUSERINFO';
globs['SELECTORDER'] = 'SELECTORDER';


$(document).ready(function () {

    setDebugMode();
    if (!globs['debug'])
        loadFonts();

    initUserAgent();
    notifyBrowserMinVersion();

    var ajax = new AjaxRPC(15000);
    commBroker.setService('ajax', ajax)

    if ($(location).attr('href').indexOf('cart') > -1) {
        var pageType = 'cart';
    } else {
        var pageType = 'portal';
    }

    var key = initKey();

    $('#tabs').addClass('whiteLabled');
    $('#content').addClass('whiteLabled');
    $('#main_menu').remove();

    if ($(location).attr('href').indexOf('providerName') > -1) {
        $('#tabs').addClass('whiteLabled');
        $('#content').addClass('whiteLabled');
    } else {
        $('#tabs').addClass('notWhiteLabled');
        $('#content').addClass('notWhiteLabled');
    }

    var data = {'@functionName': 'f_accountType'}

    // moved function up due to firefox bug
    function onAccountType(data) {

        var accountType = data == null ? null : data.responce['accountType'];

        switch (pageType) {

            ///////////////////////
            // Shopping cart mode
            ///////////////////////

            case 'cart':
            {
                panelsCart(accountType);
                break;
            }

            ///////////////////////
            // Billing Portal mode
            ///////////////////////

            default:
            {
                if (accountType) {
                    panelsManagment(accountType);
                } else {
                    panelsLogin();
                }
                break;
            }
        }
    }

    if (key === undefined) {

        onAccountType(null);

    } else {

        var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php' : 'https://secure.dynawebs.net/_php/msWSsec.php');
        ajaxWrapper.getData(data, onAccountType);
        return;
    }

});


/*/////////////////////////////////////////////

 panelsLogin

 /////////////////////////////////////////////*/

function panelsLogin() {

    var viewStack = new Viewstack('#content', undefined);
    commBroker.setService('viewStack', viewStack)

    var ajax = commBroker.getService('ajax');

    viewStack.setWaitScreenPanel('#WaitPanel');
    viewStack.addChild('#LoginPanel', '');
    viewStack.addChild('#SignupPanel', '');
    viewStack.selectIndex(0);

    $("#newAccount").validate();
    $("#password").valid();

    commBroker.listen(ajax.AJAXERROR, function (e) {
        commBroker.fire(globs.WAITSCREENOFF);
    });


    var loginComponent = new LoginComponent(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWS-debug.php' : 'https://secure.dynawebs.net/_php/msWS.php');
    wireLoginComponent(loginComponent, viewStack, 1, 0);

    if ($(location).attr('href').indexOf('providerName') > -1) {
        var providerName = $(location).attr('href').split('=')[1];
        $('#userName').val(providerName);
        loginComponent.userName = providerName;
    }

    commBroker.listen(loginComponent.AUTHENTICATED, function (e) {
        loginComponent.submitFormSuccessLogin(e.edata);
    });

}


/*/////////////////////////////////////////////

 panelsManagment

 /////////////////////////////////////////////*/

function panelsManagment(accountType) {

    var key = commBroker.getValue('key');
    var ajax = commBroker.getService('ajax');
    var viewStack = new Viewstack('#content', '#tabs');

    viewStack.setWaitScreenPanel('#WaitPanel');
    commBroker.fire(globs.WAITSCREENOFF);
    commBroker.setService('viewStack', viewStack)

    commBroker.listen(ajax.AJAXERROR, function (e) {
        commBroker.fire(globs.WAITSCREENOFF);
    });

    commBroker.listen(globs.SAVEUSERINFO, function (e) {
        onSaveCustomerInfo();
    });

    var userInfoForm = new UserInfoForm('#userInfoForm');
    var ccComponent = new CCComponent();
    var orderServerLicenses = new OrderServerLicenses();

    var steps = {
        0: 'new order',
        1: 'approved',
        2: 'processing',
        3: 'shipping',
        4: 'completed'
    };

    var orderProgress = new OrderProgress('https://secure.dynawebs.net/_msportal/_images/_cart/orderprogress.png', steps);

    commBroker.setService('CCComponent', ccComponent);
    commBroker.setService('UserInfoForm', userInfoForm);
    commBroker.setService('OrderServerLicenses', orderServerLicenses);
    commBroker.setService('OrderProgress', orderProgress);

    commBroker.fire(orderProgress.PROGRESS_DIV, $('#progressDIV'));

    wireCCComponent(ccComponent);
    insertCustomerInfo(ccComponent);
    wireUserInfoForm();
    wireSaveButton(ccComponent, userInfoForm);
    appendLogout();

    ccComponent.disablePaymentTypeSelection(ccComponent.CREDITCARD);
    commBroker.listen(globs['SELECTORDER'], onOrderSelected)

    $('#printPage').click(function () {
        $('#invoiceWrapper').print();
        return false;
    });


    /*///////////
     PROVIDER
     //////////*/

    if (accountType.indexOf('PROVIDER') > -1) {

        viewStack.addChild('#Invoices', 'Orders');
        viewStack.addChild('#CustomerInfo', 'Billing info');
        viewStack.addChild('#Server', 'Private mediaSERVER');
        viewStack.selectIndex(0);
        wireOrderServerUpdates();

        /*///////////
         ENTERPRISE
         //////////*/

    } else if (accountType.indexOf('ENTERPRISE') > -1) {

        viewStack.addChild('#Invoices', 'Orders');
        viewStack.addChild('#CustomerInfo', 'Billing info');
        viewStack.selectIndex(0);

        /*///////////
         USER
         //////////*/

    } else if (accountType.indexOf('USER') > -1) {

        viewStack.addChild('#Invoices', 'Orders');
        viewStack.addChild('#CustomerInfo', 'Billing info');
        viewStack.selectIndex(0);
    }

    getAllOrders();

}


/*/////////////////////////////////////////////

 panelsCart

 /////////////////////////////////////////////*/

function panelsCart(accountType) {

    var key = commBroker.getValue('key');
    var ajax = commBroker.getService('ajax');

    var viewStack = new Viewstack('#content', '');
    commBroker.setService('viewStack', viewStack);

    var userInfoForm = new UserInfoForm('#userInfoForm');
    commBroker.setService('UserInfoForm', userInfoForm);

    var ccComponent = new CCComponent();
    commBroker.setService('CCComponent', ccComponent);

    var shoppingCart = new ShoppingCart('#cartTable');
    commBroker.setService('ShoppingCart', shoppingCart);

    var loginComponent = new LoginComponent(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWS-debug.php' : 'https://secure.dynawebs.net/_php/msWS.php');
    commBroker.setService('LoginComponent', loginComponent);

    var navigator = new Navigator('#content', 'https://secure.dynawebs.net/_msportal/_images/_cart');
    commBroker.setService('Navigator', navigator);

    viewStack.setWaitScreenPanel('#WaitPanel');
    commBroker.fire(globs.WAITSCREENOFF);

    commBroker.listen(ajax.AJAXERROR, function (e) {
        commBroker.fire(globs.WAITSCREENOFF);
    });

    commBroker.listen(globs.SAVEUSERINFO, function (e) {
        onSaveCustomerInfo();
    });

    viewStack.setWaitScreenPanel('#WaitPanel');
    viewStack.addChild('#cartPanel', '');                // index 0
    viewStack.addChild('#LoginPanel', '');               // index 1
    viewStack.addChild('#SignupPanel', '');              // index 2
    viewStack.addChild('#CustomerInfo', '');             // index 3
    viewStack.addChild('#cartCheckout', '');             // index 4
    viewStack.selectIndex(0);

    navigator.addNavigation('Cart');
    navigator.addNavigation('AccountInfo');
    navigator.addNavigation('Checkout');

    var indexMap = {
        '0': 'Cart',
        '1': 'AccountInfo',
        '2': 'AccountInfo',
        '3': 'AccountInfo',
        '4': 'Checkout'
    };

    navigator.setIndexMap(indexMap);

    $("#newAccount").validate();
    $("#password").valid();

    loginComponent.forceRememberMe();

    wireLoginComponent(loginComponent, viewStack, 2, 1);
    wireCartContinueButtons(ccComponent, userInfoForm);
    wirePlaceOrder();


    ///////////////////////////
    // authenticated user
    ///////////////////////////

    if (key) {

        afterLoginSetContinueChkout();
        wireCCComponent(ccComponent);
        insertCustomerInfo(ccComponent);
        wireUserInfoForm();
        appendLogout();

        ///////////////////////////
        // none authenticated user
        ///////////////////////////

    } else {

        // After Authentication execute
        commBroker.listen(loginComponent.AUTHENTICATED, function (e) {
            commBroker.fire(globs.WAITSCREENOFF);

            goBillingInfoPanel();

            var crumb = e.edata.responce.data;
            $.cookie('digitalsignage', crumb, { expires: 300 });
            var key = initKey();

            wireCCComponent(ccComponent);
            insertCustomerInfo(ccComponent);
            wireUserInfoForm();
            afterLoginSetContinueChkout();
            appendLogout();
            applyEnterpriseDiscount();


        });
    }

    ///////////////////////////
    // Shopping cart wiring
    ///////////////////////////

    commBroker.fire(shoppingCart.CART_TABLE_HEAD, $('#tableHeader'));
    commBroker.fire(shoppingCart.CART_DISCOUNT, $('#cartDiscount'));
    commBroker.fire(shoppingCart.CART_SUBTOTAL, $('#cartSubTotal'));
    commBroker.fire(shoppingCart.CART_SHIP_LOCATION, $('#shipLocation'));
    commBroker.fire(shoppingCart.CART_TAX, $('#cartTax'));
    commBroker.fire(shoppingCart.CART_DELIVERY_DROPDOWN, $('#deliveryDropDown'));
    commBroker.fire(shoppingCart.CART_ORDER_TOTAL, $('#orderTotal'));
    commBroker.fire(shoppingCart.CART_SHIPPING_TOTAL, $('#shippingTotal'));

    var addProducts = [];
    var i = 0;

    // cartProducts is retrieved from a php injected var
    for (product in cartProducts) {
        if (product.indexOf('product') > -1) {
            i++;

            var partNumber = cartProducts[product].split(' ')[0];
            if (partNumber.length == 0)
                continue;
            var description = cartProducts[product];
            var product = {
                partNumber: partNumber,
                description: description,
                price: cartProducts['price' + i] != undefined ? cartProducts['price' + i] : '',
                qty: 1
            }

            addProducts.push(product);
        }
    }

    var dsOrderCookie = $.cookie('dsOrder');
    if (dsOrderCookie == undefined) {
        alert('your browser does not support cookies please enable and try again or use a different browser');
        return;
    }

    var addProducts = $.base64.encode(JSON.stringify(addProducts));

    var data = {
        '@functionName': 'f_loadOrder',
        '@addProducts': addProducts
    }

    var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWS-debug.php' : 'https://secure.dynawebs.net/_php/msWS.php');
    ajaxWrapper.getData(data, onServerReply);
    function onServerReply(data) {
        $('#cartLoadingProgress').fadeOut(4000);
        shoppingCart.buildCartContent(data.responce['products']);
        shoppingCart.buildLocationDropdown(data.responce['location']);
        if (data.responce['location'].length > 0)
            shoppingCart.buildDeliveryMethodDropDown(data.responce['delivery']);

    }
}

function applyDiscountLicenses() {
    //
}

function applyEnterpriseDiscount() {

    var data = {'@functionName': 'f_accountType'}
    var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php' : 'https://secure.dynawebs.net/_php/msWSsec.php');
    ajaxWrapper.getData(data, onAccountType);

    function onAccountType(data) {
        var accountType = data == null ? null : data.responce['accountType'];
        if (accountType == 'ENTERPRISE') {
            $().toastmessage('showToast', {
                text: 'Applied Enterprise discount to your cart<br/>Reloading shopping cart with new prices...',
                sticky: false,
                position: 'middle-center',
                stayTime: 8000,
                type: 'success'
            });

            setTimeout(function () {
                var url = globs['debug'] ? 'https://secure.dynawebs.net/_php/msPortal-debug.php?cart=1' : 'https://secure.dynawebs.net/_php/msPortal.php?cart=1';
                $(location).attr('href', url);
            }, 4000);
        }
    }
}

function getAllOrders() {

    var data = {'@functionName': 'f_getOrders', '@totalOrdersToGet': 'all'}

    var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php' : 'https://secure.dynawebs.net/_php/msWSsec.php');
    ajaxWrapper.getData(data, onLoadOrders);

    function onLoadOrders(data) {

        for (var k in data.responce) {
            $('<div class="orderItem" ><a href="#">' + 'Invoice#: ' + data.responce[k]['orderID'] + '</a><br/>' +
                '<span style="color: grey; padding-left: 32px"<p>' + data.responce[k]['paymentDate'] + '</span></p>' +
                '</div>').appendTo('#ordersScrollArea');
        }

        // var vDivScroller = new VerticalDivScroll('#ordersScrollArea', '#ordersSliderDiv');
        $('.orderItem').click(function () {
            var orderID = $(this).children().filter('a').text().split(' ')[1];
            commBroker.fire(globs['SELECTORDER'], null, null, orderID);
        });
    }
}


function onOrderSelected(e) {
    commBroker.fire(globs.WAITSCREENON);

    var orderProgress = commBroker.getService('OrderProgress');
    var orderID = e.edata;
    var data = {'@functionName': 'f_getOrder', '@orderID': orderID}

    var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php' : 'https://secure.dynawebs.net/_php/msWSsec.php');
    ajaxWrapper.getData(data, onServerReply);

    function onServerReply(data) {
        commBroker.fire(globs.WAITSCREENOFF);

        $('#orderPanel').appendTo('#orderContent').show();
        $('#orderNumberID').text('Invoice# ' + data.responce['customer']['orderID']);
        $('#dateOfOrder').text('Invoice# ' + data.responce['customer']['orderID']);
        $('#dateOfOrder').text(data.responce['order']['orderDate']);
        $('#selectedOrderDiscount').text('-' + toDollars(data.responce['order']['discount']));
        $('#selectedOrderTax').text(toDollars(data.responce['order']['totalTax']));
        $('#selectedOrderShipping').text(toDollars(data.responce['order']['totalShipping']));
        $('#selectedOrderSubtotal').text(toDollars(data.responce['order']['subtotal']));
        $('#selectedOrderTotal').text(toDollars(data.responce['order']['total']));


        var tracking = data.responce['order']['tracking'];

        $('#trackingID').text('');
        if (tracking) {
            tracking = tracking.replace(/\r/gi, ' :: ');
            $('#trackingID').append('Tracking: ' + tracking);
        }

        orderProgress.updateProgress(data.responce['order']['textStatus'])

        var customerInfo = 'Shipping: ';

        for (var shipping in data.responce['customer']) {
            var value = data.responce['customer'][shipping];
            if (shipping == null)
                continue;
            var regex = new RegExp("^s_");
            if (regex.test(shipping)) {
                customerInfo = customerInfo + ' ' + value;
            }
        }

        $('#shippingID').text('').append(customerInfo);

        customerInfo = 'Billing: ';

        for (var billing in data.responce['customer']) {
            var value = data.responce['customer'][billing];
            if (value == null)
                continue;
            var regex = new RegExp("^b_");
            if (regex.test(billing)) {
                customerInfo = customerInfo + ' ' + value;
            }
        }

        $('#billingID').text('').append(customerInfo);

        $('#productsTableHeaderID').siblings().remove();
        for (var v in data.responce) {
            if (v.indexOf('product') > -1) {
                var product = data.responce[v];
                var item = '<tr>' +
                    '<td>' + product['description'] + '</td>' +
                    '<td>' + product['quantity'] + '</td>' +
                    '<td>' + toDollars(product['amount']) + '</td>' +
                    '<td>' + toDollars(product['total']) + '</td>' +
                    '</tr>';
            }
            $('#productsTableID').append(item);
        }
    }

}


function appendLogout() {
    $('<button id="msLogout" class="appButton">logout</button>').appendTo('#main_header').click(function () {
        $('#inner_wrapepr').animate({opacity: 0}, 200);
        $.removeCookie('digitalsignage', {path: '/'});
        var url = 'https://secure.dynawebs.net/_php/msPortal.php?logout=1';
        $(location).attr('href', url);
    });
}


function insertCustomerInfo(i_ccComponent) {
    var data = {'@functionName': 'f_getCustomerInfo'}

    var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php' : 'https://secure.dynawebs.net/_php/msWSsec.php');
    ajaxWrapper.getData(data, onServerReply);

    function onServerReply(data) {
        for (var v in data.responce) {
            if ($('#' + v).length > 0) {
                switch (v) {
                    case 'b_card_number':
                    {
                        $('#' + v).val(data.responce[v]);
                        i_ccComponent.validateCC();
                        break;
                    }
                    case 'server_licenses':
                    {
                        $('#server_licenses').html('<option>' + data.responce[v] + '</option>');
                        break;
                    }
                    case 'server_price':
                    {
                        $('#server_price').html(data.responce[v]);
                        break;
                    }
                    case 'server_update_date':
                    {
                        $('#server_update_date').html(data.responce[v]);
                        break;
                    }
                    case 'b_expiration_month':
                    {
                        i_ccComponent.selectMonth(data.responce[v]);
                        break;
                    }
                    case 'b_expiration_year':
                    {
                        i_ccComponent.selectYear(data.responce[v]);
                        break;
                    }
                    default:
                    {
                        $('#' + v).val(data.responce[v]);
                        break;
                    }
                }
            }
        }
    }
}

function goBillingInfoPanel() {
    var viewStack = commBroker.getService('viewStack');
    viewStack.selectIndex(3);
}

function afterLoginSetContinueChkout() {
    var viewStack = commBroker.getService('viewStack');
    var shoppingCart = commBroker.getService('ShoppingCart');

    $('#continueCheckout').unbind();
    $('#continueCheckout').click(function () {
        if (checkShoppingCartValidity() != false)
            goBillingInfoPanel();
        return false;
    })
}


function wirePlaceOrder() {

    var viewStack = commBroker.getService('viewStack');
    var shoppingCart = commBroker.getService('ShoppingCart');

    $('#placeOrder').mouseup(function () {
        var cartData = checkShoppingCartValidity();
        if (cartData == false)
            return false;

        cartData = shoppingCart.cartValidation();
        var ccComponent = commBroker.getService('CCComponent');

        var data = {
            '@functionName': 'f_placeOrder',
            '@paymentType': ccComponent.getPaymentSelected(),
            '@loc': cartData['loc'],
            '@del': cartData['del'],
            '@tax': cartData['tax'],
            '@subtotal': cartData['subtotal'],
            '@totalshipping': cartData['totalshipping'],
            '@discount': cartData['discount'],
            '@cartTotal': cartData['total']
        }

        commBroker.fire(globs.WAITSCREENON);
        var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php' : 'https://secure.dynawebs.net/_php/msWSsec.php');
        ajaxWrapper.getData(data, onServerReply);

        function onServerReply(data) {

            var status = data.responce['status']
            var paymentType = data.responce['paymentType'];
            var cartTotal = data.responce['cartTotal'];

            if (status == 'SUCCESS') {

                switch (paymentType) {
                    case 'CC':
                    {

                        ccOrderPlaced(data.responce['newOrderID'], cartTotal);
                        commBroker.fire(globs.WAITSCREENOFF);
                        break;
                    }
                    case 'PP':
                    {

                        $().toastmessage('showToast', {
                            text: 'Redirecting to Paypal...',
                            sticky: false,
                            position: 'middle-center',
                            type: 'success'
                        });

                        var url = String(data.responce['paypalRedirect']);
                        $(location).attr('href', url);
                        break;
                    }
                }

            } else {

                $().toastmessage('showToast', {
                    text: 'there was a problem charging the card on file.<br/>' + data.responce.status,
                    sticky: false,
                    position: 'middle-center',
                    stayTime: 8000,
                    type: 'warning'
                });
                commBroker.fire(globs.WAITSCREENOFF);
            }
        }

    });
}

function ccOrderPlaced(orderID, cartTotal) {

    $('#placeYourOrderTitleID').text('Thank you for your order');
    $('#finalTotal').text('your order number is: ' + orderID);
    $('<br/><p></p><h3>please wait, loading order manager</h3>').insertAfter('#finalTotal');
    $('#checkOutBackToCart').fadeOut('slow');
    $('#placeOrder').fadeOut('slow');
    setTimeout(function () {
        window.location = "https://secure.dynawebs.net/cgi_bin/msCCorderPlaced.cgi?total=" + cartTotal;
    }, 2000);
}

function checkShoppingCartValidity() {
    var shoppingCart = commBroker.getService('ShoppingCart');

    if (shoppingCart.cartValidation() == false) {
        $().toastmessage('showToast', {
            text: 'Please go back to the Shopping cart and<br/>be sure to select all fields including shipping method',
            sticky: false,
            position: 'middle-center',
            type: 'warning',
            stayTime: 7000
        });
        return false;
    }
    return true;

}

function wireCartContinueButtons(i_ccComponent, i_userInfoForm) {

    var viewStack = commBroker.getService('viewStack');
    var shoppingCart = commBroker.getService('ShoppingCart');

    var url = globs['debug'] ? 'http://www.digitalsignage.com/_html/mediaplayer.html' : 'http://www.digitalsignage.com/_html/mediaplayer.html'

    $('#continueShopping').click(function () {
        $(location).attr('href', url);
        return false;
    });
    $('#loginPageBackToCart').show();
    $('#loginPageBackToCart').mouseup(function (e) {
        viewStack.selectIndex(0);
        return false;
    });

    $('#checkOutBackToCart').mouseup(function (e) {
        viewStack.selectIndex(0);
        return false;
    });


    $('#continueCheckout').bind('click', function () {
        var shoppingCart = commBroker.getService('ShoppingCart');
        if (checkShoppingCartValidity() != false) {
            viewStack.selectIndex(1);
            return false;
        }
        ;
    });

    $('#BillShipButton1').text('< back to cart');
    $('#BillShipButton1').click(function () {
        viewStack.selectIndex(0);
        return false;
    });
    $('#BillShipButton2').text('continue chekcout >');
    $('#BillShipButton2').click(function () {

        if (!i_userInfoForm.validateTextInputs() || !i_userInfoForm.validate('#b_email', 'email')) {
            return false;
        }

        if (checkShoppingCartValidity() == false)
            return false;

        if (!i_ccComponent.isValid(true)) {
            $().toastmessage('showToast', {
                text: 'credit card info is invalid, please fix and try again',
                sticky: false,
                position: 'middle-center',
                type: 'warning'
            });
            return false;
        }

        commBroker.fire(globs.SAVEUSERINFO);
        return false;
    });

    commBroker.listen(globs.SAVEDUSERINFO, function (e) {
        var ccComponent = commBroker.getService('CCComponent');
        viewStack.selectIndex(4);
        if (ccComponent.getPaymentSelected() == 'CC') {
            $('#ppLogo').hide();
            $('#placeOrder').text('Place order >');
        } else {
            $('#ppLogo').fadeIn(1500);
            $('#placeOrder').text('Go to PayPal >');
        }

        var total = shoppingCart.calcOrderTotal();
        $('#finalTotal').text('total ' + toDollars(total));

    });
}

function wireSaveButton(i_ccComponent, i_userInfoForm) {
    $('#BillShipButton1').text('Save');
    $('#BillShipButton2').hide();
    $('#BillShipButton1').click(function () {
        if (i_userInfoForm.validateTextInputs() && i_userInfoForm.validate('#b_email', 'email')) {
            if (i_ccComponent.isValid(false)) {
                commBroker.fire(globs.SAVEUSERINFO);
                return false;
            } else {
                $().toastmessage('showToast', {
                    text: 'You must enter a valid credit card number and security code',
                    sticky: false,
                    position: 'middle-center',
                    type: 'error'
                });
                return false;
            }
        }
    });
}


function onSaveCustomerInfo() {
    var ccComponent = commBroker.getService('CCComponent');

    commBroker.fire(globs.WAITSCREENON);

    var obj = {'@functionName': 'f_saveCustomerInfo'}
    $('.userInfoFormClass').each(function () {
        var k = '@' + $(this).attr('id');
        var v = $(this).val();
        obj[k] = v;
    });

    $('#ccInfoForm input').each(function () {
        if ($(this).val().length > 1) {
            var k = '@' + $(this).attr('id');
            var v = $(this).val();
            obj[k] = v;
        }
        ;
    });

    obj['@b_card_number'] = $('#b_card_number').val().length == 0 ? null : $('#b_card_number').val();
    obj['@b_expiration_year'] = $('#b_expiration_year').val();
    obj['@b_security_code'] = $('#b_security_code').val();
    obj['@b_expiration_month'] = $('#b_expiration_month').val();
    obj['@b_card_type'] = ccComponent.getCCType();

    var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php' : 'https://secure.dynawebs.net/_php/msWSsec.php');
    ajaxWrapper.getData(obj, onServerReply);

    function onServerReply(data) {
        commBroker.fire(globs.WAITSCREENOFF);
        commBroker.fire(globs.SAVEDUSERINFO);
    }

}


/*/////////////////////////////////////////////

 Wire components section

 /////////////////////////////////////////////*/

function wireLoginComponent(i_loginComponent, i_viewstack, i_viewStockSignUpIndex, i_viewStackSignupCancelIndex) {

    $('#goToSignup').click(function (e) {
        i_viewstack.selectIndex(i_viewStockSignUpIndex);
        return false;
    });

    $('#signUpCancel').click(function (e) {
        i_viewstack.selectIndex(i_viewStackSignupCancelIndex);
        return false;
    });

    commBroker.fire(i_loginComponent.SIGNUPUSER, $('#signupName'));
    commBroker.fire(i_loginComponent.SIGNUPPASSMATCHLINE, $('#passwordMatchLine'));
    commBroker.fire(i_loginComponent.SIGNUPPASSMATCHMSG, $('#passwordMatchMessage'));
    commBroker.fire(i_loginComponent.UNIQUEUSER, $('#uniqueUser'));
    commBroker.fire(i_loginComponent.UNIQUEUSERPROGRESS, $('#uniqueUserProgress'));
    commBroker.fire(i_loginComponent.UNIQUEUSERMICROLINE, $('#uniqueUserMicroLine'));
    commBroker.fire(i_loginComponent.UNIQUEUSERMESSAGE, $('#uniqueUserMessage'));
    commBroker.fire(i_loginComponent.USERID, $('#userName'));
    commBroker.fire(i_loginComponent.USERPASSID, $('#userPass'));
    commBroker.fire(i_loginComponent.SIGNUPPASS1, $('#password'));
    commBroker.fire(i_loginComponent.SIGNUPPASS2, $('#password2'));
    commBroker.fire(i_loginComponent.SIGNUPSUBMIT, $('#signUpSubmit'));
    commBroker.fire(i_loginComponent.LOGINBUTTON, $('#loginButton'));
    commBroker.fire(i_loginComponent.REMEBERME, $('#rememberMe'));
    commBroker.fire(i_loginComponent.FORGOTPASSWORD, $('#forgotPassword'));


}

function wireCCComponent(i_ccComponent) {
    commBroker.fire(i_ccComponent.CCNUMBER, $('#b_card_number'));
    commBroker.fire(i_ccComponent.CCMONTH, $('#b_expiration_month'));
    commBroker.fire(i_ccComponent.CCYEAR, $('#b_expiration_year'));
    commBroker.fire(i_ccComponent.CCCCV, $('#b_security_code'));
    commBroker.fire(i_ccComponent.CCIMAGE, $('#creditCardImage'));
    commBroker.fire(i_ccComponent.CCIMAGESEL, $('#creditCardImageSelected'));
    commBroker.fire(i_ccComponent.CCIMAGEICON, $('#ccValidateIcon'));
    commBroker.fire(i_ccComponent.PAYMENTMETHOD, $('#paymentMethod'));

    i_ccComponent.validateCC();
    i_ccComponent.insertYears(new Date().getFullYear());
    i_ccComponent.insertMonths(1);
}


function wireOrderServerUpdates() {
    var orderServerLicenses = commBroker.getService('OrderServerLicenses');
    commBroker.fire(orderServerLicenses.ORDERLICSUBMIT, $('#orderServerUpdates'));
    commBroker.fire(orderServerLicenses.SERVERUPDATEDATE, $('#server_update_date'));
    commBroker.fire(orderServerLicenses.SERVERUPDPRICE, $('#server_price'));
}

function wireUserInfoForm() {
    var userInfoForm = commBroker.getService('UserInfoForm');
    commBroker.fire(userInfoForm.COPYBILLINGINFO, $('#copyBillingCheckbox'));
    commBroker.fire(userInfoForm.CUSTOMER_TEXT_FIELDS_CLASS, $('.userInfoFormClass'));


}

function loadFonts() {

    WebFontConfig = {
        google: {
            families: [
                'Raleway::latin',
                'Roboto+Condensed::latin'
            ] }
    };

    (function () {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    })();

}


/*/////////////////////////////////////////////

 checkBrowserVersion

 /////////////////////////////////////////////*/

function notifyBrowserMinVersion() {

    if ($.browser.msie && $.browser.version < 8) {
        alert('You are using an outdated browser version that is not supported due to many security risks :(');
        alert('Please use Google Chrome, Firefox, or Internet Explorer 9+');
        alert('Bye for now, see you soon in a newer, safer browser...');
        throw new Error('unsupported browser :(');
    }

    if ($.browser.msie && $.browser.version <= 8) {
        // alert('You are using an outdated browser version and many features will not work in this page');
        // alert('Please use Google Chrome, Firefox, or Internet Explorer 9+');
    }


}