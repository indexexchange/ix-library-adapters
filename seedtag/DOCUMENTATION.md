# Seedtag
## General Compatibility
|Feature|  |
|---|---|
| Consent |  |
| Native Ad Support |  |
| SafeFrame Support |  |
| PMP Support | |
 
## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome |  |
| Edge |  |
| Firefox |  |
| Internet Explorer 9 |  |
| Internet Explorer 10 |  |
| Internet Explorer 11 |  |
| Safari |  |
| Mobile Chrome | |
| Mobile Safari | |
| UC Browser | |
| Samsung Internet | |
| Opera | |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | SeedtagHtb |
| Ad Server Responds in (Cents, Dollars, etc) | |
| Bid Type (Gross / Net) | |
| GAM Key (Open Market) | |
| GAM Key (Private Market) | |
| Ad Server URLs | |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | |
| Request Architecture (MRA / SRA) | |
 
## Currencies Supported
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| url | true | string | page url - Using Browser.getPageUrl() |
| publisherToken | true | string | piblisher token provided to publisher by seedtag |
| version | true | string | Header Bidding client version
| timeout | true | int | publisher timeout
| cmp | true | boolean | indicate if user has validate cmp or not
| cd | false | boolean | consent string |
| bidRequests | true | array(bidRequest) | @see bidRequest |

**bidRequest**
| Key | Required | Type | Description |
|---|---|---|---|
| sizes | true | array(array(width, height)) | ad sizes (from parcel.xSlotRef.sizes) |
| adunitId | true | int | adunit id from seedtag |
| id | true | int | bidder request id |
| transactionId | true | int | bidder transaction id |
| placement | true | string | placement type, can be banner, ... |
| supplyTypes | true | array(string) | available ble supply type, can be `banner` or `video`

### Example
```javascript
{
   "url":"https://extra.globo.com/noticias/",
   "publisherToken":"0000-0000-01",
   "cmp":true,
   "timeout":4000,
   "version":"4.15.0",
   "bidRequests":[
      {
         "id":"85875aa107f6a5",
         "transactionId":"06a671d1-610f-4eae-bda7-e8a40f620881",
         "sizes":[
            [
               320,
               50
            ]
         ],
         "supplyTypes":[
            "display"
         ],
         "adUnitId":"0000",
         "placement":"banner"
      }
   ]
}
```
 
## Bid Response Information
| Key  | Type | Description |
|---|---|---|
| bids  | array(bid) | all bids response available |
| cookieSync | string |  |

### Bid Information
| Key | Type | Description |
|---|---|---|
| bidId  | string | bid identifier, map on index.requestId |
| price | float |  |
| currency | string |  |
| content | string | the content of the ad |
| width | int |  |
| height | int |  |
| mediatype | string | Holds the mediatype, value can be display or video |
| creativeId | string | CreativeId from seedtag adserver |
| dealId | string | |
| ttl | int | adresponse TTL |

### Bid Response Example
```javascript
 {
    "bids": [
        {
            "bidId": "85875aa107f6a5",
            "price": 0.5,
            "currency": "USD",
            "content": "<img src=\"https://storage.googleapis.com/statics.seedtag.com/ssp-test/images/creatives/seedtag_320x50.jpg\"/>",
            "width": 320,
            "height": 50,
            "mediaType": "display",
            "creativeId": "4",
            "ttl": 1800
        }
    ],
    "cookieSync": ""
}
```
### Pass Example
```javascript
{
  bids: []
  cookieSync: ''
}
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| adunitId | true | string | placement id from seedtag |
| sizes | true | array(array(width, height)) | availables sizes |
| placement | true | string | placement type, can be banner |
| supplyTypes | true | array(string) | expose available type for this slot. available value can be `display` or `video` |
### Example
```javascript
{
    "sizes":[
      [
          320,
          50
      ]
    ],
    "supplyTypes":[
      "display"
    ],
    "adunitId":"0000",
    "placement":"banner",
    "publisherToken": "0000-0000-01"
}
```

## Test Configuration
The code bellow should perform an adRequest, return an adResponse, and print it in the body of the page.

When using `"publisherToken":"0000-0000-01"` Seedtag adserver should always return a valid response
```javascript
var endpoint = 'https://s.seedtag.com/c/hb/bid'
var data =  {
   "url":"https://extra.globo.com/noticias/",
   "publisherToken":"0000-0000-01",
   "cmp":true,
   "timeout":4000,
   "version":"4.15.0",
   "bidRequests":[
      {
         "id":"85875aa107f6a5",
         "transactionId":"06a671d1-610f-4eae-bda7-e8a40f620881",
         "sizes":[
            [
               320,
               50
            ]
         ],
         "supplyTypes":[
            "display"
         ],
         "adUnitId":"0000",
         "placement":"banner"
      }
   ]
}

var headers = new Headers();
headers.append("Content-Type", "text/plain");

var body = JSON.stringify(data).replace(/'/g, "\\'");

var requestOptions = {
  method: 'POST',
  headers,
  body,
  redirect: 'follow'
};

fetch(endpoint, requestOptions)
  .then(response => response.text())
  .then(adResponse => {
      console.log('adResponse', adResponse)

      var container = document.body.createrElement('div')
      container.innerHTML = adResponse.bids[0].content
  })
  .catch(error => console.log('error', error));
```