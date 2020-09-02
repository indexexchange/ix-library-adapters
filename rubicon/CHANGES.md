# 2.1.6

- Adapter changes:  
  - schain support: reads the schain object to create a serialized obj for sending with `fastlane.json` as `rp_schain`  
  - CCPA support

# 2.1.5

- Adapter changes:
No longer defaulting the 'p_pos' param to 'btf'.  It will not be included in the bid request if it is not defined

# 2.1.4
 
- Testing file:
the test file has been added with 8 tests and 8 success (system-tester.html).
npm run debug  and reach /system-tester.html
result: 8 specs, 0 failures
 
- ESLint:
Adapter file has been cleaned and succesfuly pass:
npm run lint

- Adapter changes:
Some edit to change the rubicon key (hb_pb_ixrubicon) for reporting only.
The ad is still correctly displayed on both the safeFrame and no safeFrame slots
2 sizes have been added to the sizeToSizeIdMapping
 
# 2.1.3
 
Previous version used.

