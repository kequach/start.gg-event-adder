// Discord bot for adding tournament events to servers
import 'dotenv/config';
import { Client, GatewayIntentBits, Events } from 'discord.js';

// Mock data structure to show what start.gg API typically returns for Germany
const mockStartGGData = {
  data: {
    tournaments: {
      nodes: [
        {
          id: 123456,
          name: "Berlin Fighting Game Championship 2024",
          slug: "tournament/berlin-fgc-2024",
          countryCode: "DE",
          startAt: 1691740800, // Unix timestamp
          endAt: 1691913600,
          numAttendees: 300,
          venueAddress: "Messe Berlin, Messedamm 22",
          venueName: "Messe Berlin",
          city: "Berlin",
          addrState: "Berlin",
          postalCode: "14055",
          lat: 52.5055,
          lng: 13.2677,
          timezone: "Europe/Berlin",
          events: [
            {
              id: 654321,
              name: "Street Fighter 6",
              slug: "event/sf6",
              numEntrants: 150,
              videogame: {
                id: 1386,
                name: "Street Fighter 6",
                displayName: "Street Fighter 6"
              }
            },
            {
              id: 654322,
              name: "Tekken 8",
              slug: "event/tekken8",
              numEntrants: 120,
              videogame: {
                id: 1387,
                name: "Tekken 8",
                displayName: "Tekken 8"
              }
            }
          ],
          streams: [
            {
              streamName: "berlinfgc",
              streamSource: "TWITCH"
            }
          ],
          images: [
            {
              url: "https://images.start.gg/images/tournament/123456/image-abc123.png",
              type: "primary"
            }
          ]
        },
        {
          id: 123457,
          name: "Munich Gaming Festival",
          slug: "tournament/munich-gaming-2024",
          countryCode: "DE",
          startAt: 1688140800,
          endAt: 1688313600,
          numAttendees: 500,
          venueAddress: "Olympiahalle München, Spiridon-Louis-Ring 21",
          venueName: "Olympiahalle München",
          city: "München",
          addrState: "Bayern",
          postalCode: "80809",
          lat: 48.1753,
          lng: 11.5494,
          timezone: "Europe/Berlin",
          events: [
            {
              id: 654323,
              name: "Guilty Gear Strive",
              slug: "event/ggst",
              numEntrants: 200,
              videogame: {
                id: 1234,
                name: "Guilty Gear Strive",
                displayName: "Guilty Gear Strive"
              }
            }
          ],
          streams: [
            {
              streamName: "munichgaming",
              streamSource: "TWITCH"
            }
          ],
          images: [
            {
              url: "https://images.start.gg/images/tournament/123457/image-def456.png",
              type: "primary"
            }
          ]
        }
      ]
    }
  }
};

