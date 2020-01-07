# OpenX
## General Compatibility
|Feature|  |
|---|---|
| Consent | Y |
| Native Ad Support |  |
| SafeFrame Support |  |
| PMP Support | Y |
 
## Browser Compatibility
| Browser |  |
|--- |---|
| Chrome | Y |
| Edge | Y |
| Firefox | Y |
| Internet Explorer 9 |  |
| Internet Explorer 10 | Y |
| Internet Explorer 11 | Y |
| Safari | Y |
| Mobile Chrome | Y |
| Mobile Safari | Y |
| UC Browser | |
| Samsung Internet | |
| Opera | |
 
## Adapter Information
| Info | |
|---|---|
| Partner Id | OpenXHtb |
| Ad Server Responds in (Cents, Dollars, etc) | 10 cent (a.k.a. 2000 = 2 dollar) |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_ox_om |
| GAM Key (Private Market) | ix_ox_pm |
| Ad Server URLs | http(s)://valid_host_name/w/1.0/arj? |
| Slot Mapping Sytle (Size / Multiple Sizes / Slot) | Multiple Sizes |
| Request Architecture (MRA / SRA) | SRA |
 
## Currencies Supported
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| auid | Y | String | comma(,) separated ad unit ids to request for|
| aus | Y | String | pipe(|) separated sizes for each ad unit in param auid, use comma(,) for multi-size in each ad unit size |
| bc | Y | String | openx adapter version |
| be | Y | Number | 1 for bidder eligibility, 0 for other - this must be set as 1 for header bidding |
 
### Example
```javascript
http(s)://valid_host_name/w/1.0/arj?auid=54321%2C12345&aus=300x250%2C300x600%7C300x600&bc=hb_ix_2.1.2&be=1&ju=http%3A%2F%2Flocalhost%3A5837%2Fpublic%2Fdebugger%2Fadapter-debugger.html&jr=http%3A%2F%2Flocalhost%3A5837%2Fpublic%2Fdebugger%2Fadapter-debugger.html&ch=UTF-8&tz=420&res=1440x900&tws=1303x347&ifr=1&callback=window.headertag.OpenXHtb.adResponseCallbacks._Bo02nxzC&cache=1539218162700&gdpr_consent=TEST_GDPR_CONSENT_STRING&gdpr=1
```
 
## Bid Response Information
### Bid Example
```javascript
{
    ads: {
        ad: [
            {
                adunitid: 54321,
                pub_rev: '100',
                html: '<div>creative content<div>',
                creative: [
                    {
                        width: '300',
                        height: '250'
                    }
                ]
            },
            {
                adunitid: 12345,
                pub_rev: '200',
                html: '<div>creative content<div>',
                creative: [
                    {
                        width: '300',
                        height: '600'
                    }
                ]
            }
        ]
    }
}
```
### Pass Example
```javascript
{
    ads: {
        ad: []
    }
}
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| host | Y | String | OpenX delivery domain for each publisher |
| adUnitId | Y | String | the ad server ad unit identifier |
| sizes | Y | Array[] | an array of array representation of the size of the ad unit, like [width, height] |
### Example
```javascript
{
    host: '<valid host>', // The required partner-level property.
    xSlots: { // All the ad slot-level properties under the `xSlots` property.
        1: {
            adUnitId: '54321',
            sizes: [[300, 250]]
        },
        2: {
            adUnitId: '12345',
            sizes: [[300, 250], [300, 600]]
        }
    }
}
```
