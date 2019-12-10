# Sovrn
## General Compatibility
|Feature|  |
|---|---|
| Consent | Yes |
| Native Ad Support | Yes |
| SafeFrame Support | Yes |
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
| Partner Id | SovrnHtb |
| Ad Server Responds in (Cents, Dollars, etc) | Dollars |
| Bid Type (Gross / Net) | Net |
| GAM Key (Open Market) | ix_sovrn_om |
| GAM Key (Private Market) | ix_sovrn_pmid |
| Ad Server URLs | ap.lijit.com/rtb/bid |
| Slot Mapping Style (Size / Multiple Sizes / Slot) | slot |
| Request Architecture (MRA / SRA) | SRA |
 
## Bid Request Information
### Parameters
| Key | Required | Type | Description |
|---|---|---|---|
| callback | true | String | Callback function used in the IX library |
| br | true | String | the OpenRtb bid request |
| src | true | string | the source of the bid request |
 
### Example
```javascript
{
  callback: "headertag.AppNexusNetworkHtb.adResponseCallback",
  br: "{id:..., imps: [{id:..., banner:...}, ...], site: {domain:..., page:...}}",
  src: "ix_2.2.1"
}
```
 
## Bid Response Information
### Bid Example
```javascript
headertag.AppNexusNetworkHtb.adResponseCallback({
  id: "uN6FCa3i",
  seatbid: [
    {
        bid: [
            {
                id: ...,
                cpm: ...,
                adm: ...,
                    ...
            }
            ...
        ] 
    }
  ]
});

```
### Pass Example
```javascript
headertag.SovrnHtb.adResponseCallback({"id": "uN6FCa3i"});
```
 
## Configuration Information
### Configuration Keys
| Key | Required | Type | Description |
|---|---|---|---|
| tagid | true | String | ID value of the Sovrn zone |
| sizes | false | Array of 2 element arrays | List of all corresponding ad sizes for this slot |
### Example
```javascript
{
  "tagid": "15894224",
  "sizes": [[300, 250], [300, 600], [300, 300]],
}
```