// Function to simulate API response processing
function processStartGGData(data) {
  console.log('📊 Processing Start.gg API Data Structure:');
  console.log('=====================================\n');
  
  if (!data.data || !data.data.tournaments || !data.data.tournaments.nodes) {
    console.log('❌ Invalid data structure');
    return [];
  }

  const tournaments = data.data.tournaments.nodes;
  const processedEvents = [];

  tournaments.forEach((tournament, index) => {
    console.log(`🏆 Tournament ${index + 1}: ${tournament.name}`);
    console.log(`   🌍 Country: ${tournament.countryCode || 'N/A'}`);
    console.log(`   🏙️ City: ${tournament.city || 'N/A'}, ${tournament.addrState || 'N/A'}`);
    console.log(`   📅 Start: ${tournament.startAt ? new Date(tournament.startAt * 1000).toLocaleString() : 'TBD'}`);
    console.log(`   📅 End: ${tournament.endAt ? new Date(tournament.endAt * 1000).toLocaleString() : 'TBD'}`);
    console.log(`   👥 Attendees: ${tournament.numAttendees || 'TBD'}`);
    console.log(`   📍 Venue: ${tournament.venueName || 'TBD'}`);
    console.log(`   📧 Address: ${tournament.venueAddress || 'TBD'}`);
    console.log(`   🕐 Timezone: ${tournament.timezone || 'TBD'}`);
    console.log(`   🔗 Slug: ${tournament.slug}`);
    console.log(`   🎮 Events: ${tournament.events?.length || 0}`);
    
    if (tournament.streams && tournament.streams.length > 0) {
      console.log(`   📺 Streams: ${tournament.streams.map(s => `${s.streamSource}/${s.streamName}`).join(', ')}`);
    }
    
    // Process each event within the tournament
    tournament.events?.forEach((event, eventIndex) => {
      const gameDisplay = event.videogame?.displayName || event.name;
      console.log(`      ${eventIndex + 1}. ${gameDisplay} (${event.numEntrants || 0} entrants)`);
      
      // Create Discord event data structure
      const discordEvent = {
        name: `${tournament.name} - ${gameDisplay}`,
        description: `🏆 Tournament: ${tournament.name}\n🎮 Game: ${gameDisplay}\n👥 Entrants: ${event.numEntrants || 'TBD'}\n🌍 Country: ${tournament.countryCode}\n🏙️ Location: ${tournament.city}, ${tournament.addrState}\n📍 Venue: ${tournament.venueName || tournament.venueAddress}\n🕐 Timezone: ${tournament.timezone}`,
        scheduledStartTime: tournament.startAt ? new Date(tournament.startAt * 1000) : new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEndTime: tournament.endAt ? new Date(tournament.endAt * 1000) : new Date(Date.now() + 26 * 60 * 60 * 1000),
        location: tournament.venueAddress || tournament.city || 'TBD',
        url: `https://start.gg/${tournament.slug}`,
        originalData: {
          tournamentId: tournament.id,
          eventId: event.id,
          slug: tournament.slug,
          countryCode: tournament.countryCode,
          city: tournament.city,
          timezone: tournament.timezone
        }
      };
      
      processedEvents.push(discordEvent);
    });
    
    console.log('');
  });

  return processedEvents;
}

// Function to show what the Discord events would look like
function showDiscordEventPreview(events) {
  console.log('🎯 Discord Event Preview:');
  console.log('========================\n');
  
  events.forEach((event, index) => {
    console.log(`Discord Event ${index + 1}:`);
    console.log(`  Name: ${event.name}`);
    console.log(`  Description: ${event.description}`);
    console.log(`  Start: ${event.scheduledStartTime.toLocaleString()}`);
    console.log(`  End: ${event.scheduledEndTime.toLocaleString()}`);
    console.log(`  Location: ${event.location}`);
    console.log(`  URL: ${event.url}`);
    console.log('');
  });
}

// Real API test function with authentication
async function testRealStartGGAPI(countryCode = 'DE', videogameIds = null) {
  console.log(`🔑 Testing Real Start.gg API for country: ${countryCode} (requires authentication)...\n`);
  
  if (!process.env.START_GG_TOKEN) {
    console.log('⚠️ No START_GG_TOKEN found in .env file');
    console.log('💡 To test with real data, add your Start.gg API token to .env:');
    console.log('   START_GG_TOKEN=your_actual_token_here\n');
    return null;
  }

  try {
    // Official start.gg query for tournaments by country with videogame filtering
    // Based on: https://developer.start.gg/docs/examples/queries/tournaments-by-location
    const query = `
      query TournamentsByCountry($cCode: String!, $perPage: Int!, $videogameIds: [ID!]) {
        tournaments(query: {
          perPage: $perPage
          filter: {
            countryCode: $cCode
            videogameIds: $videogameIds
          }
        }) {
          nodes {
            id
            name
            slug
            countryCode
            startAt
            endAt
            numAttendees
            venueAddress
            venueName
            city
            addrState
            postalCode
            lat
            lng
            timezone
            events {
              id
              name
              slug
              numEntrants
              videogame {
                id
                name
                displayName
              }
            }
            streams {
              streamName
              streamSource
            }
            images {
              url
              type
            }
          }
        }
      }
    `;

    // Parse videogame IDs from environment variable, parameter, or use default
    let gameIds;
    if (videogameIds) {
      gameIds = Array.isArray(videogameIds) ? videogameIds : [videogameIds];
    } else {
      const videogameIdsString = process.env.VIDEOGAME_IDS || "1";
      gameIds = videogameIdsString.split(',').map(id => parseInt(id.trim()));
    }

    const variables = {
      cCode: countryCode.toUpperCase(),
      perPage: 100, // Increased from 10 to 100 tournaments
      videogameIds: gameIds
    };

    console.log(`📡 Querying tournaments for country code: ${variables.cCode}`);
    console.log(`🎮 Filtering by videogame IDs: ${variables.videogameIds.join(', ')}`);
    console.log(`📊 Requesting up to ${variables.perPage} tournaments\n`);

    const response = await fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.START_GG_TOKEN}`,
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.log('❌ GraphQL Errors:', JSON.stringify(data.errors, null, 2));
      throw new Error('GraphQL query returned errors');
    }

    console.log('✅ Real API Response:');
    console.log(JSON.stringify(data, null, 2));
    return data;

  } catch (error) {
    console.error('❌ Real API Error:', error.message);
    return null;
  }
}

// Create Discord client
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildScheduledEvents
  ] 
});

// Function to clear all events from a guild
async function clearAllEvents(guild) {
  try {
    console.log(`🧹 Clearing all events from guild "${guild.name}"...`);
    const events = await guild.scheduledEvents.fetch();
    
    if (events.size === 0) {
      console.log(`📝 No events found in guild "${guild.name}"`);
      return 0;
    }
    
    let deletedCount = 0;
    for (const [eventId, event] of events) {
      try {
        await event.delete();
        console.log(`🗑️ Deleted event: "${event.name}"`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Failed to delete event "${event.name}":`, error.message);
      }
    }
    
    console.log(`✅ Deleted ${deletedCount} events from guild "${guild.name}"`);
    return deletedCount;
  } catch (error) {
    console.error(`❌ Error clearing events from guild "${guild.name}":`, error.message);
    return 0;
  }
}

