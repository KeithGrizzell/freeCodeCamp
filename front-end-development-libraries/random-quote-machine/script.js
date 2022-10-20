// This script assumes jQuery is already loaded.

/*
   FUNCTIONS
*/

function randBetween(min, max) {
  // Returns a random integer between min and max, inclusive.
  let intMin = Math.ceil(min);
  let intMax = Math.floor(max);
  if (intMin > intMax) {
    return undefined;
  }
  else if (intMin === intMax) {
    return intMin;
  }
  else {
    return intMin + Math.floor((1 + intMax - intMin) * Math.random());
  }
}

/* The following creates a state-ful function. */
let generateNewColor = function() {
  let hsl = [randBetween(0, 359), 100, 100];  // initial state
  return function() {
    // Returns a new color that's visually distinct and suitable
    const MINHUESEP = 115;  // Minimum Hue Separation (must be less <= 180)
    let h = randBetween(hsl[0] + MINHUESEP, hsl[0] + 360 - MINHUESEP) % 360;
    let s = randBetween(50, 100);
    let l = randBetween(25, 40);
    hsl = [h,s,l];  // save new state
    return `hsl(${h}, ${s}%, ${l}%)`;
  };
}();

function randomQuote() {
  return quotations[randBetween(1, quotations.length) - 1];
};

function parseHTML(html) {
  return $.parseHTML(html)[0].data;
}

function setQuoteText() {
  // Get a new quote
  const currQuote = $("#text").html();  // the current quote text in document
  let quote = currQuote;
  while (quote == currQuote) {
    quote = quotations[randBetween(1, quotations.length) - 1];
  }
  
  // Set up the text, author, and tweet strings
  const text = parseHTML(`&ldquo;${quote.quote}&rdquo;`);
  const author = parseHTML(quote.attribution);  
  const tweetString = parseHTML(`${text}  &mdash;${author}`);
  
  // Set up and encode the tweet URL
  const tweetURL = encodeURI(
    `https://twitter.com/intent/tweet?text=${tweetString}`);
  
  // Modify the document to match the new values
  $("#text").html(text);
  $("#author").html(author);
  $("#tweet-quote").attr("href", tweetURL);
}

function changeColor(duration) {
  // Get new color
  const newColor = generateNewColor();
  
  // Apply new color
  if (duration > 0) {
    // Animate color changes
    $(".color-scheme").animate({"background-color": newColor}, duration);
    $(".color-scheme-inverse").animate({"color": newColor}, duration);
  }
  else {
    // No time to animate!
    $(".color-scheme").css({"background-color": newColor});
    $(".color-scheme-inverse").css({"color": newColor});
  }
}

function changeQuote(duration) {
  // Initiate a color change
  changeColor(duration);
  
  // Animate quote box fade-out-and-in and call setQuoteText, as appropriate
  if (duration > 0) {
    $("#quote-box")
      .animate({"opacity": 0},
        {duration: duration / 2, queue: "fade", complete: setQuoteText})
      .animate({"opacity": 1}, {duration: duration / 2, queue: "fade"})
      .dequeue("fade");
  }
  else {
    setQuoteText();
  }
}


/*
   RUN ON PAGE LOAD
*/

$().ready(() => {
  changeQuote(0);
  $("#new-quote").click(() => {changeQuote(800);});
});


/*  
   QUOTATIONS
*/  

