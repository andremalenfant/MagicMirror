/* Magic Mirror Config Sample
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/getting-started/configuration.html#general
 * and https://docs.magicmirror.builders/modules/configuration.html
 */
let config = {
	address: "0.0.0.0",
	port: 8080,
	basePath: "/",
	ipWhitelist: [],
	useHttps: false, 
	httpsPrivateKey: "",
	httpsCertificate: "",
	language: "fr-am",
	locale: "fr-CA",
	logLevel: ["INFO", "LOG", "WARN", "ERROR", "DEBUG"], // Add "DEBUG" for even more logging
	timeFormat: 12,
	units: "metric",

	modules: [
		{
			module: "clock",
			position: "top_left",
			config: {
				dateFormat: "dddd",
				showTime: false,
			}
		},
		{
			module: "clock",
			position: "top_left",
			config: {
				dateFormat: "D MMMM",
				displaySeconds: false,
				showPeriod: false				
			}
		},
		{
			module: 'calendar_monthly',
			position: 'top_left',
			config: {}
		},
		{
			module: "weather",
			position: "top_right",
			config: {
				weatherProvider: "openweathermap",
				type: "current",
				showHumidity: true,
				location: "Kingsey Falls",
				locationID: "5992424",
				apiKey: "301be451126508d15f807cae152fb778"
			}
		},
		{
			module: "weather",
			position: "top_right",
			config: {
				weatherProvider: "openweathermap",
				type: "forecast",
				location: "Kingsey Falls",
				locationID: "5992424",
				apiKey: "301be451126508d15f807cae152fb778",
				fade: false,
				// showPrecipitationAmount: true,
				appendLocationNameToHeader: false,
				roundTemp: true,
			}
		},
		{
			module: "MMM-Garbage",
			position: "top_right",
			config: {
			}
		},
		/*
		{
			module: 'MMM-FlickrBackground',
			position: 'fullscreen_below',
			config: {
				id: '51297360@N07',
				animationSpeed: 2500,
				updateInterval: 1000*60*60,
				size: 'b'
			}
		},
		*/
		
		{
			module: "MMM-Wallpaper",
			position: "fullscreen_below",
			config: { // See "Configuration options" for more information.
			  source: "local:/home/pi/Pictures",
			  slideInterval: 60 * 1000, // Change slides every minute
			  caption: false
			}
		},		
		
		{
			module: 'MMM-CalendarExt2',
			config: {
			  calendars : [
				{
					name: "shared",
					url: "webcal://p53-caldav.icloud.com/published/2/MTE1NTYxNDUyMTExNTU2MeP5OoiOmjzjRoJWG0dyc2Hf7-KkTS2pekPb7kEJzMu4XeaFbiYZObQ3WP1S6KPew95WeYEcNj0kRX7FPBkl63I",
					scanInterval: 1000*60*15,
				},
				{
					name: "traiteur",
					url: "webcal://p23-caldav.icloud.com/published/2/MTYyOTE2ODE2MjE2MjkxNiUB8Y3x-Dz7uzIAIbb2BEdCnUGp-XRIfBlyDGXSvZVl_8GFNXP8mFU_fh14SnJeX3OpCnoibDb-RgZGs2xdC2g",
					scanInterval: 1000*60*15,
				},
				{
					name: "fete",
					url: "webcal://p23-caldav.icloud.com/published/2/MTYyOTE2ODE2MjE2MjkxNiUB8Y3x-Dz7uzIAIbb2BEcY1pGey58WN-DQ-CMgIbpr5rPRB26KUXXY09RTQWgBZ_OTm0Tte9gDbG7DxMAhOU4",
					scanInterval: 1000*60*15,
				},
				{
					name: "quebec",
					url: "https://www.officeholidays.com/ics/canada/quebec",
					scanInterval: 1000*60*15,
				},
/*				{
					name: "kingsey",
					url: "https://calendar.google.com/calendar/ical/villedekingseyfalls%40gmail.com/public/basic.ics",
					scanInterval: 1000*60*15,
					maxIterations: 10000,
					replaceTitle:[
						["Collecte récupération", "Récupération"],
						["Collecte compost", "Compost"]
					  ],
					
				},*/
				{
					name: "kingsey",
					url: "https://www.kingseyfalls.ca/fr/calendrier/calendrier-iframe/",
					isKingsey: true,
					scanInterval: 1000*60*15,
					maxIterations: 10000,
					replaceTitle:[
						["Collecte déchets", "Déchets"]
					  ],
				},		
/*
				{
					name: "poubelles",
					url: "webcal://www.kingseyfalls.ca/index.php?option=com_dpcalendar&task=ical.download&id=g-6",
					scanInterval: 1000*60*15,
					maxIterations: 10000,
					replaceTitle:[
						["Collecte déchets", "Déchets"]
					  ],
				},		
*/				
			  ],
			  views: [
				{
					name: "today",
					mode: "daily",
					type: "row",
					position: "middle_center",
					slotCount: 1,
					slotTitle: "",
					slotSubTitleFormat: "",
					slotTitleFormat: "dddd D",
					locale: "fr",
					hideOverflow: false,
					filterPassedEvent: true,
					calendars: ["shared","traiteur","fete","quebec","kingsey"],
					className: "daily-calendar",
					filter: (event) => {
						return !(["Déchets", "Compost", "Recyclage"].includes(event.title) && new Date().getHours() >= 12);
					  },
				},
				{
					name: "Shared",
					mode: "daily",
					type: "row",
					position: "lower_third",
					slotCount: 7,
					slotTitle: "",
					slotSubTitleFormat: "",
					slotTitleFormat: "dddd D",
					locale: "fr",
					hideOverflow: false,
					filterPassedEvent: false,
					calendars: ["shared","traiteur","fete","quebec","kingsey"],
					fromNow: () => {
						return 1 - new Date().getDay();
					},
					className: "week-calendar",
				},
			  ],
			  scenes: [
				{
				  name: "DEFAULT",
				},
			  ],
			},
		},
/*		{
			module: "MMM-GmailNotes",
			position: "middle_center",
			config: {
			}
		},
*/
/*		{
            module: 'MMM-GoogleKeep',
            position: "middle_center",
            header: "",
            config: {
                username: 'andre@lafuiteautourdumonde.com',
                password: '!Kingsey888',
                noteId: 'IZ65Hb-s2gQvd',
                updateInterval: 60,
                maxLines: 30,
            }
        },
*/
/*
{
			module: "MMM-wiki",
			position: "bottom",
			config: {
				updateInterval: 1000*60*30,
				language: "fr",
				characterLimit: 500,
				category: "DidYouKnow",
				badTitles: [
					"Graphical",
					"timeline",
					"List"
				],
				badContents: [
					"This article",
					"See also",
					"redirects here",
					"The following outline",
					"may refer to"
				],
			}
		},
*/
/*
		{
			module: "newsfeed",
			position: "bottom",	// This can be any of the regions. Best results in center regions.
			config: {
				showSourceTitle: false,
				showPublishDate: false,
				feeds: [
					{
						title: "ICI",
						url: "https://ici.radio-canada.ca/rss/4159",
					},
				]
			}
		},
*/		
		{
			module: 'mmm-systemtemperature',
			position: 'bottom',	// This can be any of the regions.
			classes: 'xsmall dimmed', // Add your own styling. Optional.
			config: {
				prependString: '',
			}
		},
		
		{
			module: 'MMM-Inkbird',
			position: 'bottom',	// This can be any of the regions.
			classes: 'xsmall dimmed', // Add your own styling. Optional.
			config: {
				prependString: '',
				displayData: false,
				updateInterval: 1000*30,
			}
		},

		  
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
