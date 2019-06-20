function counterToHex(counter) {
  return padZero(16, counter.toString(16));
}

function padZero(length, str) {
  var zeros = new Array(length + 1).join('0');
  return (zeros + str).substr(-length);
}

function getHmac(key, text) {
  var shaObj = new jsSHA("SHA-1", "HEX");
  shaObj.setHMACKey(key, "HEX");
  shaObj.update(text);
  return shaObj.getHMAC("HEX")
}

function truncate(hmac, digits) {
  var lastByte = hmac.charAt(hmac.length - 1);
  var offset = parseInt(lastByte, 16);
  var hex = hmac.substr(offset * 2, 8);
  var value = parseInt(hex, 16) & 0x7fffffff;
  return value % 10 ** digits;
}

function HOTP(key, counter, digits = 6) {
  var hmac = getHmac(key, counterToHex(counter));
  var otp = truncate(hmac, digits);
  return padZero(digits, otp);
}

function getTOTPCounter(interval = 30, start = 0) {
  var now = Math.round(new Date().getTime() / 1000);
  var secs_left = interval - (now % interval);
  var diff = now - start;
  var intervals = Math.floor(diff / interval);
  console.log("now: " + now);
  console.log("left: " + secs_left);
  return { intervals: intervals, remaining: secs_left };
}

function TOTP(key, digits = 6, interval = 30, start = 0) {
  var result = getTOTPCounter(interval, start);
  var counter = result.intervals;
  var otp = HOTP(key, counter, digits);
  return otp;
}

var key = "3132333435363738393031323334353637383930";
console.log(TOTP(key));

