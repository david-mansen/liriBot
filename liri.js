var keysModule = require('./keys.js');
var twitterKeys = keysModule.twitterKeys;


function myTweets(){
    console.log("\n\n\tPrinting tweets...\n");
    var Twitter = require('twitter');
    
    var client = new Twitter({
        consumer_key: twitterKeys.consumer_key,
        consumer_secret: twitterKeys.consumer_secret,
        access_token_key: twitterKeys.access_token_key,
        access_token_secret: twitterKeys.access_token_secret
    });
    
    var params = {
        screen_name: 'JArregalo',
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        //console.log(JSON.stringify(tweets, null, 2));    
        for(let i=0; i<tweets.length; i++){
            console.log("\t"+tweets[i].text);
            console.log("\t"+tweets[i].created_at);
            console.log("\n");
        }
        //console.log(JSON.stringify(tweets[0],null,2));
    }
    });
}

function spotifyThisSong(songName){
    if(songName==="none") songName = "The Sign, Ace of Base";
    var client_id = "9a5065e197fc44d1ac590bc85d48e388";
    var client_secret = "59cb0de5338845dfafabe835bef1aaaf";

    var Spotify = require('node-spotify-api');
    
    var spotify = new Spotify({
        id: client_id,
        secret: client_secret
    });
    
    spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
        if (err) {
            return console.log("\n\tError: Could not find song");
        }
        console.log("\n\tSong Name: "+data.tracks.items[0].name); 
        console.log("\tArtist Name: "+data.tracks.items[0].artists[0].name); 
        console.log("\tPreview URL: "+data.tracks.items[0].preview_url); 
        console.log("\tAlbum Name: "+data.tracks.items[0].album.name);
    });


}

function movieThis(movieName){
    //      * Title of the movie.
    //   * Year the movie came out.
    //   * IMDB Rating of the movie.
    //   * Country where the movie was produced.
    //   * Language of the movie.
    //   * Plot of the movie.
    //   * Actors in the movie.
    //   * Rotten Tomatoes URL.

    var request = require("request");

    if(movieName === "none") movieName = "Mr. Nobody";
    var key = "40e9cece";

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function(error, response, body) {
        //console.log(body);
        if (!error && response.statusCode === 200) {
            var movieJSON = JSON.parse(body);
            console.log("\n\tTitle:\t\t", movieJSON.Title);
            console.log("\tRelease Year:\t", movieJSON.Year);
            console.log("\tIMDB Rating:\t", movieJSON.Rated);
            console.log("\tCountry:\t", movieJSON.Country);
            console.log("\tLanguage:\t", movieJSON.Language);
            console.log("\tPlot:\t\t", movieJSON.Plot);
            console.log("\tActors:\t\t", movieJSON.Actors);
            console.log("\tURL:\t\t", movieJSON.Website );
        }
        else{
            console.log("Could not find movie");
        }
    });
}

function doWhatItSays(){
    var fs = require("fs");

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        //console.log(dataArr);
        handleCommand(dataArr[0], dataArr[1]);
    });
}

function handleCommand(command, modifier){
    switch(command.trim()){
        case "my-tweets":
            logCommand("my-tweets", "");
            myTweets();
            break;
        case "spotify-this-song":
            logCommand("spotify-this-song", modifier);
            spotifyThisSong(modifier);
            break;
        case "movie-this":
            logCommand("movie-this", modifier);
            movieThis(modifier);
            break;
        case "do-what-it-says":
            logCommand("do-what-it-says", "");
            doWhatItSays();
            break;
        default:
            console.log("\n\n-------Help Menu-------");
            console.log("\nAvailable commands are:\n");
            console.log("\tmy-tweets");
            console.log("\tspotify-this-song <song-name>");
            console.log("\tmovie-this <movie-name>");
            console.log("\tdo-what-it-says");
            break;
    }
}

function logCommand(command, modifier){
    var fs = require("fs");
    fs.appendFile("log.txt", command+" "+modifier+"\n", function(err) {
            if (err) {
                return console.log(err);
            }
    });
}

var command = "none";
var modifier = "none";
if(process.argv.length > 2){
    command = process.argv[2];
    modifier = "none";
}
if(process.argv.length > 3){
    command = process.argv[2];
    modifier = process.argv[3];
}

handleCommand(command, modifier);
