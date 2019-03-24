function OpenRtb() {

    var __bidResponse;

    /**
     * An OpenRtb 2.2 Bid Response object.
     *
     * @memberof OpenRtb
     */
    function BidResponse(bidResponse) {
        if (!(this instanceof BidResponse)) {
            return new BidResponse(bidResponse);
        }
        this.__bidResponse = bidResponse;
    }

    /* =====================================
     * Functions
     * ---------------------------------- */

    /* Utilities
     * ---------------------------------- */

    /**
     * Parses a raw bid for the relevant information.
     *
     * @private
     *
     * @param  {object} rawBid The bid to be parsed.
     * @param  {array}  bids   The array that all the parsed bids are pushed to.
     */
    BidResponse.prototype.__parseBid = function (rawBid, bids) {
        var bid = {};

        if (rawBid.hasOwnProperty('impid')) {
            bid.impid = rawBid.impid;
        }

        if (rawBid.hasOwnProperty('price')) {
            bid.price = rawBid.price;
        }

        if (rawBid.hasOwnProperty('adm')) {
            bid.adm = rawBid.adm;
        }

        if (rawBid.hasOwnProperty('ext')) {
            bid.ext = rawBid.ext;
        }

        if (rawBid.hasOwnProperty('dealid')) {
            bid.dealid = rawBid.dealid;
        }

        if (rawBid.hasOwnProperty('nurl')) {
            bid.nurl = rawBid.nurl;
        }

        if (rawBid.hasOwnProperty('nbr')) {
            bid.nbr = rawBid.nbr;
        }

        if (rawBid.hasOwnProperty('w')) {
            bid.w = rawBid.w;
        }

        if (rawBid.hasOwnProperty('h')) {
            bid.h = rawBid.h;
        }

        bids.push(bid);
    };

    /**
     * Gets all the bids.
     *
     * @return {array} An array of all the bids.
     */
    BidResponse.prototype.getBids = function () {
        var bids = [];
        var innerBids;
        var seatbid;

        if (!this.__bidResponse.hasOwnProperty('seatbid')) {
            return bids;
        }

        seatbid = this.__bidResponse.seatbid;
        for (var i = 0; i < seatbid.length; i++) {
            if (!seatbid[i].hasOwnProperty('bid')) {
                continue;
            }

            innerBids = seatbid[i].bid;
            for (var j = 0; j < innerBids.length; j++) {
                this.__parseBid(innerBids[j], bids);
            }
        }

        return bids;
    };

    /* =====================================
     * Public Interface
     * ---------------------------------- */

    return {
        /* Class Information
         * ---------------------------------- */

        //? if (DEBUG) {
        __type__: 'OpenRtb',
        //? }

        /* Functions
         * ---------------------------------- */

        BidResponse: BidResponse
    };
}

////////////////////////////////////////////////////////////////////////////////
// Exports /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = OpenRtb();