// Function to check if a tournament event already exists (using cached list)
function tournamentExistsInCache(tournamentName, cachedEventNames) {
  return cachedEventNames.has(tournamentName);
}

// Function to create events from tournament data (one event per tournament with internal cache)
async function createEventsFromTournaments(guild, tournaments) {
  if (!tournaments || !tournaments.length) {
    console.log(`⚠️ No tournaments found for guild "${guild.name}"`);
    return;
  }

  let eventsCreated = 0;
  let eventsSkipped = 0;
  const maxEvents = 100; // Increased limit for more tournaments

  // Fetch existing events once and create a Set for fast lookups
  console.log(`🔍 Fetching existing events for duplicate checking...`);
  const existingEvents = await guild.scheduledEvents.fetch();
  const cachedEventNames = new Set();
  
  // Populate the cache with existing event names
  existingEvents.forEach((event) => {
    cachedEventNames.add(event.name);
  });
  
  console.log(`📋 Found ${existingEvents.size} existing events, cached ${cachedEventNames.size} event names`);

  for (const tournament of tournaments.slice(0, maxEvents)) {
    try {
      const startTime = new Date(tournament.startAt * 1000);
      const endTime = new Date(tournament.endAt * 1000);
      
      // Skip events that are in the past
      if (endTime < new Date()) {
        continue;
      }

      // Check if tournament event already exists using cached set
      if (tournamentExistsInCache(tournament.name, cachedEventNames)) {
        console.log(`⏭️ Skipping duplicate tournament: "${tournament.name}"`);
        eventsSkipped++;
        continue;
      }

      // Gather all games for this tournament
      const games = tournament.events?.map(event => event.name).filter(Boolean) || [];
      
      // Create description with link, games, venue, and streams
      let description = `🔗 Event Page: https://start.gg/${tournament.slug}\n\n`;
      if (games.length > 0) {
        description += `🎮 Games: ${games.join(', ')}\n`;
      }
      if (tournament.venueName) {
        description += `📍 Venue: ${tournament.venueName}\n`;
      }
      
      // Add Twitch stream links if available
      if (tournament.streams && tournament.streams.length > 0) {
        const twitchStreams = tournament.streams
          .filter(stream => stream.streamSource === 'TWITCH' && stream.streamName)
          .map(stream => `https://www.twitch.tv/${stream.streamName}`);
        
        if (twitchStreams.length > 0) {
          description += `📺 Stream${twitchStreams.length > 1 ? 's' : ''}: ${twitchStreams.join(', ')}`;
        }
      }

      const eventData = {
        name: tournament.name,
        description: description,
        scheduledStartTime: startTime,
        scheduledEndTime: endTime,
        privacyLevel: 2,
        entityType: 3,
        entityMetadata: {
          location: tournament.venueAddress || `${tournament.city}, ${tournament.addrState}`,
          url: `https://start.gg/${tournament.slug}`
        }
      };

      const discordEvent = await guild.scheduledEvents.create(eventData);
      console.log(`✅ Created tournament event "${discordEvent.name}" in guild "${guild.name}"`);
      
      // Add the newly created event to our cache to prevent future duplicates in this run
      cachedEventNames.add(discordEvent.name);
      eventsCreated++;
    } catch (error) {
      console.error(`❌ Error creating event for tournament "${tournament.name}":`, error.message);
    }
  }

  console.log(`✅ Created ${eventsCreated} new tournament events in guild "${guild.name}"`);
  if (eventsSkipped > 0) {
    console.log(`⏭️ Skipped ${eventsSkipped} duplicate tournaments in guild "${guild.name}"`);
  }
}

