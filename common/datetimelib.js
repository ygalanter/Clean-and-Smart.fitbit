//v1.1
var dtlib = {
  
  KEY_TIMEFORMAT: "timeformat",   
  TIMEFORMAT_24H: 0, 
  TIMEFORMAT_12H: 1,
  timeFormat: 1,                  

  KEY_DOWFORMAT: "dowformat",
  DOWFORMAT_SHORT: 0,
  DOWFORMAT_LONG: 1,
  dowFormat: 0,  
  
  // enumeration of languages for language-depending functions
  LANGUAGES: {
      SWEDISH: 0,
      ITALIAN: 1,
      ENGLISH: 2,
      DUTCH: 3,
      NORVEGIAN: 4,
      CATALAN: 5,
      MALAY: 6,
      POLISH: 7,
      HUNGARIAN: 8,   
      SPANISH: 9,
      FRENCH: 10
  },
  
  //array of arrays, each second level array per language
  monthNamesShort: [
    ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec" ],
    ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic" ],
    ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    ["jan", "feb", "maa", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec" ],  
    ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des" ],
    ["Gen", "Feb", "Mar", "Abr", "Mai", "jun", "jul", "Ago", "Set", "oct", "nov", "des" ],
    ["jan", "Feb", "Mar", "Apr", "Mei", "jun", "jul", "Ogs", "Sep", "okt", "nov", "dis" ],
    ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paž", "Lis", "Gru" ],
    ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sze", "Okt", "Nov", "Dec" ],
    ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ],
    ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc" ]    

  ],
  
  //array of arrays, each second level array per language
  dowNamesShort: [
    ["sön", "mån", "tis", "ons", "tor", "fre", "lör"],
    ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
    ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    ["zon", "maa", "din", "woe", "don", "vri", "zat"],
    ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
    ["Diu", "Dil", "Dmr", "Dmc", "Dij", "Div", "Dis"],
    ["Aha", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],  
    ["Nie", "Pon", "Wto", "Šro", "Czw", "Pią", "Sob"],
    ["Vas", "Hét", "Ked", "Sze", "Csü", "Pén", "Szo"],
    ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"]    
  ],
  
  //array of arrays, each second level array per language
  dowNamesLong: [
    ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"],
    ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"],
    ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"],
    ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
    ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
    ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"],
    ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"],  
    ["Niedziela", "Poniedziałek", "Wtorek", "Šroda", "Czwartek", "Piątek", "Sobota"],
    ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"],
    ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]      
  ],
  
  // Get short name of the month
  // language: based on enum, e.g. libname.ENGLISH
  // monthNo: month number 0-11
  getMonthNameShort: function(language, monthNo) {
    return this.monthNamesShort[language][monthNo]
  },  
  
  // Get short name of the day of he week
  // language: based on enum, e.g. libname.ENGLISH
  // monthNo: month number 0-11   
  getDowNameShort: function(language, dowNo) {
    return this.dowNamesShort[language][dowNo]
  },   
    
  // Get long name of the day of he week
  // language: based on enum, e.g. libname.ENGLISH
  // monthNo: month number 0-11     
  getDowNameLong: function(language, dowNo) {
    return this.dowNamesLong[language][dowNo]
  },     
  
  // Returns string AM/PM or 24H based user preference stored in timeFormat property.
  // hours: hours 0-23
  getAmApm: function (hours) {
    if (this.timeFormat == this.TIMEFORMAT_24H) {
      return "24H"
    } else {
      return hours >= 12 ? 'PM' : 'AM'
    }
  },  

  // Returns hours in 12H or 24H format based user preference stored in timeFormat property.
  // hours: hours 0-23 
  format1224hour: function(hours) {
    if (this.timeFormat == this.TIMEFORMAT_12H) {
      hours = hours % 12;
      hours = hours ? hours : 12;
    }
    return hours;
  },
  
  //adds preceeding 0 to single digits number
  zeroPad: function (i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

};

export default dtlib
