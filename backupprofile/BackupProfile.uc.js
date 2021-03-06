// ==UserScript==
// @name           BackupProfile29+_JS版.uc.js
// @namespace      BackupProfile29+_JS版@github.com
// @description    备份配置按钮，更适合配置较小情况
// @charset        UTF-8
// @author         ywzhaiqi、defpt
// @version        v2014.07.26
// @note           Vorlage Script von ywzhaiqi
// @reviewURL      http://bbs.kafan.cn/thread-1758785-1-1.html
(function () {
	CustomizableUI.createWidget({
		id : "Backup-button",
		defaultArea : CustomizableUI.AREA_NAVBAR,
		label : "Profilsicherung",
		tooltiptext : "Sichern der aktuellen Konfiguration",
		onClick: function(){
			// Speicherort - Ordner festlegen - Sichern funktioniert nur wenn Speicherort- bzw. Ordner vorhanden ist!!
			var path = "E:\\Firefox";
			// var path = "";
			// Ausschlussliste
			var excludes = 'bookmarkbackups *cache* crashes fftmp *healthreport* minidumps safebrowsing *webapps* saved-telemetry-pings *thumbnails* *session* *Telemetry* *hotfix* *.sqlite-shm *.sqlite-wal *.bak parent.lock blocklist.xml *content* directoryLinks.json mimeTypes.rdf compatibility.ini parent.lock formhistory.sqlite';

			if (!path) {
				var nsIFilePicker = Ci.nsIFilePicker;
				var FP = Cc['@mozilla.org/filepicker;1'].createInstance(nsIFilePicker);
				FP.init(window, 'Sicherungspfad wählen', nsIFilePicker.modeGetFolder);

				if (FP.show() == nsIFilePicker.returnOK) {
					path = FP.file.path;
				} else {
					return false;
				}
			}

			excludes = excludes.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\s+/g, '|');
			excludes = new RegExp(excludes, 'i');

			var zw = Cc['@mozilla.org/zipwriter;1'].createInstance(Ci.nsIZipWriter);
			var pr = {PR_RDONLY: 0x01, PR_WRONLY: 0x02, PR_RDWR: 0x04, PR_CREATE_FILE: 0x08, PR_APPEND: 0x10, PR_TRUNCATE: 0x20, PR_SYNC: 0x40, PR_EXCL: 0x80};
			var fu = Cu.import('resource://gre/modules/FileUtils.jsm').FileUtils;
			var dir = fu.getFile('ProfD', []);
			var localnow = new Date().toLocaleFormat("%d%m%Y");
			var archiveName = 'Profil_' + localnow + '.zip';
			var xpi = fu.File(path + '\\' + archiveName);
			
			zw.open(xpi, pr.PR_RDWR | pr.PR_CREATE_FILE | pr.PR_TRUNCATE);
			var dirArr = [dir];
			for (var i=0; i<dirArr.length; i++) {
				var dirEntries = dirArr[i].directoryEntries;
				while (dirEntries.hasMoreElements()) {
					var entry = dirEntries.getNext().QueryInterface(Ci.nsIFile);         
					if (entry.path == xpi.path) {
						continue;
					}
		   
					if (entry.isDirectory()) {
					   dirArr.push(entry);
					}

					var relPath = entry.path.replace(dirArr[0].path, '');
					if (relPath.match(excludes)) {
						continue;
					}

					var saveInZipAs = relPath.substr(1);
					saveInZipAs = saveInZipAs.replace(/\\/g,'/'); 
					// Konfigurationsdateien können gesperrt werden
					try {
						zw.addEntryFile(saveInZipAs, Ci.nsIZipWriter.COMPRESSION_FASTEST, entry, false);
					} catch (e) {}
				}
			}
			zw.close();
			alert('Die aktuelle Konfiguration wurde gesichert auf ' + path);

			function alert(aString, aTitle) {
				Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle, aString, false, "", null);
			}
		},
	});

	var cssStr = '@-moz-document url("chrome://browser/content/browser.xul"){'
		 + '#Backup-button .toolbarbutton-icon {'
		 + 'list-style-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1%2B%2FAAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNC8xMS8wOGGVBZQAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzQGstOgAAABxklEQVQ4ja2UMUgbURjHfxeSFBzuBEuCkkAgIA5JDdzWohVnQe3UpRDE2UXpKKXdWro4ixlcdNJAydxiyHZkCIKIOEnLpZQSRFFz%2Bjqk73nvuDtb2j883nv%2F73u%2F%2B%2B69ewf%2FWUZgbgEFYDgiPw18B86An8DtQw%2BYdF1XRLVGoyGEEKJara4Bj0MKIhGYDxuGQVSTqtVqH0ql0uzvNzLigCQSicjmeZ7K63Q6u5VKZRoYigXGVWhZlpbbbrfrwKjfS4ZVGKVCoUCz2aTX65FOp6WdA04igf69CsqyLMrlctAWsRXGAf9EavXyFELEZT4A2TwYsLQKF%2BYXAJhb3VPep4%2BLzK3uqd7vS9Xr%2B2qsAW9u4eyoxcZSFoCVLZfTwxaA6v2xjaUsuYmnWrU60IOr%2FmD8etvl%2Fausikl%2FZcsFULEbD02hwPUdl7cvs1qiBAb9eOCdwdjEM2AABdh88wJA%2BbK%2FX6MDtVPmHyRPOfjRPfc87%2FPfgJLJ5AzwRc0BbNseB8a63e6TuKsXpnw%2BP5nJZAzgq%2BM4x3IPzwFM07woFovv%2Bv3%2BUDTiXqlU6tI0zQs%2FI%2FSe2bYt%2FyCPgJFA%2BAdwDeA4zrfg2l%2BwUqCoC1F3YQAAAABJRU5ErkJggg%3D%3D)'
		 + '}}';
	var sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
	var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
	sss.loadAndRegisterSheet(ios.newURI("data:text/css;base64," + btoa(cssStr), null, null), sss.USER_SHEET);
})();
