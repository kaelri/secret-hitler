// PORTAL
// ======

// CLIENT
// ------

Portal = (function(){

	var data = portalInitialData.data;

	function getData( key ){

		if ( !key ) return data;

		return data[ key ];

	}

	return {
		getData: getData
	};

}());

// CALL
// ----

PortalCall = function( config ) {

	// CONFIG
	this.url          = config.url      || Portal.getData('restURL');
	this.endpoint     = config.endpoint || '';
	this.method       = config.method   || 'GET';
	this.body         = config.body     || null;
	this.format       = config.format   || 'json';
	this.callback     = config.callback || false;
	this.silent       = config.silent   || false;
	this.timeout      = config.timeout  || 300000;

	// RESULTS
	this.sent         = false;
	this.status       = null;
	this.code         = null;
	this.message      = null;
	this.data         = {};

	// RAW
	this.request      = null;
	this.response     = null;

	this.send = function() {

		var self = this;

		if ( this.sent ) return false;

		if ( !this.silent ) this.showLoading();

		// Switch method from GET to POST if body data is present.
		if ( this.method == 'GET' && this.body !== null ) {
			this.method = 'POST';
		}

		this.request = new XMLHttpRequest();
		this.request.open( this.method, this.url + this.endpoint );
		this.request.timeout = this.timeout;
		this.request.responseType = this.format;

		let body = null; // default

		switch ( this.format ) {

			case 'json':

				this.request.setRequestHeader( 'Content-Type', 'application/json' );

				// Convert body data, if any, into JSON.
				if ( this.body !== null ) body = JSON.stringify( this.body );

				break;

			default:

				body = this.body;

				break;

		}

		
		
		this.request.onreadystatechange = function() {
			self.receive();
		};

		this.request.ontimeout = function() {
			self.timeout();
		};

		this.request.send( body );

		this.sent = true;
		return      true;

	}

	// Require explicit command to re-send a call that has already been sent.
	this.resend = function() {

		this.sent = false;

		return this.send();

	}

	this.receive = function() {

		if ( this.request.readyState != 4 ) return;

		this.status   = this.request.status;
		this.message  = this.request.statusText;
		this.response = this.request.response;

		// Determine status code. Analogous on jQuery.ajax text status codes. https://api.jquery.com/jQuery.ajax/
		if ( this.format == 'json' && this.response && this.response.code ) {
			this.code = this.response.code;
		} else if ( this.status === 204 ) {
			this.code = 'nocontent';
		} else if ( this.status === 304 ) {
			this.code = 'notmodified';
		} else if ( this.status >= 200 && this.status < 300 ) {
			this.code = 'success';
		} else {
			this.code = 'error';
		}

		if ( !this.silent ) this.hideLoading();

		if ( this.callback ) this.callback( this );

	}

	this.timeout = function() {

		this.code = 'timeout';

		if ( !this.silent ) this.hideLoading();

		if ( this.callback ) this.callback( this );

	}

	this.abort = function() {

		this.request.abort();

		this.code = 'abort';

	}

	this.showLoading = function() {
		document.body.classList.add('portal-is-loading');
	}

	this.hideLoading = function() {
		document.body.classList.remove('portal-is-loading');
	}

	return this;

}
