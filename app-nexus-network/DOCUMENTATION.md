# AppNexusNetwork
## General Compatibility
|Feature|  |
|---|---|
| Consent | Yes |
| Native Ad Support | No |
| SafeFrame Support | No |
| PMP Support | Yes |
 
## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | Yes |
| Edge | Yes |
| Firefox | Yes |
| Internet Explorer 9 | Yes |
| Internet Explorer 10 | Yes |
| Internet Explorer 11 | Yes |
| Safari | Yes |
| Mobile Chrome | Yes |
| Mobile Safari | Yes |
| UC Browser | Yes |
| Samsung Internet | Yes |
| Opera | Yes |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | AppNexusNetworkHtb |
| Ad Server Responds in (Cents, Dollars, etc) | hundreth of a cent |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_apnxnet_om |
| GAM Key (Private Market) | ix_apnxnet_dealid |
| Ad Server URLs | secure.adnxs.com/jpt |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | slot |
| Request Architecture (MRA / SRA) | MRA |
 
## Currencies Supported
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| callback | true | String | Callback function used in the IX library |
| callback_uid | true | String | Unique ID value used by callback function |
| gdpr | true | Number | 0 or 1 to signify if GDPR consent applies; 0 means it does not apply |
| gdpr_consent | true | String | Encoded consent string of the user |
| id | true | String | AppNexus placementID for the bid request |
| kw_keyname | false | Comma-separate list of strings | list of keyvalues for this keyname (eg "kw_music": "rock,jazz") |
| promo_sizes | true | Comma-separated list of strings | The extra sizes used for the bid request (everything after first listed size) |
| psa | true | Number | 0 or 1; signifies whether PSAs are included in the AppNexus auction |
| referrer | true | String | Referrer value of the current page |
| size | true | string | First listed size used for the bid request |
 
### Example
```javascript
{
  callback: "headertag.AppNexusNetworkHtb.adResponseCallback",
  callback_uid: "aBcDeFgH",
  gdpr: 0,
  gdpr_consent: "abc123",
  id: "123456789",
  kw_keyname: "keyvalue1,keyvalue2",
  promo_sizes: "300x600",
  psa: 0,
  referrer: "http://test.mysite.com/page",
  size: "300x250"
}
```
 
## Bid Response Information
### Bid Example
```javascript
headertag.AppNexusNetworkHtb.adResponseCallback({
  "result":{
    "cpm":20000,
    "width":300,
    "height":250,
    "creative_id":100232340,
    "media_type_id":1,
    "media_subtype_id":1,
    "ad":"http://nym1-ib.adnxs.com/ab?...",
    "is_bin_price_applicable":false
  },
  "callback_uid":"uN6FCa3i"
});

```
### Pass Example
```javascript
headertag.AppNexusNetworkHtb.adResponseCallback({
  "result":{
    "cpm":0,
    "ad":""
  },
  "callback_uid":"uN6FCa3i"
});
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| placmentId | true | String | ID value of the AppNexus placement |
| sizes | true | Array of 2 element arrays | List of all corresponding ad sizes for this slot |
| keywords | false | map of keynames and keyvalue arrays | map of keyword related data; a keyname can have mulitple keyvalues |
### Example
```javascript
{
  "placementId": "15894224",
  "sizes": [[300, 250], [300, 600], [300, 300]],
  "keywords": {
    "music": ["rock", "jazz"]
  }
}
```