const quotations = [
  {"quote": "Alone we can do so little; together we can do so much.", "attribution": "Helen Keller"},
  {"quote": "If everyone is moving forward together, then success takes care of itself.", "attribution": "Henry Ford"},
  {"quote": "Many ideas grow better when transplanted into another mind than the one where they sprang up.", "attribution": "Oliver Wendell Holmes"},
  {"quote": "If I have seen further, it is by standing on the shoulders of giants.", "attribution": "Isaac Newton"},
  {"quote": "No one can whistle a symphony. It takes a whole orchestra to play it.", "attribution": "H.E. Luccock"},
  {"quote": "Teamwork is the ability to work together toward a common vision. The ability to direct individual accomplishments toward organizational objectives. It is the fuel that allows common people to attain uncommon results.", "attribution": "Andrew Carnegie"},
  {"quote": "It is the long history of humankind (and animal kind, too) that those who learned to collaborate and improvise most effectively have prevailed.", "attribution": "Charles Darwin"},
  {"quote": "Coming together is a beginning, staying together is progress, and working together is success.", "attribution": "Henry Ford"},
  {"quote": "Talent wins games, but teamwork and intelligence win championships.", "attribution": "Michael Jordan"},
  {"quote": "The strength of the team is each individual member. The strength of each member is the team.", "attribution": "Phil Jackson"},
  {"quote": "The best teamwork comes from men who are working independently toward one goal in unison.", "attribution": "James Cash Penney"},
  {"quote": "Politeness is the poison of collaboration.", "attribution": "Edwin Land"},
  {"quote": "Find a group of people who challenge and inspire you, spend a lot of time with them, and it will change your life.", "attribution": "Amy Poehler"},
  {"quote": "Effectively, change is almost impossible without industry-wide collaboration, cooperation, and consensus.", "attribution": "Simon Mainwaring"},
  {"quote": "Teamwork begins by building trust. And the only way to do that is to overcome our need for invulnerability.", "attribution": "Patrick Lencioni"},
  {"quote": "You need to be aware of what others are doing, applaud their efforts, acknowledge their successes, and encourage them in their pursuits. When we all help one another, everybody wins.", "attribution": "Jim Stovall"},
  {"quote": "The way a team plays as a whole determines its success. You may have the greatest bunch of individual stars in the world, but if they don&apos;t play together, the club won&apos;t be worth a dime.", "attribution": "Babe Ruth"},
  {"quote": "There is no such thing as a self-made man. You will reach your goals only with the help of others.", "attribution": "George Shinn"},
  {"quote": "It is literally true that you can succeed best and quickest by helping others to succeed.", "attribution": "Napolean Hill"},
  {"quote": "The whole is other than the sum of the parts.", "attribution": "Kurt Koffka"},
  {"quote": "A group becomes a team when each member is sure enough of himself and his contribution to praise the skills of others.", "attribution": "Norman Shidle"},
  {"quote": "The ratio of We&apos;s to I&apos;s is the best indicator of the development of a team.", "attribution": "Lewis B. Ergen"},
  {"quote": "Individual commitment to a group effort &mdash; that is what makes a team work, a company work, a society work, a civilization work.", "attribution": "Vince Lombardi"},
  {"quote": "One piece of log creates a small fire, adequate to warm you up, add just a few more pieces to blast an immense bonfire, large enough to warm up your entire circle of friends; needless to say that individuality counts but teamwork dynamites.", "attribution": "Jin Kwon"},
  {"quote": "No matter how brilliant your mind or strategy, if you&apos;re playing a solo game, you&apos;ll always lose out to a team.", "attribution": "Reid Hoffman"},
  {"quote": "Keep away from people who try to belittle your ambitions. Small people always do that, but the really great make you feel that you, too, can become great.", "attribution": "Mark Twain"},
  {"quote": "If you want to lift yourself up, lift up someone else.", "attribution": "Booker T. Washington"},
  {"quote": "Great things in business are never done by one person; they&apos;re done by a team of people.", "attribution": "Steve Jobs"},
  {"quote": "Individually, we are one drop. Together, we are an ocean.", "attribution": "Ryunosuke Satoro"},
  {"quote": "Cooperation is the thorough conviction that nobody can get there unless everybody gets there.", "attribution": "Virginia Burden"},
  {"quote": "None of us, including me, ever do great things. But we can all do small things, with great love, and together we can do something wonderful.", "attribution": "Mother Teresa"},
  {"quote": "It is amazing what you can accomplish if you do not care who gets the credit.", "attribution": "Harry Truman"},
  {"quote": "It takes two flints to make a fire.", "attribution": "Louisa May Alcott"},
  {"quote": "The way to achieve your own success is to be willing to help somebody else get it first.", "attribution": "Iyanla Vanzant"},
  {"quote": "If you want to go fast, go alone. If you want to go far, go together.", "attribution": "African Proverb"},
  {"quote": "Success is best when it&apos;s shared.", "attribution": "Howard Schultz"},
  {"quote": "Hard work beats talent if talent doesn&apos;t work hard.", "attribution": "Tim Notke"},
  {"quote": "We think, mistakenly, that success is the result of the amount of time we put in at work, instead of the quality of time we put in.", "attribution": "Ariana Huffington"},
  {"quote": "When the ideas are coming, I don&apos;t stop until the ideas stop because that train doesn&apos;t come along all the time.", "attribution": "Dr. Dre"},
  {"quote": "Someone once told me growth and comfort do not coexist. And I think it&apos;s a really good thing to remember.", "attribution": "Ginni Rometty"},
  {"quote": "Hard work keeps the wrinkles out of the mind and spirit.", "attribution": "Helena Rubinstein"},
  {"quote": "Satisfaction lies in the effort, not in the attainment.", "attribution": "Mahatma Gandhi"},
  {"quote": "I&apos;m a greater believer in luck, and I find the harder I work, the more I have of it.", "attribution": "Thomas Jefferson"},
  {"quote": "Diamonds are nothing more than chunks of coal that stuck to their jobs.", "attribution": "Malcolm Forbes"},
  {"quote": "The dictionary is the only place that success comes before work.", "attribution": "Vince Lombardi Jr."},
  {"quote": "The way to get started is to quit talking and begin doing.", "attribution": "Walt Disney"},
  {"quote": "Your time is limited, so don&apos;t waste it living someone else&apos;s life. Don&apos;t be trapped by dogma &mdash; which is living with the results of other people&apos;s thinking.", "attribution": "Steve Jobs"},
  {"quote": "If life were predictable it would cease to be life, and be without flavor.", "attribution": "Eleanor Roosevelt"},
  {"quote": "If you look at what you have in life, you&apos;ll always have more. If you look at what you don&apos;t have in life, you&apos;ll never have enough.", "attribution": "Oprah Winfrey"},
  {"quote": "If you set your goals ridiculously high and it&apos;s a failure, you will fail above everyone else&apos;s success.", "attribution": "James Cameron"},
  {"quote": "Life is what happens when you&apos;re busy making other plans.", "attribution": "John Lennon"},
  {"quote": "Spread love everywhere you go. Let no one ever come to you without leaving happier.", "attribution": "Mother Teresa"},
  {"quote": "When you reach the end of your rope, tie a knot in it and hang on.", "attribution": "Franklin D. Roosevelt"},
  {"quote": "Always remember that you are absolutely unique. Just like everyone else.", "attribution": "Margaret Mead"},
  {"quote": "Don&apos;t judge each day by the harvest you reap but by the seeds that you plant.", "attribution": "Robert Louis Stevenson"},
  {"quote": "The future belongs to those who believe in the beauty of their dreams.", "attribution": "Eleanor Roosevelt"},
  {"quote": "Tell me and I forget. Teach me and I remember. Involve me and I learn.", "attribution": "Benjamin Franklin"},
  {"quote": "The best and most beautiful things in the world cannot be seen or even touched &mdash; they must be felt with the heart.", "attribution": "Helen Keller"},
  {"quote": "It is during our darkest moments that we must focus to see the light.", "attribution": "Aristotle"},
  {"quote": "Whoever is happy will make others happy too.", "attribution": "Anne Frank"},
  {"quote": "Do not go where the path may lead, go instead where there is no path and leave a trail.", "attribution": "Ralph Waldo Emerson"},
  {"quote": "You will face many defeats in life, but never let yourself be defeated.", "attribution": "Maya Angelou"},
  {"quote": "The greatest glory in living lies not in never falling, but in rising every time we fall.", "attribution": "Nelson Mandela"},
  {"quote": "In the end, it&apos;s not the years in your life that count. It&apos;s the life in your years.", "attribution": "Abraham Lincoln"},
  {"quote": "Never let the fear of striking out keep you from playing the game.", "attribution": "Babe Ruth"},
  {"quote": "Life is either a daring adventure or nothing at all.", "attribution": "Helen Keller"},
  {"quote": "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.", "attribution": "Dr. Seuss"},
  {"quote": "If life were predictable it would cease to be life and be without flavor.", "attribution": "Eleanor Roosevelt"},
  {"quote": "Life is a succession of lessons which must be lived to be understood.", "attribution": "Ralph Waldo Emerson"},
  {"quote": "Life is never fair, and perhaps it is a good thing for most of us that it is not.", "attribution": "Oscar Wilde"},
  {"quote": "The only impossible journey is the one you never begin.", "attribution": "Tony Robbins"},
  {"quote": "In this life we cannot do great things. We can only do small things with great love.", "attribution": "Mother Teresa"},
  {"quote": "Only a life lived for others is a life worthwhile.", "attribution": "Albert Einstein"},
  {"quote": "The purpose of our lives is to be happy.", "attribution": "Dalai Lama"},
  {"quote": "You only live once, but if you do it right, once is enough.", "attribution": "Mae West"},
  {"quote": "Live in the sunshine, swim the sea, drink the wild air.", "attribution": "Ralph Waldo Emerson"},
  {"quote": "Go confidently in the direction of your dreams! Live the life you&apos;ve imagined.", "attribution": "Henry David Thoreau"},
  {"quote": "Life is really simple, but we insist on making it complicated.", "attribution": "Confucius"},
  {"quote": "May you live all the days of your life.", "attribution": "Jonathan Swift"},
  {"quote": "Life itself is the most wonderful fairy tale.", "attribution": "Hans Christian Andersen"},
  {"quote": "Do not let making a living prevent you from making a life.", "attribution": "John Wooden"},
  {"quote": "Life is ours to be spent, not to be saved.", "attribution": "D. H. Lawrence"},
  {"quote": "Keep smiling, because life is a beautiful thing and there&apos;s so much to smile about.", "attribution": "Marilyn Monroe"},
  {"quote": "Life is a long lesson in humility.", "attribution": "James M. Barrie"},
  {"quote": "In three words I can sum up everything I&apos;ve learned about life: it goes on.", "attribution": "Robert Frost"},
  {"quote": "Love the life you live. Live the life you love.", "attribution": "Bob Marley"},
  {"quote": "Life is made of ever so many partings welded together.", "attribution": "Charles Dickens"},
  {"quote": "Life is trying things to see if they work.", "attribution": "Ray Bradbury"},
  {"quote": "Many of life&apos;s failures are people who did not realize how close they were to success when they gave up.", "attribution": "Thomas A. Edison"},
  {"quote": "Success is not final; failure is not fatal: It is the courage to continue that counts.", "attribution": "Winston Churchill"},
  {"quote": "Success usually comes to those who are too busy to be looking for it.", "attribution": "Henry David Thoreau"},
  {"quote": "If you really look closely, most overnight successes took a long time.", "attribution": "Steve Jobs"},
  {"quote": "The secret of success is to do the common thing uncommonly well.", "attribution": "John D. Rockefeller Jr."},
  {"quote": "I find that the harder I work, the more luck I seem to have.", "attribution": "Thomas Jefferson"},
  {"quote": "The real test is not whether you avoid this failure, because you won&apos;t. It&apos;s whether you let it harden or shame you into inaction, or whether you learn from it; whether you choose to persevere.", "attribution": "Barack Obama"},
  {"quote": "Don&apos;t be distracted by criticism. Remember &mdash; the only taste of success some people get is to take a bite out of you.", "attribution": "Zig Ziglar"},
  {"quote": "I never dreamed about success, I worked for it.", "attribution": "Estee Lauder"},
  {"quote": "Success seems to be connected with action. Successful people keep moving. They make mistakes but they don&apos;t quit.", "attribution": "Conrad Hilton"},
  {"quote": "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.", "attribution": "Colin Powell"},
  {"quote": "The only limit to our realization of tomorrow will be our doubts of today.", "attribution": "Franklin D. Roosevelt"},
  {"quote": "It is better to fail in originality than to succeed in imitation.", "attribution": "Herman Melville"},
  {"quote": "Successful people do what unsuccessful people are not willing to do. Don&apos;t wish it were easier; wish you were better.", "attribution": "Jim Rohn"},
  {"quote": "The road to success and the road to failure are almost exactly the same.", "attribution": "Colin R. Davis"},
  {"quote": "I failed my way to success.", "attribution": "Thomas Edison"},
  {"quote": "A successful man is one who can lay a firm foundation with the bricks others have thrown at him.", "attribution": "David Brinkley"},
  {"quote": "Things work out best for those who make the best of how things work out.", "attribution": "John Wooden"},
  {"quote": "Try not to become a man of success. Rather become a man of value.", "attribution": "Albert Einstein"},
  {"quote": "Don&apos;t be afraid to give up the good to go for the great.", "attribution": "John D. Rockefeller"},
  {"quote": "Always bear in mind that your own resolution to success is more important than any other one thing.", "attribution": "Abraham Lincoln"},
  {"quote": "Success is walking from failure to failure with no loss of enthusiasm.", "attribution": "Winston Churchill"},
  {"quote": "You know you are on the road to success if you would do your job and not be paid for it.", "attribution": "Oprah Winfrey"},
  {"quote": "If you want to achieve excellence, you can get there today. As of this second, quit doing less-than-excellent work.", "attribution": "Thomas J. Watson"},
  {"quote": "If you genuinely want something, don&apos;t wait for it &mdash; teach yourself to be impatient.", "attribution": "Gurbaksh Chahal"},
  {"quote": "The only place where success comes before work is in the dictionary.", "attribution": "Vidal Sassoon"},
  {"quote": "If you are not willing to risk the usual, you will have to settle for the ordinary.", "attribution": "Jim Rohn"},
  {"quote": "Before anything else, preparation is the key to success.", "attribution": "Alexander Graham Bell"},
  {"quote": "People who succeed have momentum. The more they succeed, the more they want to succeed and the more they find a way to succeed. Similarly, when someone is failing, the tendency is to get on a downward spiral that can even become a self-fulfilling prophecy.", "attribution": "Tony Robbins"},
  {"quote": "You miss 100% of the shots you don&apos;t take.", "attribution": "Wayne Gretzky"},
  {"quote": "Whether you think you can or you think you can&apos;t, you&apos;re right.", "attribution": "Henry Ford"},
  {"quote": "I have learned over the years that when one&apos;s mind is made up, this diminishes fear.", "attribution": "Rosa Parks"},
  {"quote": "I alone cannot change the world, but I can cast a stone across the water to create many ripples.", "attribution": "Mother Teresa"},
  {"quote": "Nothing is impossible, the word itself says, &lsquo;I&apos;m possible!&rsquo;", "attribution": "Audrey Hepburn"},
  {"quote": "The question isn&apos;t who is going to let me; it&apos;s who is going to stop me.", "attribution": "Ayn Rand"},
  {"quote": "The only person you are destined to become is the person you decide to be.", "attribution": "Ralph Waldo Emerson"},
  {"quote": "Believe you can and you&apos;re halfway there.", "attribution": "Theodore Roosevelt"},
  {"quote": "I&apos;ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", "attribution": "Maya Angelou"},
  {"quote": "Winning isn&apos;t everything, but wanting to win is.", "attribution": "Vince Lombardi"},
  {"quote": "You become what you believe.", "attribution": "Oprah Winfrey"},
  {"quote": "The most difficult thing is the decision to act, the rest is merely tenacity.", "attribution": "Amelia Earhart"},
  {"quote": "How wonderful it is that nobody need wait a single moment before starting to improve the world.", "attribution": "Anne Frank"},
  {"quote": "An unexamined life is not worth living.", "attribution": "Socrates"},
  {"quote": "Everything you&apos;ve ever wanted is on the other side of fear.", "attribution": "George Addair"},
  {"quote": "Dream big and dare to fail.", "attribution": "Norman Vaughan"},
  {"quote": "You may be disappointed if you fail, but you are doomed if you don&apos;t try.", "attribution": "Beverly Sills"},
  {"quote": "Life is 10% what happens to me and 90% of how I react to it.", "attribution": "Charles Swindoll"},
  {"quote": "It does not matter how slowly you go as long as you do not stop.", "attribution": "Confucius"},
  {"quote": "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it.", "attribution": "Henry Ford"},
  {"quote": "Too many of us are not living our dreams because we are living our fears.", "attribution": "Les Brown"},
  {"quote": "I didn&apos;t fail the test. I just found ways to do it wrong.", "attribution": "Benjamin Franklin"},
  {"quote": "If you&apos;re offered a seat on a rocket ship, don&apos;t ask what seat! Just get on.", "attribution": "Sheryl Sandberg"},
  {"quote": "I attribute my success to this: I never gave or took any excuse.", "attribution": "Florence Nightingale"},
  {"quote": "I would rather die of passion than of boredom.", "attribution": "Vincent van Gogh"},
  {"quote": "Dreaming, after all, is a form of planning.", "attribution": "Gloria Steinem"},
  {"quote": "Whatever the mind of man can conceive and believe, it can achieve.", "attribution": "Napoleon Hill"},
  {"quote": "First, have a definite, clear practical ideal; a goal, an objective. Second, have the necessary means to achieve your ends; wisdom, money, materials, and methods. Third, adjust all your means to that end.", "attribution": "Aristotle"},
  {"quote": "Twenty years from now you will be more disappointed by the things that you didn&apos;t do than by the ones you did do. So, throw off the bowlines, sail away from safe harbor, catch the trade winds in your sails. Explore, Dream, Discover.", "attribution": "Mark Twain"},
  {"quote": "May the Force be with you.", "attribution": "Star Wars (1977)"},
  {"quote": "There&apos;s no place like home.", "attribution": "The Wizard of Oz (1939)"},
  {"quote": "I&apos;m the king of the world!", "attribution": "Titanic (1997)"},
  {"quote": "Carpe diem. Seize the day, boys. Make your lives extraordinary.", "attribution": "Dead Poets Society (1989)"},
  {"quote": "Elementary, my dear Watson.", "attribution": "The Adventures of Sherlock Holmes (1939)"},
  {"quote": "It&apos;s alive! It&apos;s alive!", "attribution": "Frankenstein (1931)"},
  {"quote": "My mama always said life was like a box of chocolates. You never know what you&apos;re gonna get.", "attribution": "Forrest Gump (1994)"},
  {"quote": "I&apos;ll be back.", "attribution": "The Terminator (1984)"},
  {"quote": "You&apos;re gonna need a bigger boat.", "attribution": "Jaws (1975)"},
  {"quote": "Here&apos;s looking at you, kid.", "attribution": "Casablanca (1942)"},
  {"quote": "My precious.", "attribution": "The Lord of the Rings: The Two Towers (2002)"},
  {"quote": "Houston, we have a problem.", "attribution": "Apollo 13 (1995)"},
  {"quote": "There&apos;s no crying in baseball!", "attribution": "A League of Their Own (1992)"},
  {"quote": "E.T. phone home.", "attribution": "E.T. the Extra-Terrestrial (1982)"},
  {"quote": "You can&apos;t handle the truth!", "attribution": "A Few Good Men (1992)"},
  {"quote": "A martini. Shaken, not stirred.", "attribution": "Goldfinger (1964)"},
  {"quote": "Life is a banquet, and most poor suckers are starving to death!", "attribution": "Auntie Mame (1958)"},
  {"quote": "If you build it, he will come.", "attribution": "Field of Dreams (1989)"},
  {"quote": "The stuff that dreams are made of.", "attribution": "The Maltese Falcon (1941)"},
  {"quote": "Magic Mirror on the wall, who is the fairest one of all?", "attribution": "Snow White and the Seven Dwarfs (1937)"},
  {"quote": "Keep your friends close, but your enemies closer.", "attribution": "The Godfather Part II (1974)"},
  {"quote": "I am your father.", "attribution": "Star Wars Episode V: The Empire Strikes Back (1980)"},
  {"quote": "Just keep swimming.", "attribution": "Finding Nemo (2003)"},
  {"quote": "Today, I consider myself the luckiest man on the face of the earth.", "attribution": "The Pride of the Yankees (1942)"},
  {"quote": "You is kind. You is smart. You is important.", "attribution": "The Help (2011)"},
  {"quote": "What we&apos;ve got here is failure to communicate.", "attribution": "Cool Hand Luke (1967)"},
  {"quote": "Hasta la vista, baby.", "attribution": "Terminator 2: Judgment Day (1991)"},
  {"quote": "You don&apos;t understand! I coulda had class. I coulda been a contender. I could&apos;ve been somebody, instead of a bum, which is what I am.", "attribution": "On the Waterfront (1954)"},
  {"quote": "Bond. James Bond.", "attribution": "Dr. No (1962)"},
  {"quote": "You talking to me?", "attribution": "Taxi Driver (1976)"},
  {"quote": "Roads? Where we&apos;re going we don&apos;t need roads.", "attribution": "Back to the Future (1985)"},
  {"quote": "That&apos;ll do, pig. That&apos;ll do.", "attribution": "Babe (1995)"},
  {"quote": "I&apos;m walking here! I&apos;m walking here!", "attribution": "Midnight Cowboy (1969)"},
  {"quote": "It was beauty killed the beast.", "attribution": "King Kong (1933)"},
  {"quote": "Stella! Hey, Stella!", "attribution": "A Streetcar Named Desire (1951)"},
  {"quote": "As if!", "attribution": "Clueless (1995)"},
  {"quote": "Here&apos;s Johnny!", "attribution": "The Shining (1980)"},
  {"quote": "Rosebud.", "attribution": "Citizen Kane (1941)"},
  {"quote": "I&apos;ll have what she&apos;s having.", "attribution": "When Harry Met Sally (1989)"},
  {"quote": "Inconceivable!", "attribution": "The Princess Bride (1987)"},
  {"quote": "All right, Mr. DeMille, I&apos;m ready for my close-up.", "attribution": "Sunset Boulevard (1950)"},
  {"quote": "Fasten your seatbelts. It&apos;s going to be a bumpy night.", "attribution": "All About Eve (1950)"},
  {"quote": "Nobody puts Baby in a corner.", "attribution": "Dirty Dancing (1987)"},
  {"quote": "Well, nobody&apos;s perfect.", "attribution": "Some Like it Hot (1959)"},
  {"quote": "Snap out of it!", "attribution": "Moonstruck (1987)"},
  {"quote": "You had me at &lsquo;hello.&rsquo;", "attribution": "Jerry Maguire (1996)"},
  {"quote": "They may take our lives, but they&apos;ll never take our freedom!", "attribution": "Braveheart (1995)"},
  {"quote": "To infinity and beyond!", "attribution": "Toy Story (1995)"},
  {"quote": "You&apos;re killin&apos; me, Smalls.", "attribution": "The Sandlot (1993)"},
  {"quote": "Toto, I&apos;ve a feeling we&apos;re not in Kansas anymore.", "attribution": "The Wizard of Oz (1939)"},
  {"quote": "To improve is to change; to be perfect is to change often.", "attribution": "Winston Churchill"},
  {"quote": "I can&apos;t change the direction of the wind, but I can adjust my sails to always reach my destination.", "attribution": "Jimmy Dean"},
  {"quote": "If you don&apos;t like something, change it. If you can&apos;t change it, change your attitude.", "attribution": "Maya Angelou"},
  {"quote": "Education is the most powerful weapon which you can use to change the world.", "attribution": "Nelson Mandela"},
  {"quote": "The secret of change is to focus all of your energy not on fighting the old, but on building the new", "attribution": "Socrates"},
  {"quote": "Since we cannot change reality, let us change the eyes which see reality.", "attribution": "Nikos Kazantzakis"},
  {"quote": "There is nothing permanent except change.", "attribution": "Heraclitus"},
  {"quote": "Our dilemma is that we hate change and love it at the same time; what we really want is for things to remain the same but get better.", "attribution": "Sydney J. Harris"},
  {"quote": "Change is the law of life, and those who look only to the past and present are certain to miss the future", "attribution": "John F. Kennedy"},
  {"quote": "The measure of intelligence is the ability to change", "attribution": "Albert Einstein"},
  {"quote": "If you can&apos;t fly, then run. If you can&apos;t run, then walk. If you can&apos;t walk, then crawl. But whatever you do, you have to keep moving forward", "attribution": "Martin Luther King Jr."},
  {"quote": "If I&apos;d asked my customers what they wanted, they&apos;d have said &lsquo;Don&apos;t change anything.&rsquo;", "attribution": "Henry Ford"},
  {"quote": "Change will not come if we wait for some other person or some other time. We are the ones we&apos;ve been waiting for. We are the change that we seek.", "attribution": "Barack Obama"},
  {"quote": "I alone cannot change the world, but I can cast a stone across the waters to create many ripples.", "attribution": "Mother Teresa"},
  {"quote": "Change is inevitable. Growth is optional.", "attribution": "John C. Maxwell"},
  {"quote": "In order to change the world, you have to get your head together first.", "attribution": "Jimi Hendrix"},
  {"quote": "A small group of thoughtful people could change the world. Indeed, it&apos;s the only thing that ever has.", "attribution": "Margaret Mead"},
  {"quote": "How wonderful is it that nobody need wait a single moment before starting to improve the world.", "attribution": "Anne Frank"},
  {"quote": "One child, one teacher, one pen, and one book can change the world", "attribution": "Malala Yousafzai"},
  {"quote": "The greatest discovery of all time is that a person can change his future by merely changing his attitude", "attribution": "Oprah Winfrey"},
  {"quote": "The price of doing the same old thing is far higher than the price of change.", "attribution": "Bill Clinton"},
  {"quote": "Don&apos;t let rejection create self-doubt. The founder of Starbucks was turned down by 217 of the 242 investors he initially spoke with.", "attribution": "Elizabeth Galbut"},
  {"quote": "Things don&apos;t have to change the world to be important", "attribution": "Steve Jobs"},
  {"quote": "Every day the clock resets. Your wins don&apos;t matter. Your failures don&apos;t matter. Don&apos;t stress on what was, fight for what could be.", "attribution": "Sean Higgins"},
  {"quote": "Don&apos;t be afraid to give up the good to go for the great.", "attribution": "John D. Rockefeller"},
  {"quote": "What&apos;s dangerous is not to evolve.", "attribution": "Jeff Bezos"},
  {"quote": "Change in all things is sweet.", "attribution": "Aristotle"},
  {"quote": "Miracles happen every day, change your perception of what a miracle is and you&apos;ll see them all around you.", "attribution": "Jon Bon Jovi"},
  {"quote": "You&apos;ve done it before and you can do it now. See the positive possibilities. Redirect the substantial energy of your frustration and turn it into positive, effective, unstoppable determination.", "attribution": "Ralph Marston"},
  {"quote": "Just take any step, whether small or large. And then another and repeat day after day. It may take months, maybe years, but the path to success will become clear", "attribution": "Aaron Ross"},
  {"quote": "Keep your face to the sunshine and you cannot see a shadow.", "attribution": "Helen Keller"},
  {"quote": "If your startup builds a room full of pessimists and you have one optimist at the table, then I think you&apos;re in the wrong business. But the other way around is invaluable and necessary", "attribution": "David Cohen"},
  {"quote": "There is nothing permanent except change.", "attribution": "Heraclitus"},
  {"quote": "If you know what you want to achieve in life, then you are more inspired to change for the better.", "attribution": "Philip Vang"},
  {"quote": "Today was good. Today was fun. Tomorrow is another one.", "attribution": "Dr. Suess"},
  {"quote": "In order to design a future of positive change, we must first become expert at changing our minds.", "attribution": "Jacque Fresco"},
  {"quote": "Everyone thinks of changing the world, but no one thinks of changing himself.", "attribution": "Leo Tolstoy"},
  {"quote": "Play to your strengths. If you aren&apos;t great at something, do more of what you&apos;re great at.", "attribution": "Jason Lemkin"},
  {"quote": "You build on failure. You use it as a stepping stone. Close the door on the past. You don&apos;t try to forget the mistakes, but you don&apos;t dwell on it. You don&apos;t let it have any of your energy, or any of your time, or any of your space.", "attribution": "Johnny Cash"},
  {"quote": "Every great dream begins with a dreamer. Always remember, you have within you the strength, the patience, and the passion to reach for the stars to change the world.", "attribution": "Harriet Tubman"},
  {"quote": "Times and conditions change so rapidly that we must keep our aim constantly focused on the future.", "attribution": "Walt Disney"},
  {"quote": "People often say that motivation doesn&apos;t last. Well, neither does bathing &mdash; that&apos;s why we recommend it daily.", "attribution": "Zig Ziglar"},
  {"quote": "Someday is not a day of the week.", "attribution": "Denise Brennan-Nelson"},
  {"quote": "Hire character. Train skill.", "attribution": "Peter Schutz"},
  {"quote": "Your time is limited, so don&apos;t waste it living someone else&apos;s life.", "attribution": "Steve Jobs"},
  {"quote": "Sales are contingent upon the attitude of the salesman &mdash; not the attitude of the prospect.", "attribution": "W. Clement Stone"},
  {"quote": "Everyone lives by selling something.", "attribution": "Robert Louis Stevenson"},
  {"quote": "If you are not taking care of your customer, your competitor will.", "attribution": "Bob Hooey"},
  {"quote": "The golden rule for every businessman is this: Put yourself in your customer&apos;s place.", "attribution": "Orison Swett Marden"},
  {"quote": "If you cannot do great things, do small things in a great way.", "attribution": "Napoleon Hill"},
  {"quote": "The best leaders are those most interested in surrounding themselves with assistants and associates smarter than they are. They are frank in admitting this and are willing to pay for such talents.", "attribution": "Antos Parrish"},
  {"quote": "Beware of monotony; it&apos;s the mother of all the deadly sins.", "attribution": "Edith Wharton"},
  {"quote": "Nothing is really work unless you would rather be doing something else.", "attribution": "J.M. Barrie"},
  {"quote": "Without a customer, you don&apos;t have a business &mdash; all you have is a hobby.", "attribution": "Don Peppers"},
  {"quote": "To be most effective in sales today, it&apos;s imperative to drop your &lsquo;sales&rsquo; mentality and start working with your prospects as if they&apos;ve already hired you.", "attribution": "Jill Konrath"},
  {"quote": "Pretend that every single person you meet has a sign around his or her neck that says, &lsquo;Make me feel important.&rsquo; Not only will you succeed in sales, you will succeed in life.", "attribution": "Mary Kay Ash"},
  {"quote": "It&apos;s not just about being better. It&apos;s about being different. You need to give people a reason to choose your business.", "attribution": "Tom Abbott"},
  {"quote": "Being good in business is the most fascinating kind of art. Making money is art and working is art and good business is the best art.", "attribution": "Andy Warhol"},
  {"quote": "Be patient with yourself. Self-growth is tender; it&apos;s holy ground. There&apos;s no greater investment.", "attribution": "Stephen Covey"},
  {"quote": "Without hustle, talent will only carry you so far.", "attribution": "Gary Vaynerchuk"},
  {"quote": "Working hard for something we don&apos;t care about is called stressed; working hard for something we love is called passion.", "attribution": "Simon Sinek"},
  {"quote": "I&apos;d rather regret the things I&apos;ve done than regret the things I haven&apos;t done.", "attribution": "Lucille Ball"},
  {"quote": "I didn&apos;t get there by wishing for it or hoping for it, but by working for it.", "attribution": "Estée Lauder"},
  {"quote": "Always do your best. What you plant now, you will harvest later.", "attribution": "Og Mandino"},
  {"quote": "The key to life is accepting challenges. Once someone stops doing this, he&apos;s dead.", "attribution": "Bette Davis"},
  {"quote": "Move out of your comfort zone. You can only grow if you are willing to feel awkward and uncomfortable when you try something new.", "attribution": "Brian Tracy"},
  {"quote": "Challenges are what make life interesting and overcoming them is what makes life meaningful.", "attribution": "Joshua J. Marine"},
  {"quote": "Don&apos;t let the fear of losing be greater than the excitement of winning.", "attribution": "Robert Kiyosaki"},
  {"quote": "How dare you settle for less when the world has made it so easy for you to be remarkable?", "attribution": "Seth Godin"},
  {"quote": "Energy and persistence conquer all things.", "attribution": "Benjamin Franklin"},
  {"quote": "Perseverance is failing 19 times and succeeding the 20th.", "attribution": "Julie Andrews"},
  {"quote": "Grit is that &lsquo;extra something&rsquo; that separates the most successful people from the rest. It&apos;s the passion, perseverance, and stamina that we must channel in order to stick with our dreams until they become a reality.", "attribution": "Travis Bradberry"},
  {"quote": "Failure after long perseverance is much grander than never to have a striving good enough to be called a failure.", "attribution": "George Eliot"},
  {"quote": "The secret of joy in work is contained in one word &mdash; excellence. To know how to do something well is to enjoy it.", "attribution": "Pearl Buck"},
  {"quote": "Develop success from failures. Discouragement and failure are two of the surest stepping stones to success.", "attribution": "Dale Carnegie"},
  {"quote": "Action is the foundational key to all success.", "attribution": "Pablo Picasso"},
  {"quote": "The ladder of success is best climbed by stepping on the rungs of opportunity.", "attribution": "Ayn Rand"},
  {"quote": "Formula for success: rise early, work hard, strike oil.", "attribution": "J. Paul Getty"},
  {"quote": "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack of will.", "attribution": "Vince Lombardi"},
  {"quote": "Obstacles are those frightful things you see when you take your eyes off your goal.", "attribution": "Henry Ford"},
  {"quote": "It is your determination and persistence that will make you a successful person.", "attribution": "Kenneth J Hutchins"},
  {"quote": "You can waste your lives drawing lines. Or you can live your life crossing them.", "attribution": "Shonda Rhimes"},
  {"quote": "Determine that the thing can and shall be done, and then we shall find the way.", "attribution": "Abraham Lincoln"},
  {"quote": "Done is better than perfect.", "attribution": "Sheryl Sandberg"},
  {"quote": "Don&apos;t ask if your dream is crazy, ask if it&apos;s crazy enough.", "attribution": "Lena Waithe"},
  {"quote": "The act of doing something un-does the fear.", "attribution": "Shonda Rhimes"},
  {"quote": "Be poor, humble and driven (PhD). Don&apos;t be afraid to shift or pivot.", "attribution": "Alex Rodriguez"},
  {"quote": "#1 make good decisions, #2 everything else.", "attribution": "Rand Fishkin"}
];
