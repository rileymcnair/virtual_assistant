import wolframalpha
import wikipedia
import pywhatkit
#import tweepy
import webbrowser
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
  


wolframKey = ["+", "-", "=", "<", ">", "derivative", "integral", "!", "(", ")", "%", "factorial", "power", "root", "^"]
symbolKey = ["+", "-", "=", "<", ">", "/", "!", "(", ")", "*", "%", "^"]
youtubeKey = ["play", "song", "video", "youtube"]
twitterUserKey = ["user", "profile", "tweets", "tweet", "from"]
twitterTopicKey = ["search", "about", "twitter", "for"]


def assistant_query(query):
   print('assitant_query param: ' + query)
   query = query.lower()
   input = symbolSplicer(query)
   print('result of splicer: ')
   print(input)

   for word in input:
      print(word)

      if word in youtubeKey:
         #print("reached")

         return youtube_query(query.replace(word, ""))

      elif word in wolframKey:
         return wolfram_alpha(query)

      elif word in twitterUserKey:

         if "about" in input:
            query = ""
            input = twitterCombiner(input, word)

            for i in range(len(input)):
               query += input[i] + "%20"

            return twitterTopic_query(query)
         else:
            query = ""
            input = twitterCombiner(input, word)

            for i in range(len(input)):
               query += input[i]

            return twitterUser_query(query)

      elif word in twitterTopicKey:
         query = ""
         input = twitterCombiner(input, word)

         for i in range(len(input)):
            query += input[i] + "%20"

         return twitterTopic_query(query)



   return wikipedia_query(query)


def wolfram_alpha(queryString):
   queryString = str(queryString)
   print('reached wolfram query')
   print('param: ')
   print(queryString)
   app_id = 'E2E2KA-A8HHJVE778'
   client = wolframalpha.Client(app_id)
   print('vince')

   res = client.query(queryString)
   print('lombardi')
   realres = str(next(res.results).text)
   print(realres)  # print for debugging
   return realres


def wikipedia_query(query):
   print('reached wikipedia query')
   wikiresult = wikipedia.summary(query, sentences=2)
   return wikiresult


def youtube_query(query):
   print('reached youtube query')
   pywhatkit.playonyt(query)
   return "Opening Youtube..."


def twitterUser_query(query):
   # cons_key = "hgC4TA7dj3loWbhcBWQxPdBco"
   # cons_secret_key = "VSq66XqzWrHDY1Dqf3O80F8KlpIubma7rBFiHfklKxb75VvJZv"
   #
   # auth = tweepy.AppAuthHandler(cons_key, cons_secret_key)
   #
   # api = tweepy.API(auth)
   print('reached twitter user query')
   url = "https://twitter.com/" + query
   webbrowser.open(url)
   return "Opening Twitter..."

def twitterTopic_query(query):
   url = "https://twitter.com/search?q=" + query
   webbrowser.open(url)
   return "Opening Twitter..."

def twitterCombiner(input, word):
   input = input[input.index(word):]

   while(input[0] in twitterTopicKey) | (input[0] in twitterUserKey):
      del input[0]

   return input

def symbolSplicer(query):
   print('reached math symbol splicer')
   newstring = ""
   for char in query:
      if char in symbolKey:
         newstring += " "
         newstring += char
         newstring += " "
      else:
         newstring += char
   return newstring.split()