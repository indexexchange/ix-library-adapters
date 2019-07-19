# JustPremium
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
| Internet Explorer 9 | No |
| Internet Explorer 10 | No |
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
| Partner Id | JustPremiumHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | |
| GAM Key (Private Market) | |
| Ad Server URLs | //pre.ads.justpremium.com |
| Slot Mapping Sytle (Size / Multiple Sizes / Slot) | Multiple Sizes |
| Request Architecture (MRA / SRA) | MRA |
 
## Currencies Supported
* USD
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| identities | no | Object | Contains identity ids from different parties |
| referrer | yes | String | The page referrer |
| sw | yes | Number | The screen width |
| sh | yes | Number | The screen height |
| ww | yes | Number | The window width |
| wh | yes | Number | The window height |
| cs | yes | string | Shows whether GDPR regulations should apply to the user or not |
| json | yes | []Object | The list of ad slot config objects |
 
### Example
```javascript
https://pre.ads.justpremium.com/v/2.1/t/ie?cb=7l9ou37i
```
POST Payload
```javascript
{
  "identities": {
    "tdid": "dad13e63ecwqcdfs1",
    "lrid": "m123mdb11a34b2v51"
  },
  "sw": 1920,
  "sh": 1200,
  "ww": 1920,
  "wh": 1088,
  "referrer": "http://test.com/film/some-movie-review-11-ups-4-downs?page=5",
  "cs": "BOb2mBTOb2mBTAKANBENCF-AAAAkF7_______9______9uz_Ov_v_f__33e8__9v_l_7_-___u_-33d4-_1vf99yfm1-7ftr3tp_87ues2_Xur__59__3z3_tphPhA",
  "json": [
    {
      "rid": "18m11a3z1",
      "zid": 34364,
      "al": [
        "pu"
      ]
    },
    {
      "rid": "1f81a7b1b",
      "zid": 34364,
      "sizes": [
        [
          970,
          250
        ]
      ],
      "ex": [
        "pu"
      ]
    }
  ]
}

```
 
## Bid Response Information
### Bid Example
```javascript
 {
   "34364": [
     {
       "rid": "18m11a3z1",
       "id": 408018,
       "height": 1200,
       "width": 1920,
       "price": 5.75,
       "format": "pd",
       "adm": "<script>console.log('Test adm')</script>"
     }
   ]
 }
```
### Pass Example
```javascript
 {}
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| zoneId | yes | Number | Unique id delivered by Justpremium    |
| sizes | no | [][]Number | List of allowed sizes |
| allow | no | []String | List of allowed formats |
| exclude | no | []String | List of excluded formats |
### Example
```javascript
{
    "zoneId": 34364,
    "sizes": [[1,1]] // optional
}
// or
{
    "zoneId": 34364,
    "allow": ["pd", "pu"] // optional
}
// or
{
    "zoneId": 34364,
    "exclude": ["cf"] // optional
}
 
```
