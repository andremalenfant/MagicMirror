Module.register("MMM-GmailNotes",{
    defaults: {
        updateInterval: 1000*5,
    },

    start: function() {
        this.sendSocketNotification('NOTES-CONFIG', this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'NOTES') {
            this.notes = payload;
            this.updateDom();
        }
    },   
    
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";

        if (this.notes)
            wrapper.innerHTML = this.notes;

        return wrapper;
    },
    
});
