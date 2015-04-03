
/*
 /////////////////////////////////////////////

 RC4 Encryption

 /////////////////////////////////////////////
 */

function arcfour_crypt(data, key)
{
    var STATE_LENGTH = 256;
    var i, i1, i2, x, y, temp;
    var secretKey = new Array(STATE_LENGTH);
    var keyLen = key.length;
    var dataLen = data.length;
    var output = new Array(dataLen);

    i1 = 0; i2 = 0; x = 0; y = 0;
    for(i = 0; i < STATE_LENGTH; i++)
        secretKey[i] = i;


    for(i = 0; i < STATE_LENGTH; i++)
    {
        i2 = ((key.charCodeAt(i1) & 255) + secretKey[i] + i2) & 255;
        // swap
        temp = secretKey[i]; secretKey[i] = secretKey[i2]; secretKey[i2] = temp;
        i1 = (i1 + 1) % keyLen;
    }

    for(i = 0; i < dataLen ; i++)
    {
        x = (x + 1) & 255;
        y = (secretKey[x] + y) & 255;
        // swap
        temp = secretKey[x]; secretKey[x] = secretKey[y]; secretKey[y] = temp;
        // xor
        output[i] = data.charCodeAt(i) ^ secretKey[(secretKey[x] + secretKey[y]) & 255];
    }
    return arcfour_byte_string(output);
}

/* convert byte array into string */
function arcfour_byte_string(input)
{
    var output = new String();
    for(var i = 0; i < input.length; i++)
    {
        output += String.fromCharCode(input[i]);
    }
    return output;
}

/* get the hex representation of an array of bytes */
function arcfour_hex_encode(input)
{
    var hex_digits = "0123456789abcdef";
    var output = new String();
    for(var i = 0; i < input.length; i++)
    {
        output += hex_digits.charAt((input.charCodeAt(i) >>> 4) & 15);
        output += hex_digits.charAt( input.charCodeAt(i)        & 15);
    }
    return output;
}

/* decode hex string */
function arcfour_hex_decode(input)
{
    var left, right, index;
    var output = new Array(input.length/2);
    for (var i = 0; i < input.length; i += 2)
    {
        left  = input.charCodeAt(i);
        right = input.charCodeAt(i+1);
        index = i / 2;
        if (left < 97)  // left < 'a'
            output[index] = ((left - 48)      << 4);  // left - '0'
        else
            output[index] = ((left - 97 + 10) << 4);
        if (right < 97)
            output[index] += (right - 48);
        else
            output[index] += (right - 97 + 10);
    }
    return arcfour_byte_string(output);
}

/* generate a key incase we need a new one */
function genKey(form)
{
    var key = new Array();
    var i = 0;
    var n;
    while(i < 16)
    {
        n = Math.ceil(Math.random() * 255);
        key[i] = n;
        i++;
    }

    form.userkey.value = arcfour_hex_encode(arcfour_byte_string(key));
}

function doEncrypt(plaintext)
{
    if(plaintext.length > 0)
    {
        return arcfour_hex_encode(arcfour_crypt(plaintext, arcfour_hex_decode(passKey)));
    }
}

function doDecrypt(value)
{
    var ciphertext = arcfour_hex_decode(value);
    if(ciphertext.length > 0)
    {
        return arcfour_crypt(ciphertext, arcfour_hex_decode(passKey));
    }
}