// Function to clear all events from all guilds
async function clearAllEventsTask() {
  console.log('🧹 Running clear all events task...');
  
  const guilds = client.guilds.cache;
  
  console.log(`🔍 Bot is connected to ${guilds.size} server(s)`);
  if (guilds.size > 0) {
    console.log('📋 Server details:');
    guilds.forEach((guild, guildId) => {
      console.log(`   - ${guild.name} (ID: ${guildId}, Members: ${guild.memberCount})`);
    });
  }
  
  if (guilds.size === 0) {
    console.log('⚠️ Bot is not in any servers');
    return;
  }

  let totalDeleted = 0;
  for (const [guildId, guild] of guilds) {
    const deleted = await clearAllEvents(guild);
    totalDeleted += deleted;
  }
  
  console.log(`✅ Completed clear events task. Deleted ${totalDeleted} total events from ${guilds.size} server(s)`);
}

// Main task function
async function runPeriodicTask() {
  console.log('🔄 Running periodic task...');
  
  const guilds = client.guilds.cache;
  
  console.log(`🔍 Bot is connected to ${guilds.size} server(s)`);
  if (guilds.size > 0) {
    console.log('📋 Server details:');
    guilds.forEach((guild, guildId) => {
      console.log(`   - ${guild.name} (ID: ${guildId}, Members: ${guild.memberCount})`);
    });
  }
  
  if (guilds.size === 0) {
    console.log('⚠️ Bot is not in any servers');
    console.log('💡 Make sure the bot has been invited with the correct permissions:');
    console.log('   - View Channels');
    console.log('   - Manage Events');
    console.log('   - Create Events');
    return;
  }

  console.log('📡 Fetching tournament data from start.gg API...');
  try {
    const apiData = await testRealStartGGAPI();
    
    if (apiData && apiData.data && apiData.data.tournaments) {
      const tournaments = apiData.data.tournaments.nodes;
      console.log(`📊 Found ${tournaments.length} tournaments`);
      
      for (const [guildId, guild] of guilds) {
        await createEventsFromTournaments(guild, tournaments);
      }
    } else {
      console.log('⚠️ No valid tournament data received');
    }
  } catch (error) {
    console.error('❌ Error fetching tournament data:', error.message);
  }
  
  console.log(`✅ Completed periodic task for ${guilds.size} server(s)`);
}

// Check command line arguments
const isTestMode = process.argv.includes('--test') || process.argv.includes('-t');
const isManualTrigger = process.argv.includes('--trigger') || process.argv.includes('--manual');
const isClearMode = process.argv.includes('--clear') || process.argv.includes('--clear-events');

