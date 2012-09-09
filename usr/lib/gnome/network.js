Webos.Translation.load(function(t) {
	var item = $('<li></li>');
	
	var label = $('<a href="#"></a>').appendTo(item);
	
	var icon = $('<img />', { 'class': 'icon', src: new W.Icon('status/network-idle', 24, 'ubuntu-mono-dark'), title: t.get('No network activity') }).appendTo(label);
	
	var networkData = {
		total: W.ServerCall.getNbrPendingCalls(),
		pending: W.ServerCall.getNbrPendingCalls(),
		failed: 0
	};
	
	var menu = $('<ul></ul>').appendTo(item);
	var menuTotal = $('<li></li>').appendTo(menu);
	var menuPending = $('<li></li>').appendTo(menu);
	var menuFailed = $('<li></li>').appendTo(menu);
	$('<li></li>', { 'class': 'separator' }).appendTo(menu);
	$('<li>' + t.get('Reset') + '</li>').click(function() {
		networkData = {
			total: 0,
			pending: 0,
			failed: 0
		};
		refreshMenuFn();
	}).appendTo(menu);
	
	new SIndicator(item);
	
	var refreshMenuFn = function() {
		menuTotal.html(t.get('Sent queries : ${total}', { total: networkData.total }));
		menuPending.html(t.get('Queries being loaded : ${pending}', { pending: networkData.pending }));
		menuFailed.html(t.get('Failed queries : ${failed}', { failed: networkData.failed }));
	};
	
	var serverCallStart = function() {
		icon
			.attr('src', new W.Icon('status/network-transmit-receive', 24, 'ubuntu-mono-dark'))
			.attr('title', t.get('Loading, please wait...'));
	};
	W.ServerCall.bind('start', serverCallStart);
	if (W.ServerCall.getNbrPendingCalls() > 0) {
		serverCallStart();
	}
	W.ServerCall.bind('complete', function() {
		icon
			.attr('src', new W.Icon('status/network-idle', 24, 'ubuntu-mono-dark'))
			.attr('title', t.get('No network activity'));
	});
	
	W.ServerCall.bind('callstart', function() {
		networkData.total++;
		networkData.pending++;
		refreshMenuFn();
	});
	W.ServerCall.bind('callcomplete', function(data) {
		if (networkData.pending > 0) {
			networkData.pending--;
		}
		if (typeof data.call.response != 'undefined' && !data.call.response.isSuccess()) {
			networkData.failed++;
		}
		refreshMenuFn();
	});
	
	refreshMenuFn();
}, 'gnome');