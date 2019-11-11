/*
markfmotet
September 29th, 2019

DESCRIPTION: 
Webscraper that extracts information about professors from ratemyprofessors.com
*/


//Dependencies
const professorArray= require('./professorCodes.js');
const request = require('request-promise');
const cheerio = require('cheerio');
const Discord = require('discord.js');

//Discord client and token
const client = new Discord.Client();
const token = 'BOT_TOKEN_HERE';

//Turning on the Discord bot
client.on('ready', () => {

    console.log("Bot online!");

});

//Detects when a message is sent
client.on('message', message => {

    //Checks for the command "!rate professor"
    if(message.content.toLowerCase().startsWith ('!rate')){

      var hasRating;

      //Cuts the "!rate_" from the user's command and capitalizes the first letter of the professor's name
      var input = message.content;
      var inputName = input.substr(6).toLowerCase();
      var inputNameCapitalized = inputName.charAt(0).toUpperCase() + inputName.substring(1); //needed for "could not find" case

 /*_________________________________________________________________________________________________________________________________*/
       
            //Returns corresponding professor code from the professor's last name
            var currentProfessors = [[]];
            var currentProfessorsIndex = 0;
            
            for(var i = 0; i <  professorArray.professorCodesArray.length; i++){
               if( professorArray.professorCodesArray[i][1].toLowerCase() == inputName){

                  professorIndex = i;
                  currentProfessors[currentProfessorsIndex] =  professorArray.professorCodesArray[i]; //Copies code, last name, and first name of all professors with the same last name
                  currentProfessorsIndex++;
                  
               }
              
            }

            if(currentProfessors[0].length == 0){
               
               message.channel.send("I could not find \"" + inputNameCapitalized + ".\"");
               console.log("I could not find \"" + inputNameCapitalized + ".\"");

                //Adds to log
                const fs = require('fs');
                fs.appendFile("log.txt", "Could not find " + inputNameCapitalized + " (Requested by: " + message.member.user.tag + ") | " + getDate() + "\n", function(err) {
                   if(err) {
                      return console.log(err);
                   }
                }); 
         
            }
            else if(currentProfessors.length > 0){
               for(var i = 0; i < currentProfessors.length; i++){
                  sendProfessor(currentProfessors[i][0]);
               }
            }
         
        

 /*_________________________________________________________________________________________________________________________________*/

         //Webscrapes information about the professor using the professor's code and sends it to the Discord server
         function sendProfessor(code){
         
            //Appends professor code to ratemyprofessors.com url
               const url = 'https://www.ratemyprofessors.com/ShowRatings.jsp?tid=' + code;
         
            request(url)
            .then(function(html){
         
               //Sets head of chain to a constant
               const $ = cheerio.load(html);

               //Tests if the professor has ratings. If not, send warning message and end
               if($('.headline').text().trim().startsWith('Be the first to rate Professor')){
                  hasRating = false;
               }
               else{
                  hasRating = true;
               }
             
               //Uses JQuery/Cheerio to access numbers from the HTML file
               
               var professorNameFirst = $('.pfname').text().trim();
               var professorNameLast = $('.plname').text().trim();
               var overallQuality = $('.grade').eq(0).text().trim();
               var wouldTakeAgain = $('.grade').eq(1).text().trim();
               var levelOfDifficulty = $('.grade').eq(2).text().trim();
               var numberOfRatings = $('.table-toggle.rating-count.active').text().trim();
               
               //If professor has ratings, sends professor info to the Discord channel through a Discord rich embed
               if(hasRating == true){
                  var embed = new Discord.RichEmbed()

                  if(overallQuality >= 3.5){
                     embed.setColor([124, 204, 30]) //Green
                     embed.setThumbnail('https://i.imgur.com/t2HrJ5i.png')
                  }
                   if(overallQuality >= 2.5 && overallQuality <3.5){
                     embed.setColor([247, 204, 30]) //Yellow
                     embed.setThumbnail('https://i.imgur.com/vYmyYD0.png')
                  }
                   if(overallQuality < 2.5){
                     embed.setColor([224, 23, 67]) //Red
                     embed.setThumbnail('https://i.imgur.com/pphpzLh.png')
                  }

                 
                  embed.setTitle(professorNameFirst + " " + professorNameLast)
                  embed.setURL('https://www.ratemyprofessors.com/ShowRatings.jsp?tid=' + code)
                  
                  embed.setDescription(
                     
                     "Overall quality: "  + overallQuality + "\n" +
                     "Would take again: " +  wouldTakeAgain + "\n" +
                     "Level of difficulty: "  + levelOfDifficulty

                  )
                  embed.setFooter("Number of ratings: "  + numberOfRatings.split(" ")[0])
                   message.channel.send(embed);

                  //Prints professor info to the console
                  console.log('______________________________________\n');
                  console.log(professorNameFirst + ' ' + professorNameLast + "\n");
                  console.log('Overall quality: ' + overallQuality);
                  console.log('Would take again: ' + wouldTakeAgain);
                  console.log('Level of difficulty: ' + levelOfDifficulty);
                  console.log('Number of ratings: ' + numberOfRatings.split(" ")[0]);
                  console.log('\n(Requested by: ' + message.member.user.tag + ')' + "\n");
                  console.log('______________________________________');
                  
                  //Adds to log
                  const fs = require('fs');
                  fs.appendFile("log.txt", professorNameFirst + " " + professorNameLast + " (Requested by: " + message.member.user.tag + ") | " + getDate() + "\n", function(err) {
                     if(err) {
                        return console.log(err);
                     }
                  }); 


               }
               else if(hasRating == false){
               
                  var embed = new Discord.RichEmbed()
                  var name = $('.headline').text().trim().slice(31, -43);

                  embed.setColor([166, 166, 166]) //Grey
                  embed.setTitle(name)
                  embed.setURL('https://www.ratemyprofessors.com/AddRating.jsp?tid=' + code)
                  embed.setThumbnail('https://i.imgur.com/Mw1XJvt.png')
                  embed.setDescription(
                     
                     "Overall quality: N/A\n" +
                     "Would take again: N/A\n" +
                     "Level of difficulty: N/A"

                  )
                  embed.setFooter("Number of ratings: 0")
                  message.channel.send(embed);

                  //Adds to log
                  const fs = require('fs');
                  fs.appendFile("log.txt", name + " (Requested by: " + message.member.user.tag + ") | " + getDate() + "\n", function(err) {
                     if(err) {
                        return console.log(err);
                     }
                  }); 
               }

            })
            .catch(function(err){
               console.log("Error.");
            });
          
         }
         
    }
    
});

client.login(token);

function getDate(){

   var date  = new Date();
   console.log(date);

   return date;
}
