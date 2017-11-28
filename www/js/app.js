var app = {
  events: {
    // Signup
    '#signup-form submit': 'signup',

    // Login
    '#login-form submit': 'login',
    '#login-with-mic click': 'loginWithMIC',

    // Files
    '#upload-form submit': 'uploadFile',

    // Profile
    '#profile-form submit': 'saveProfile'
  },

  login: function(event) {
    // Prevent the form from being submitted
    event.preventDefault();

    // Remove the login-error
    $('#login-error').hide(0);

    // Get entered username and password values
    var username = $('#username').val();
    var password = $('#password').val();

    // Login to Kinvey
    Kinvey.User.login(username, password)
      .then(function() {
        location.replace('/');
      })
      .catch(function(error) {
        $('#login-error').html('<p>' + error.message + '</p>').show(0);
      });
    },

    loginWithMIC: function(event) {
      // Prevent the form from being submitted
      event.preventDefault();

      // Remove the login-error
      $('#login-error').hide(0);

      // Login with Mobile Identity Connect
      Kinvey.User.loginWithMIC('<micRedirectUri>')
        .then(function() {
          location.replace('/');
        })
        .catch(function(error) {
          $('#login-error').html('<p>' + error.message + '</p>').show(0);
        });
    },

    signup: function(event) {
      // Prevent the form from being submitted
      event.preventDefault();

      // Remove the signup-error
      $('#signup-error').hide(0);

      // Get entered values
      var data = {
        username: $('#username').val(),
        password: $('#password').val(),
        firstname: $('#firstname').val(),
        lastname: $('#lastname').val()
      };

      // Login to Kinvey
      Kinvey.User.signup(data)
        .then(function() {
          location.replace('/');
        })
        .catch(function(error) {
          $('#signup-error').html('<p>' + error.message + '</p>').show(0);
        });
    },

    loadBooks: function(dataStoreType) {
      // Render the table
      function renderTable(books, selector) {
        // Default books to an empty array
        books = books || [];

        // Create the rows
        var rows = books.map(function(book) {
          return '<tr>\n'
            + '<td><a href="https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=' + book.id +'">' + book.id + '</td>\n'
            + '<td>' + book.name + '</td>\n'
            + '<td>' + book.lat + '</td>\n'
            + '<td>' + book.lng + '</td>\n'
            + '</tr>';
        });

        // Create the table
        var html = '<table class="table table-striped">\n'
          +   '<thead>\n'
          +     '<tr>\n'
          +       '<th>Station Name</th>\n'
          +       '<th>ID</th>\n'
          +       '<th>Latitude</th>\n'
          +       '<th>Longitude</th>\n'
          +     '</tr>\n'
          +   '</thead>\n'
          +   '<tbody>\n'
          +     rows.join('')
          +   '</tbody>\n'
          + '</table>\n';

        // Add the html to the page
        $(selector).html(html);
      }

      // Load the books
      var query = new Kinvey.Query();
      query.ascending('lat');
      query.ascending('lng');
      

      var store = Kinvey.DataStore.collection('books', dataStoreType);
      store.find(query)
        .subscribe(function(books) {
          return renderTable(books, '#books-table')
        });
    },

    loadTideStations: function (dataStoreType) {
        // Render the table
        function renderTable(stations, selector) {
            // Default stations to an empty array
            stations = stations || [];

            // Create the rows
            var rows = stations.map(function (station) {
                return '<tr>\n'
                  + '<td>' + station.name + '</td>\n'
                  + '<td>' + station.id + '</td>\n'
                  + '<td>' + station.lat + '</td>\n'
                  + '<td>' + station.lng + '</td>\n'
                  + '<td>' + (station.reference_id || '') + '</td>\n'
                  + '</tr>';
            });

            // Create the table
            var html = '<table class="table table-striped">\n'
              + '<thead>\n'
              + '<tr>\n'
              + '<th>Station Name</th>\n'
              + '<th>ID</th>\n'
              + '<th>Latitude</th>\n'
              + '<th>Longitude</th>\n'
              + '<th>Reference ID</th>\n'
              + '</tr>\n'
              + '</thead>\n'
              + '<tbody>\n'
              + rows.join('')
              + '</tbody>\n'
              + '</table>\n';

            // Add the html to the page
            $(selector).html(html);
        }

        // Load the stations
        var store = Kinvey.DataStore.collection('NOAAStations', dataStoreType);
        store.find()
          .subscribe(function (stations) {
              return renderTable(stations, '#NOAAStations-table')
          });
    },

    loadFiles: function() {
      // Render the table
      function renderTable(files, selector) {
        // Default files to an empty array
        files = files || [];

        // Create the rows
        var rows = files.map(function(file) {
          return '<tr>\n'
            + '<td>' + file._filename + '</td>\n'
            + '<td>' + file.mimeType + '</td>\n'
            + '<td>' + file._public + '</td>\n'
            + '<td><a target="_blank" href="' + file._downloadURL + '">Download URL</a></td>\n'
            + '</tr>';
        });

        // Create the table
        var html = '<table class="table table-striped">\n'
          +   '<thead>\n'
          +     '<tr>\n'
          +       '<th>Filename</th>\n'
          +       '<th>MIME Type</th>\n'
          +       '<th>Public</th>\n'
          +       '<th>Url</th>\n'
          +     '</tr>\n'
          +   '</thead>\n'
          +   '<tbody>\n'
          +     rows.join('')
          +   '</tbody>\n'
          + '</table>\n';

        // Add the html to the page
        $(selector).html(html);
      }

      // Load the files
      Kinvey.Files.find()
        .then(function(files) {
          return renderTable(files, '#files-table')
        });
    },

    loadGeoFiles: function (bbox_ll,bbox_ur) {
        // Render the table
        function renderTable(files, selector) {
            // Default files to an empty array
            files = files || [];

            // Create the rows
            var rows = files.map(function (file) {
                return '<tr>\n'
                  + '<td>' + file._filename + '</td>\n'
                  + '<td>' + file.mimeType + '</td>\n'
                  + '<td>' + file._public + '</td>\n'
                  + '<td><a target="_blank" href="' + file._downloadURL + '">Download URL</a></td>\n'
                  + '</tr>';
            });

            // Create the table
            var html = '<table class="table table-striped">\n'
              + '<thead>\n'
              + '<tr>\n'
              + '<th>Filename</th>\n'
              + '<th>MIME Type</th>\n'
              + '<th>Public</th>\n'
              + '<th>Url</th>\n'
              + '</tr>\n'
              + '</thead>\n'
              + '<tbody>\n'
              + rows.join('')
              + '</tbody>\n'
              + '</table>\n';

            // Add the html to the page
            $(selector).html(html);
        }

        //search_coord = [-122.0, 47.0];
        //radius = 100;
        // create query
        var query = new Kinvey.Query();
        //query.near('_geoloc', search_coord,radius)
        query.withinBox('_geoloc', bbox_ll,bbox_ur);

        // Load the files
        //Kinvey.Files.find()
        Kinvey.Files.find(query)
          .then(function (files) {
              return renderTable(files, '#files-table')
          });
    },

    uploadFile: function(event) {
      // Prevent the form from being submitted
      event.preventDefault();

      // Remove the upload-success and upload-error
      $('#upload-success').hide(0);
      $('#upload-error').hide(0);
      $('#exif-data').hide(0);

      // Get entered values
      var file = $('#file')[0].files[0];

      if (file) {
        var filename = $('#filename').val();
        var public = document.getElementById('public').checked;
        filename = filename || filename !== '' ? filename : file.name;

          // this is where I think the EXIF scrape can come for uploading to Kinvey. 
          // Really belongs as a pre-save file hook on Kinvey, though.

        var testData = EXIF.getData(filename, function () {
            var allMetaData = EXIF.getAllTags(this);
            var allMetaDataSpan = document.getElementById("allMetaDataSpan5");
            allMetaDataSpan.innerHTML = JSON.stringify(allMetaData, null, "\t");
            $('#exif-data').html('<p>here is EXIF section after processing</p>').show(0);
        });
        
        //$('#exif-data').show(0);

        // Show progress
        $('#upload-progress').show(0);

        // Upload the file
        Kinvey.Files.upload(file, { filename: filename, public: public }, { timeout: 10 * 60 * 1000 })
          .then(function() {
            // Hide progress
            $('#upload-progress').hide(0);

            // Show success message
            $('#upload-success').html('<p>File uploaded!</p>').show(0);

            var testData = EXIF.getData(filename, function () {
                var allMetaData = EXIF.getAllTags(this);
                var allMetaDataSpan = document.getElementById("allMetaDataSpan5");
                allMetaDataSpan.innerHTML = JSON.stringify(allMetaData, null, "\t");
                $('#exif-data').html('<p>here is EXIF section after processing</p>').show(0);
            });

            $('#exif-data').html('<p>' + testData + '</p>').show(0);
          })
           
          .catch(function(error) {
            // Hide progress
            $('#upload-progress').hide(0);

            // Show error message
            $('#upload-error').html('<p>' + error.message + '</p>').show(0);
          });
      } else {
        // Hide progress
        $('#upload-progress').hide(0);

        // Show error message
        $('#upload-error').html('<p>Please select a file to upload.</p>').show(0);
      }
    },

    saveProfile: function(event) {
      // Get the active user
      var activeUser = Kinvey.User.getActiveUser();

      // Prevent the form from being submitted
      event.preventDefault();

      // Remove the profile-success and profile-error
      $('#profile-success').hide(0);
      $('#profile-error').hide(0);

      // Get entered values
      var data = {
        username: $('#username').val(),
        firstname: $('#firstname').val(),
        lastname: $('#lastname').val()
      };

      // Login to Kinvey
      activeUser.update(data)
        .then(function() {
          $('#profile-success').html('<p>Profile updated!</p>').show(0);
        })
        .catch(function(error) {
          $('#profile-error').html('<p>' + error.message + '</p>').show(0);
        });
    }
};

// Authorized Hrefs
var authorizedHrefs = [
//  '/',
//  '/index.html',
  '/files.html',
  '/upload.html',
  '/profile.html',
  '/map-markers.html',
  '/tides.html'
];

// Bind events
function bindEvents() {
  return new RSVP.Promise(function(resolve) {
    var elementEventKeys = Object.keys(app.events);
    elementEventKeys.forEach(function(elementEventKey) {
      var element = elementEventKey.split(' ')[0];
      var event = elementEventKey.split(' ')[1];
      $(element).on(event, app[app.events[elementEventKey]]);
    });
    resolve();
  });
}

// Initialize Kinvey
Kinvey.initialize({
  appKey: 'kid_ryiIKffKZ',
  appSecret: 'cdf8c00f516e4941a691eab1275ed2a6'
})
  .then(function(activeUser) {
    if (!activeUser && authorizedHrefs.indexOf(location.pathname) !== -1) {
      location.replace('/login.html');
    } else {
     return bindEvents();
    }
  })
  .then(function() {
    $(document).trigger('app.ready');
  })
  .catch(function(error) {
    alert(error.message);
    console.log(error);
  });