// Client ready handler
client.once(Events.ClientReady, async readyClient => {
  console.log(`✅ Logged in as ${readyClient.user.tag}!`);
  console.log(`🤖 Bot ID: ${readyClient.user.id}`);
  console.log(`📱 Bot Application ID: ${readyClient.application.id}`);
  
  // Wait a moment for guild cache to populate
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Try to fetch guilds manually
  try {
    console.log('🔄 Fetching guilds...');
    const fetchedGuilds = await readyClient.guilds.fetch();
    console.log(`📊 Fetched ${fetchedGuilds.size} guild(s)`);
    
    if (fetchedGuilds.size > 0) {
      console.log('📋 Guild details:');
      fetchedGuilds.forEach((guild) => {
        console.log(`   - ${guild.name} (ID: ${guild.id})`);
      });
    }
  } catch (error) {
    console.error('❌ Error fetching guilds:', error.message);
  }
  
  if (isTestMode) {
    console.log('🧪 Running in TEST MODE - API test only');
    const countryArg = process.argv.find(arg => arg.startsWith('--country='));
    const countryCode = countryArg ? countryArg.split('=')[1] : 'DE';
    const gameArg = process.argv.find(arg => arg.startsWith('--games='));
    let videogameIds = null;
    if (gameArg) {
      videogameIds = gameArg.split('=')[1].split(',').map(id => parseInt(id.trim()));
    }
    
    const realData = await testRealStartGGAPI(countryCode, videogameIds);
    if (realData) {
      const processedEvents = processStartGGData(realData);
      showDiscordEventPreview(processedEvents);
    }
    console.log('✅ Test completed. Exiting...');
    process.exit(0);
  }
  
  if (isManualTrigger) {
    console.log('🎯 Manual trigger mode - creating events now...');
    await runPeriodicTask();
    console.log('✅ Manual event creation completed. Exiting...');
    process.exit(0);
  }
  
  if (isClearMode) {
    console.log('🧹 Clear events mode - deleting all events now...');
    await clearAllEventsTask();
    console.log('✅ Clear events completed. Exiting...');
    process.exit(0);
  }
  
  // Initial run
  runPeriodicTask();
  
  // Schedule to run twice daily at 8 AM and 8 PM
  function scheduleNextRun() {
    const now = new Date();
    const nextRun = new Date();
    
    // Set to 8 AM today
    nextRun.setHours(8, 0, 0, 0);
    
    // If 8 AM has passed today, check if 8 PM has passed
    if (now >= nextRun) {
      // Set to 8 PM today
      nextRun.setHours(20, 0, 0, 0);
      
      // If 8 PM has also passed, set to 8 AM tomorrow
      if (now >= nextRun) {
        nextRun.setDate(nextRun.getDate() + 1);
        nextRun.setHours(8, 0, 0, 0);
      }
    }
    
    const timeUntilNext = nextRun.getTime() - now.getTime();
    const hoursUntil = Math.round(timeUntilNext / (1000 * 60 * 60) * 10) / 10;
    
    console.log(`⏰ Next scheduled run: ${nextRun.toLocaleString()} (in ${hoursUntil} hours)`);
    
    setTimeout(() => {
      runPeriodicTask();
      scheduleNextRun(); // Schedule the next run after this one completes
    }, timeUntilNext);
  }
  
  scheduleNextRun();
});

// Add error handling and additional event listeners
client.on('error', error => {
  console.error('❌ Discord client error:', error);
});

client.on('warn', warning => {
  console.warn('⚠️ Discord client warning:', warning);
});

client.on('guildCreate', guild => {
  console.log(`✅ Bot added to new guild: ${guild.name} (ID: ${guild.id})`);
});

client.on('guildDelete', guild => {
  console.log(`❌ Bot removed from guild: ${guild.name} (ID: ${guild.id})`);
});

// Handle API-only mode
if (process.argv.includes('--api-only') || process.argv.includes('-a')) {
  console.log('🧪 Running API test without Discord bot...');
  
  const countryArg = process.argv.find(arg => arg.startsWith('--country='));
  const countryCode = countryArg ? countryArg.split('=')[1] : 'DE';
  const gameArg = process.argv.find(arg => arg.startsWith('--games='));
  let videogameIds = null;
  if (gameArg) {
    videogameIds = gameArg.split('=')[1].split(',').map(id => parseInt(id.trim()));
  }
  
  testRealStartGGAPI(countryCode, videogameIds).then((data) => {
    if (data) {
      const processedEvents = processStartGGData(data);
      showDiscordEventPreview(processedEvents);
    }
    console.log('✅ API test completed. Exiting...');
    process.exit(0);
  });
} else {
  console.log('🔐 Attempting to log in to Discord...');
  console.log(`🔑 Using token: ${process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.substring(0, 10) + '...' : 'NOT FOUND'}`);
  client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('❌ Login failed:', error.message);
    process.exit(1);
  });
}